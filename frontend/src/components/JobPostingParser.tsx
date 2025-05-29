"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { jobPostingParser, type ParsedJobPosting, type JobMatchAnalysis } from '@/services/jobPostingParser';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  GraduationCap,
  Target,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  FileText
} from 'lucide-react';

interface JobPostingParserProps {
  language: 'en' | 'de';
  onJobAnalyzed?: (analysis: JobMatchAnalysis) => void;
  resumeSkills?: string[];
  resumeExperience?: any[];
}

export default function JobPostingParser({ 
  language, 
  onJobAnalyzed,
  resumeSkills = [],
  resumeExperience = []
}: JobPostingParserProps) {
  const [jobText, setJobText] = useState('');
  const [parsedJob, setParsedJob] = useState<ParsedJobPosting | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<JobMatchAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleParseJob = async () => {
    if (!jobText.trim()) return;

    setIsAnalyzing(true);
    try {
      // Parse the job posting
      const parsed = jobPostingParser.parseJobPosting(jobText, language);
      setParsedJob(parsed);

      // Analyze match if resume data is available
      if (resumeSkills.length > 0) {
        const analysis = jobPostingParser.analyzeJobMatch(
          resumeSkills,
          resumeExperience,
          parsed
        );
        setJobAnalysis(analysis);
        onJobAnalyzed?.(analysis);
      }
    } catch (error) {
      console.error('Error parsing job posting:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setJobText('');
    setParsedJob(null);
    setJobAnalysis(null);
  };

  const content = {
    en: {
      title: "Job Posting Parser",
      description: "Paste a job posting to analyze requirements and match with your resume",
      placeholder: "Paste the job posting here...\n\nExample:\nSoftware Developer at TechCorp\nLocation: Berlin, Germany\nWe are looking for a skilled developer with experience in React, Node.js, and TypeScript...",
      parse: "Analyze Job Posting",
      clear: "Clear",
      analyzing: "Analyzing...",
      jobDetails: "Job Details",
      matchAnalysis: "Match Analysis",
      overallMatch: "Overall Match",
      skillsMatch: "Skills Analysis",
      recommendations: "Recommendations",
      matched: "Matched",
      missing: "Missing",
      importance: "Importance"
    },
    de: {
      title: "Stellenausschreibung Parser",
      description: "Fügen Sie eine Stellenausschreibung ein, um Anforderungen zu analysieren",
      placeholder: "Stellenausschreibung hier einfügen...\n\nBeispiel:\nSoftware-Entwickler bei TechCorp\nStandort: Berlin, Deutschland\nWir suchen einen erfahrenen Entwickler mit Kenntnissen in React, Node.js und TypeScript...",
      parse: "Stellenausschreibung Analysieren",
      clear: "Löschen",
      analyzing: "Analysiere...",
      jobDetails: "Stellendetails",
      matchAnalysis: "Übereinstimmungsanalyse",
      overallMatch: "Gesamtübereinstimmung",
      skillsMatch: "Fähigkeitsanalyse",
      recommendations: "Empfehlungen",
      matched: "Übereinstimmend",
      missing: "Fehlend",
      importance: "Wichtigkeit"
    }
  };

  const currentContent = content[language];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          {currentContent.title}
        </CardTitle>
        <CardDescription>
          {currentContent.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <Textarea
            placeholder={currentContent.placeholder}
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={8}
            className="min-h-[200px]"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={handleParseJob}
              disabled={!jobText.trim() || isAnalyzing}
              className="flex items-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  {currentContent.analyzing}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  {currentContent.parse}
                </>
              )}
            </Button>
            
            {(parsedJob || jobText) && (
              <Button variant="outline" onClick={handleClear}>
                {currentContent.clear}
              </Button>
            )}
          </div>
        </div>

        {/* Results Section */}
        {parsedJob && (
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">{currentContent.jobDetails}</TabsTrigger>
              {jobAnalysis && (
                <TabsTrigger value="analysis">{currentContent.matchAnalysis}</TabsTrigger>
              )}
            </TabsList>

            {/* Job Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Basic Info */}
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-primary" />
                        <div>
                          <p className="font-semibold">{parsedJob.title}</p>
                          <p className="text-sm text-gray-600">{parsedJob.company}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        {parsedJob.location}
                        {parsedJob.remote && (
                          <Badge variant="secondary" className="ml-2">Remote</Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        {parsedJob.jobType}
                      </div>
                      
                      {parsedJob.salary !== 'Not specified' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          {parsedJob.salary}
                        </div>
                      )}
                      
                      {parsedJob.experience !== 'Not specified' && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <GraduationCap className="h-4 w-4" />
                          {parsedJob.experience}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Skills */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {parsedJob.skills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Description */}
              {parsedJob.description && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Job Description</h4>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {parsedJob.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {parsedJob.requirements.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {parsedJob.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Match Analysis Tab */}
            {jobAnalysis && (
              <TabsContent value="analysis" className="space-y-4">
                {/* Overall Match */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        {currentContent.overallMatch}
                      </h4>
                      <Badge 
                        variant={jobAnalysis.overallMatch >= 70 ? "default" : 
                                jobAnalysis.overallMatch >= 50 ? "secondary" : "destructive"}
                      >
                        {jobAnalysis.overallMatch}%
                      </Badge>
                    </div>
                    <Progress value={jobAnalysis.overallMatch} className="mb-3" />
                    <p className="text-sm text-gray-600">
                      {jobAnalysis.tailoredSummary}
                    </p>
                  </CardContent>
                </Card>

                {/* Skills Analysis */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3">{currentContent.skillsMatch}</h4>
                    <div className="space-y-2">
                      {jobAnalysis.skillMatches.map((skillMatch, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                          <div className="flex items-center gap-2">
                            {skillMatch.matched ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                            <span className="text-sm">{skillMatch.skill}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={skillMatch.importance === 'high' ? 'default' : 
                                      skillMatch.importance === 'medium' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {skillMatch.importance}
                            </Badge>
                            <Badge variant={skillMatch.matched ? 'default' : 'destructive'} className="text-xs">
                              {skillMatch.matched ? currentContent.matched : currentContent.missing}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                {jobAnalysis.recommendations.length > 0 && (
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {currentContent.recommendations}
                      </h4>
                      <ul className="space-y-2">
                        {jobAnalysis.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm">
                            <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            )}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
