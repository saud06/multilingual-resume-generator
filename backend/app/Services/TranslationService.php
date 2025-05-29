<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;

class TranslationService
{
    private string $huggingFaceApiUrl = 'https://api-inference.huggingface.co/models/';
    private array $translationModels;
    private int $maxRetries = 3;
    private int $retryDelay = 2; // seconds

    public function __construct()
    {
        // Free translation models from Hugging Face
        $this->translationModels = [
            'en_to_de' => 'Helsinki-NLP/opus-mt-en-de',
            'de_to_en' => 'Helsinki-NLP/opus-mt-de-en',
            'multilingual' => 'facebook/m2m100_418M', // Multilingual model as fallback
        ];
    }

    /**
     * Translate text between languages
     */
    public function translateText(string $text, string $sourceLang, string $targetLang): array
    {
        // If source and target are the same, return original text
        if ($sourceLang === $targetLang) {
            return [
                'translated_text' => $text,
                'source_language' => $sourceLang,
                'target_language' => $targetLang,
                'model_used' => 'none',
                'fallback' => false
            ];
        }

        // Check cache first
        $cacheKey = "translation_{$sourceLang}_{$targetLang}_" . md5($text);
        $cached = Cache::get($cacheKey);
        
        if ($cached) {
            return array_merge($cached, ['from_cache' => true]);
        }

        // Try AI translation first
        $result = $this->tryAITranslation($text, $sourceLang, $targetLang);
        
        if ($result['success']) {
            // Cache successful translation for 24 hours
            Cache::put($cacheKey, [
                'translated_text' => $result['translated_text'],
                'source_language' => $sourceLang,
                'target_language' => $targetLang,
                'model_used' => $result['model_used'],
                'fallback' => false
            ], 60 * 60 * 24);
            
            return [
                'translated_text' => $result['translated_text'],
                'source_language' => $sourceLang,
                'target_language' => $targetLang,
                'model_used' => $result['model_used'],
                'fallback' => false,
                'from_cache' => false
            ];
        }

        // Fallback to rule-based translation
        Log::warning('AI translation failed, using fallback', [
            'source' => $sourceLang,
            'target' => $targetLang,
            'text_length' => strlen($text)
        ]);

        $fallbackTranslation = $this->fallbackTranslation($text, $sourceLang, $targetLang);
        
        return [
            'translated_text' => $fallbackTranslation,
            'source_language' => $sourceLang,
            'target_language' => $targetLang,
            'model_used' => 'fallback',
            'fallback' => true,
            'from_cache' => false
        ];
    }

    /**
     * Try AI-powered translation using Hugging Face models
     */
    private function tryAITranslation(string $text, string $sourceLang, string $targetLang): array
    {
        // Determine which model to use
        $modelKey = $this->getModelKey($sourceLang, $targetLang);
        $modelName = $this->translationModels[$modelKey];

        // Split long text into chunks to avoid API limits
        $chunks = $this->splitTextIntoChunks($text, 500);
        $translatedChunks = [];

        foreach ($chunks as $chunk) {
            $result = $this->translateChunk($chunk, $modelName, $sourceLang, $targetLang);
            
            if (!$result['success']) {
                return ['success' => false, 'error' => $result['error']];
            }
            
            $translatedChunks[] = $result['text'];
        }

        return [
            'success' => true,
            'translated_text' => implode(' ', $translatedChunks),
            'model_used' => $modelName
        ];
    }

    /**
     * Translate a single chunk of text
     */
    private function translateChunk(string $text, string $modelName, string $sourceLang, string $targetLang): array
    {
        $retries = 0;
        
        while ($retries < $this->maxRetries) {
            try {
                $response = Http::timeout(30)
                    ->withHeaders([
                        'Authorization' => 'Bearer ' . config('services.huggingface.token', ''),
                        'Content-Type' => 'application/json',
                    ])
                    ->post($this->huggingFaceApiUrl . $modelName, [
                        'inputs' => $text,
                        'parameters' => [
                            'src_lang' => $sourceLang,
                            'tgt_lang' => $targetLang,
                            'max_length' => 512,
                            'num_return_sequences' => 1,
                        ]
                    ]);

                if ($response->successful()) {
                    $data = $response->json();
                    
                    if (isset($data[0]['translation_text'])) {
                        return [
                            'success' => true,
                            'text' => $data[0]['translation_text']
                        ];
                    } elseif (isset($data[0]['generated_text'])) {
                        return [
                            'success' => true,
                            'text' => $data[0]['generated_text']
                        ];
                    }
                }

                // If we get a 503 (model loading), wait and retry
                if ($response->status() === 503) {
                    Log::info('Translation model loading, retrying...', ['attempt' => $retries + 1]);
                    sleep($this->retryDelay * ($retries + 1)); // Exponential backoff
                    $retries++;
                    continue;
                }

                Log::error('Translation API error', [
                    'status' => $response->status(),
                    'response' => $response->body(),
                    'model' => $modelName
                ]);

                return [
                    'success' => false,
                    'error' => 'Translation API error: ' . $response->status()
                ];

            } catch (\Exception $e) {
                Log::error('Translation request failed', [
                    'error' => $e->getMessage(),
                    'model' => $modelName,
                    'attempt' => $retries + 1
                ]);

                $retries++;
                if ($retries < $this->maxRetries) {
                    sleep($this->retryDelay * $retries);
                }
            }
        }

        return [
            'success' => false,
            'error' => 'Max retries exceeded'
        ];
    }

    /**
     * Get the appropriate model key for language pair
     */
    private function getModelKey(string $sourceLang, string $targetLang): string
    {
        $pair = "{$sourceLang}_to_{$targetLang}";
        
        if (isset($this->translationModels[$pair])) {
            return $pair;
        }
        
        // Use multilingual model as fallback
        return 'multilingual';
    }

