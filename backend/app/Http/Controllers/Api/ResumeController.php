<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use App\Services\LLMService;
use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Barryvdh\DomPDF\Facade\Pdf;

class ResumeController extends Controller
{
    private LLMService $llmService;
    private TranslationService $translationService;

    public function __construct(LLMService $llmService, TranslationService $translationService)
    {
        $this->llmService = $llmService;
        $this->translationService = $translationService;
    }

    /**
     * Generate a new resume
     */
    public function generate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'personal_info' => 'required|array',
            'personal_info.firstName' => 'required|string|max:255',
            'personal_info.lastName' => 'required|string|max:255',
            'personal_info.email' => 'required|email',
            'experiences' => 'array',
            'education' => 'array',
            'skills' => 'array',
            'languages' => 'array',
            'projects' => 'array',
            'style' => 'required|in:german,international',
            'language' => 'required|in:en,de',
            'tone' => 'required|in:conservative,balanced,dynamic',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();
            
            // Generate resume content using AI
            $result = $this->llmService->generateResume(
                $data,
                $request->input('language', 'en'),
                $request->input('style', 'international'),
                $request->input('tone', 'balanced')
            );

            // Save to database if user is authenticated
            $resume = null;
            if (auth()->check()) {
                $resume = Resume::create([
                    'user_id' => auth()->id(),
                    'title' => $this->generateResumeTitle($data['personal_info']),
                    'personal_info' => $data['personal_info'],
                    'experiences' => $data['experiences'] ?? [],
                    'education' => $data['education'] ?? [],
                    'skills' => $data['skills'] ?? [],
                    'languages' => $data['languages'] ?? [],
                    'projects' => $data['projects'] ?? [],
                    'style' => $request->input('style'),
                    'language' => $request->input('language'),
                    'generated_content' => $result['content'],
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $resume?->id,
                    'content' => $result['content'],
                    'enhanced_data' => $result['enhanced_data'] ?? null,
                    'language' => $result['language'],
                    'style' => $result['style'],
                    'fallback' => $result['fallback'] ?? false,
                    'ai_generated' => $result['ai_generated'] ?? false,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Resume generation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Generate cover letter
     */
    public function generateCoverLetter(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resume_data' => 'required|array',
            'job_description' => 'required|string',
            'language' => 'required|in:en,de',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->llmService->generateCoverLetter(
                $request->input('resume_data'),
                $request->input('job_description'),
                $request->input('language', 'en')
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'content' => $result['content'],
                    'language' => $result['language'],
                    'fallback' => $result['fallback'] ?? false,
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Cover letter generation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Get user's resumes
     */
    public function index(): JsonResponse
    {
        if (!auth()->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required'
            ], 401);
        }

        $resumes = Resume::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc')
            ->get(['id', 'title', 'style', 'language', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $resumes
        ]);
    }

    /**
     * Get specific resume
     */
    public function show(Resume $resume): JsonResponse
    {
        if (!auth()->check() || $resume->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $resume
        ]);
    }

    /**
     * Delete resume
     */
    public function destroy(Resume $resume): JsonResponse
    {
        if (!auth()->check() || $resume->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $resume->delete();

        return response()->json([
            'success' => true,
            'message' => 'Resume deleted successfully'
        ]);
    }

    /**
     * Translate existing resume
     */
    public function translate(Request $request, Resume $resume): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'target_language' => 'required|in:en,de',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        if (!auth()->check() || $resume->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        try {
            $targetLanguage = $request->input('target_language');
            
            if ($resume->language === $targetLanguage) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'content' => $resume->generated_content,
                        'language' => $resume->language,
                        'message' => 'Already in target language'
                    ]
                ]);
            }

            $translatedContent = $this->llmService->translateContent(
                $resume->generated_content,
                $targetLanguage
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'content' => $translatedContent,
                    'language' => $targetLanguage,
                    'original_language' => $resume->language
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Translation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Export resume as PDF
     */
    public function exportPdf(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'personal_info' => 'required|array',
            'personal_info.firstName' => 'required|string',
            'personal_info.lastName' => 'required|string',
            'personal_info.email' => 'required|email',
            'personal_info.phone' => 'required|string',
            'personal_info.location' => 'required|string',
            'experiences' => 'array',
            'education' => 'array',
            'skills' => 'array',
            'content' => 'required|string',
            'enhanced_data' => 'sometimes|array',
            'language' => 'required|string|in:en,de',
            'style' => 'required|string|in:international,german',
            'template' => 'sometimes|string|in:classic,modern,creative',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            
            // Check if we have enhanced data from AI generation
            $enhancedData = $data['enhanced_data'] ?? null;
            
            // Use enhanced data if available, otherwise use original data
            $experiences = $enhancedData['experiences'] ?? $data['experiences'] ?? [];
            $education = $enhancedData['education'] ?? $data['education'] ?? [];
            $skills = $enhancedData['skills'] ?? $data['skills'] ?? [];
            $languages = $enhancedData['languages'] ?? $data['languages'] ?? [];
            $projects = $enhancedData['projects'] ?? $data['projects'] ?? [];
            
            // Determine template to use
            $template = $data['template'] ?? 'classic';
            $templateMap = [
                'classic' => 'pdf.resume',
                'modern' => 'pdf.resume-modern',
                'creative' => 'pdf.resume-creative'
            ];
            
            $templateView = $templateMap[$template] ?? 'pdf.resume';
            
            // Generate PDF with enhanced data
            $pdf = Pdf::loadView($templateView, [
                'personalInfo' => $data['personal_info'],
                'experiences' => $experiences,
                'education' => $education,
                'skills' => $skills,
                'languages' => $languages,
                'projects' => $projects,
                'content' => $data['content'],
                'language' => $data['language'],
                'style' => $data['style'],
                'template' => $template,
                'ai_enhanced' => !empty($enhancedData)
            ]);
            
            // Set paper size and orientation
            $pdf->setPaper('A4', 'portrait');
            
            // Generate filename
            $filename = $this->generateResumeTitle($data['personal_info']) . '.pdf';
            
            // Return PDF as download
            return $pdf->download($filename);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'PDF generation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Translate text
     */
    public function translateText(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string',
            'source_language' => 'required|string|in:en,de',
            'target_language' => 'required|string|in:en,de',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->translationService->translateText(
                $request->input('text'),
                $request->input('source_language'),
                $request->input('target_language')
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Translation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Translate entire resume
     */
    public function translateResume(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'resume_data' => 'required|array',
            'target_language' => 'required|string|in:en,de',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $result = $this->translationService->translateResume(
                $request->input('resume_data'),
                $request->input('target_language')
            );

            return response()->json([
                'success' => true,
                'data' => $result
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Resume translation failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Generate resume title from personal info
     */
    private function generateResumeTitle(array $personalInfo): string
    {
        $name = ($personalInfo['firstName'] ?? '') . ' ' . ($personalInfo['lastName'] ?? '');
        $title = $personalInfo['title'] ?? 'Resume';
        
        return trim($name . ' - ' . $title);
    }
}
