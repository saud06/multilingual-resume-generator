"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiService } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Copy, 
  CheckCircle,
  Briefcase,
  Target
} from 'lucide-react';

interface CoverLetterGeneratorProps {
  resumeData: any;
  language: 'en' | 'de';
}

export default function CoverLetterGenerator({ resumeData, language }: CoverLetterGeneratorProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { isAuthenticated, isDemoMode, useDemoGeneration, demoGenerationsLeft } = useAuth();

  const content = {
    en: {
      title: "Cover Letter Generator",
      description: "Generate a tailored cover letter based on your resume and job description",
      jobDescLabel: "Job Description",
      jobDescPlaceholder: "Paste the job description here...",
      generateButton: "Generate Cover Letter",
      generating: "Generating...",
      copyButton: "Copy to Clipboard",
      copied: "Copied!",
      fallbackNotice: "Using intelligent template generation - Professional quality guaranteed",
      demoNotice: "Demo mode - limited generations available",
      requirements: {
        title: "Requirements",
        resume: "Complete resume data",
        jobDesc: "Job description (minimum 50 characters)"
      },
      tips: {
        title: "Tips for Best Results",
        tip1: "Include specific requirements from the job posting",
        tip2: "Mention company name and position title",
        tip3: "Add key qualifications and skills needed",
        tip4: "Include salary range if mentioned"
      }
    },
    de: {
      title: "Anschreiben-Generator",
      description: "Erstellen Sie ein maßgeschneidertes Anschreiben basierend auf Ihrem Lebenslauf und der Stellenbeschreibung",
      jobDescLabel: "Stellenbeschreibung",
      jobDescPlaceholder: "Stellenbeschreibung hier einfügen...",
      generateButton: "Anschreiben erstellen",
      generating: "Wird erstellt...",
      copyButton: "In Zwischenablage kopieren",
      copied: "Kopiert!",
      fallbackNotice: "KI-Service nicht verfügbar - verwende Template-Generierung",
      demoNotice: "Demo-Modus - begrenzte Generierungen verfügbar",
      requirements: {
        title: "Anforderungen",
        resume: "Vollständige Lebenslauf-Daten",
        jobDesc: "Stellenbeschreibung (mindestens 50 Zeichen)"
      },
      tips: {
        title: "Tipps für beste Ergebnisse",
        tip1: "Spezifische Anforderungen aus der Stellenausschreibung einbeziehen",
        tip2: "Firmenname und Stellenbezeichnung erwähnen",
        tip3: "Wichtige Qualifikationen und benötigte Fähigkeiten hinzufügen",
        tip4: "Gehaltsvorstellung falls erwähnt einbeziehen"
      }
    }
  };

  const currentContent = content[language];

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim() || jobDescription.length < 50) {
      setGenerationError(language === 'en' ? 
        'Please provide a job description with at least 50 characters' : 
        'Bitte geben Sie eine Stellenbeschreibung mit mindestens 50 Zeichen an'
      );
      return;
    }

    // Check demo limits for non-authenticated users
    if (!isAuthenticated && !isDemoMode) {
      setGenerationError(language === 'en' ? 
        'Demo limit reached. Please sign up to continue.' : 
        'Demo-Limit erreicht. Bitte registrieren Sie sich, um fortzufahren.'
      );
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await apiService.generateCoverLetter({
        resume_data: {
          personal_info: {
            firstName: resumeData.personalInfo.firstName,
            lastName: resumeData.personalInfo.lastName,
            email: resumeData.personalInfo.email,
            phone: resumeData.personalInfo.phone,
            location: resumeData.personalInfo.location,
            title: resumeData.personalInfo.title,
            summary: resumeData.personalInfo.summary,
          },
          experiences: resumeData.experiences.map((exp: any) => ({
            id: exp.id,
            company: exp.company,
            position: exp.position,
            startDate: exp.startDate,
            endDate: exp.endDate,
            current: exp.current,
            description: exp.description,
            location: exp.location,
          })),
          education: resumeData.education.map((edu: any) => ({
            id: edu.id,
            institution: edu.institution,
            degree: edu.degree,
            field: edu.field,
            startDate: edu.startDate,
            endDate: edu.endDate,
            gpa: edu.gpa,
          })),
          skills: resumeData.skills,
          languages: resumeData.languages,
          projects: resumeData.projects,
        },
        job_description: jobDescription,
        language: language,
      });

      if (response.success && response.data) {
        // Use demo generation if not authenticated
        if (!isAuthenticated) {
          // useDemoGeneration(); // Hook moved to component level
        }
        
        setGeneratedCoverLetter(response.data.content);
        setIsFallback(response.data.fallback || false);
      } else {
        throw new Error(response.message || 'Failed to generate cover letter');
      }
    } catch (error) {
      console.error('Cover letter generation failed:', error);
      setGenerationError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCoverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const isResumeComplete = resumeData.personalInfo.firstName && 
                          resumeData.personalInfo.lastName && 
                          resumeData.personalInfo.email &&
                          resumeData.experiences.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {currentContent.title}
          </CardTitle>
          <CardDescription>
            {currentContent.description}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Demo Notice */}
          {!isAuthenticated && isDemoMode && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                {currentContent.demoNotice} ({demoGenerationsLeft} remaining)
              </AlertDescription>
            </Alert>
          )}

          {/* Job Description Input */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {currentContent.jobDescLabel}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Textarea
                  placeholder={currentContent.jobDescPlaceholder}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={8}
                  className="min-h-[200px]"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {jobDescription.length} characters
                  </span>
                  {jobDescription.length >= 50 && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerateCoverLetter}
                disabled={isGenerating || !isResumeComplete || jobDescription.length < 50}
                className="w-full bg-gradient-to-r gradient-professional hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    {currentContent.generating}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    {currentContent.generateButton}
                  </>
                )}
              </Button>

              {/* Error Display */}
              {generationError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generationError}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Generated Cover Letter */}
          {generatedCoverLetter && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Generated Cover Letter
                    {isFallback && (
                      <Badge variant="secondary" className="ml-2">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Template
                      </Badge>
                    )}
                  </CardTitle>
                  <Button
                    onClick={handleCopyToClipboard}
                    variant="outline"
                    size="sm"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                        {currentContent.copied}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {currentContent.copyButton}
                      </>
                    )}
                  </Button>
                </div>
                {isFallback && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {currentContent.fallbackNotice}
                    </AlertDescription>
                  </Alert>
                )}
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed bg-gray-50 p-4 rounded-lg border">
                    {generatedCoverLetter}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentContent.requirements.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                {isResumeComplete ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">{currentContent.requirements.resume}</span>
              </div>
              <div className="flex items-center gap-2">
                {jobDescription.length >= 50 ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm">{currentContent.requirements.jobDesc}</span>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{currentContent.tips.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-gray-600">
                <p>• {currentContent.tips.tip1}</p>
                <p>• {currentContent.tips.tip2}</p>
                <p>• {currentContent.tips.tip3}</p>
                <p>• {currentContent.tips.tip4}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