    /**
     * Split text into manageable chunks
     */
    private function splitTextIntoChunks(string $text, int $maxLength): array
    {
        if (strlen($text) <= $maxLength) {
            return [$text];
        }

        $chunks = [];
        $sentences = preg_split('/(?<=[.!?])\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        $currentChunk = '';

        foreach ($sentences as $sentence) {
            if (strlen($currentChunk . ' ' . $sentence) <= $maxLength) {
                $currentChunk .= ($currentChunk ? ' ' : '') . $sentence;
            } else {
                if ($currentChunk) {
                    $chunks[] = $currentChunk;
                }
                $currentChunk = $sentence;
            }
        }

        if ($currentChunk) {
            $chunks[] = $currentChunk;
        }

        return $chunks;
    }

    /**
     * Fallback translation using simple word/phrase replacements
     */
    private function fallbackTranslation(string $text, string $sourceLang, string $targetLang): string
    {
        // Simple dictionary-based translation for common resume terms
        $dictionaries = [
            'en_to_de' => [
                'Experience' => 'Berufserfahrung',
                'Education' => 'Bildung',
                'Skills' => 'Fähigkeiten',
                'Languages' => 'Sprachen',
                'Projects' => 'Projekte',
                'Summary' => 'Zusammenfassung',
                'Profile' => 'Profil',
                'Contact' => 'Kontakt',
                'Present' => 'Heute',
                'Company' => 'Unternehmen',
                'Position' => 'Position',
                'Degree' => 'Abschluss',
                'University' => 'Universität',
                'College' => 'Hochschule',
                'Manager' => 'Manager',
                'Developer' => 'Entwickler',
                'Engineer' => 'Ingenieur',
                'Analyst' => 'Analyst',
                'Consultant' => 'Berater',
                'Specialist' => 'Spezialist',
            ],
            'de_to_en' => [
                'Berufserfahrung' => 'Experience',
                'Bildung' => 'Education',
                'Fähigkeiten' => 'Skills',
                'Sprachen' => 'Languages',
                'Projekte' => 'Projects',
                'Zusammenfassung' => 'Summary',
                'Profil' => 'Profile',
                'Kontakt' => 'Contact',
                'Heute' => 'Present',
                'Unternehmen' => 'Company',
                'Position' => 'Position',
                'Abschluss' => 'Degree',
                'Universität' => 'University',
                'Hochschule' => 'College',
                'Manager' => 'Manager',
                'Entwickler' => 'Developer',
                'Ingenieur' => 'Engineer',
                'Analyst' => 'Analyst',
                'Berater' => 'Consultant',
                'Spezialist' => 'Specialist',
            ]
        ];

        $dictionaryKey = "{$sourceLang}_to_{$targetLang}";
        $dictionary = $dictionaries[$dictionaryKey] ?? [];

        $translatedText = $text;
        foreach ($dictionary as $source => $target) {
            $translatedText = str_ireplace($source, $target, $translatedText);
        }

        return $translatedText;
    }

    /**
     * Check if AI translation should be used (rate limiting)
     */
    private function shouldUseAI(): bool
    {
        $cacheKey = 'translation_api_usage_' . date('Y-m-d-H');
        $currentUsage = Cache::get($cacheKey, 0);
        
        // Limit to 100 API calls per hour to stay within free tier
        if ($currentUsage >= 100) {
            return false;
        }
        
        Cache::put($cacheKey, $currentUsage + 1, 3600); // Cache for 1 hour
        return true;
    }

    /**
     * Translate resume content specifically
     */
    public function translateResume(array $resumeData, string $targetLang): array
    {
        $sourceLang = $resumeData['language'] ?? 'en';
        
        if ($sourceLang === $targetLang) {
            return $resumeData;
        }

        $translatedData = $resumeData;
        $translatedData['language'] = $targetLang;

        // Translate personal info
        if (isset($resumeData['personal_info']['summary'])) {
            $result = $this->translateText($resumeData['personal_info']['summary'], $sourceLang, $targetLang);
            $translatedData['personal_info']['summary'] = $result['translated_text'];
        }

        if (isset($resumeData['personal_info']['title'])) {
            $result = $this->translateText($resumeData['personal_info']['title'], $sourceLang, $targetLang);
            $translatedData['personal_info']['title'] = $result['translated_text'];
        }

        // Translate experiences
        if (isset($resumeData['experiences'])) {
            foreach ($resumeData['experiences'] as $index => $experience) {
                if (isset($experience['position'])) {
                    $result = $this->translateText($experience['position'], $sourceLang, $targetLang);
                    $translatedData['experiences'][$index]['position'] = $result['translated_text'];
                }
                
                if (isset($experience['description'])) {
                    $result = $this->translateText($experience['description'], $sourceLang, $targetLang);
                    $translatedData['experiences'][$index]['description'] = $result['translated_text'];
                }
            }
        }

        // Translate education
        if (isset($resumeData['education'])) {
            foreach ($resumeData['education'] as $index => $education) {
                if (isset($education['degree'])) {
                    $result = $this->translateText($education['degree'], $sourceLang, $targetLang);
                    $translatedData['education'][$index]['degree'] = $result['translated_text'];
                }
                
                if (isset($education['field'])) {
                    $result = $this->translateText($education['field'], $sourceLang, $targetLang);
                    $translatedData['education'][$index]['field'] = $result['translated_text'];
                }
            }
        }

        // Translate generated content if present
        if (isset($resumeData['content'])) {
            $result = $this->translateText($resumeData['content'], $sourceLang, $targetLang);
            $translatedData['content'] = $result['translated_text'];
        }

        return $translatedData;
    }
}
