"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resumeAnalytics, type ResumeAnalytics, type ATSScore } from '@/services/resumeAnalytics';
import { 
  BarChart3, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  FileText,
  Eye,
  Lightbulb,
  Award,
  Zap
} from 'lucide-react';

interface ResumeAnalyticsProps {
  content: string;
  personalInfo: any;
  experiences: any[];
  education: any[];
  skills: string[];
  language: 'en' | 'de';
  onOptimize?: () => void;
}

export default function ResumeAnalyticsComponent({ 
  content, 
  personalInfo, 
  experiences, 
  education, 
  skills, 
  language,
  onOptimize 
}: ResumeAnalyticsProps) {
  const [analytics, setAnalytics] = useState<ResumeAnalytics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeResume = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // Simulate analysis delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const result = resumeAnalytics.analyzeResume(
        content,
        personalInfo,
        experiences,
        education,
        skills,
        language
      );
      
      setAnalytics(result);
    } catch (error) {
      console.error('Resume analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content, personalInfo, experiences, education, skills, language]);

  useEffect(() => {
    if (content && content.trim().length > 0) {
      analyzeResume();
    }
  }, [content, personalInfo, experiences, education, skills, language, analyzeResume]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  const content_text = {
    en: {
      title: "Resume Analytics",
      description: "Comprehensive analysis of your resume's ATS compatibility and optimization",
      analyzing: "Analyzing resume...",
      atsScore: "ATS Score",
      overall: "Overall Score",
      breakdown: "Score Breakdown",
      keywords: "Keywords",
      formatting: "Formatting",
      structure: "Structure",
      length: "Length",
      readability: "Readability",
      strengths: "Strengths",
      weaknesses: "Areas for Improvement",
      recommendations: "Recommendations",
      suggestions: "Suggestions",
      stats: "Statistics",
      wordCount: "Word Count",
      charCount: "Character Count",
      readabilityScore: "Readability Score",
      keywordDensity: "Keyword Density",
      sections: "Section Analysis",
      optimize: "Optimize Resume",
      reanalyze: "Re-analyze"
    },
    de: {
      title: "Lebenslauf-Analyse",
      description: "Umfassende Analyse der ATS-Kompatibilität und Optimierung Ihres Lebenslaufs",
      analyzing: "Analysiere Lebenslauf...",
      atsScore: "ATS-Bewertung",
      overall: "Gesamtbewertung",
      breakdown: "Bewertungsaufschlüsselung",
      keywords: "Schlüsselwörter",
      formatting: "Formatierung",
      structure: "Struktur",
      length: "Länge",
      readability: "Lesbarkeit",
      strengths: "Stärken",
      weaknesses: "Verbesserungsbereiche",
      recommendations: "Empfehlungen",
      suggestions: "Vorschläge",
      stats: "Statistiken",
      wordCount: "Wortanzahl",
      charCount: "Zeichenanzahl",
      readabilityScore: "Lesbarkeits-Score",
      keywordDensity: "Schlüsselwort-Dichte",
      sections: "Abschnittsanalyse",
      optimize: "Lebenslauf optimieren",
      reanalyze: "Neu analysieren"
    }
  };

  const currentContent = content_text[language];

  if (isAnalyzing) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 animate-pulse mx-auto mb-4 text-blue-600" />
            <p className="text-lg font-semibold">{currentContent.analyzing}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-8">
          <div className="text-center">
            <FileText className="h-8 w-8 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No content to analyze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            {currentContent.title}
          </CardTitle>
          <CardDescription>
            {currentContent.description}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* ATS Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {currentContent.atsScore}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Score */}
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-200"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={getScoreColor(analytics.atsScore.overall)}
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeDasharray={`${analytics.atsScore.overall}, 100`}
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-2xl font-bold ${getScoreColor(analytics.atsScore.overall)}`}>
                    {analytics.atsScore.overall}
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-lg">{currentContent.overall}</h3>
              <Badge variant={getScoreBadgeVariant(analytics.atsScore.overall)}>
                {analytics.atsScore.overall >= 80 ? 'Excellent' : 
                 analytics.atsScore.overall >= 60 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>

            {/* Score Breakdown */}
            <div>
              <h4 className="font-semibold mb-4">{currentContent.breakdown}</h4>
              <div className="space-y-3">
                {Object.entries(analytics.atsScore.breakdown).map(([key, score]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium capitalize">
                        {currentContent[key as keyof typeof currentContent] || key}
                      </span>
                      <span className={`text-sm font-semibold ${getScoreColor(score)}`}>
                        {score}%
                      </span>
                    </div>
                    <Progress value={score} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis Tabs */}
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Insights
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            {currentContent.stats}
          </TabsTrigger>
          <TabsTrigger value="keywords" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Keywords
          </TabsTrigger>
        </TabsList>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  {currentContent.strengths}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.atsScore.strengths.length > 0 ? (
                  <ul className="space-y-2">
                    {analytics.atsScore.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No specific strengths identified</p>
                )}
              </CardContent>
            </Card>

            {/* Weaknesses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-5 w-5" />
                  {currentContent.weaknesses}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics.atsScore.weaknesses.length > 0 ? (
                  <ul className="space-y-2">
                    {analytics.atsScore.weaknesses.map((weakness, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{weakness}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No specific weaknesses identified</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {currentContent.recommendations}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.atsScore.recommendations.length > 0 ? (
                <ul className="space-y-2">
                  {analytics.atsScore.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No specific recommendations</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.wordCount}</div>
                <div className="text-sm text-gray-600">{currentContent.wordCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.characterCount}</div>
                <div className="text-sm text-gray-600">{currentContent.charCount}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{Math.round(analytics.readabilityScore)}</div>
                <div className="text-sm text-gray-600">{currentContent.readabilityScore}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Object.keys(analytics.keywordDensity).length}
                </div>
                <div className="text-sm text-gray-600">Keywords Found</div>
              </CardContent>
            </Card>
          </div>

          {/* Section Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.sections}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(analytics.sectionAnalysis).map(([section, hasSection]) => (
                  <div key={section} className="flex items-center gap-2">
                    {hasSection ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm capitalize">{section.replace('has', '')}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keywords Tab */}
        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{currentContent.keywordDensity}</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(analytics.keywordDensity).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.entries(analytics.keywordDensity)
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 20)
                    .map(([keyword, density]) => (
                    <div key={keyword} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{keyword}</span>
                      <Badge variant="outline" className="text-xs">
                        {density}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No keywords detected</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={analyzeResume} variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          {currentContent.reanalyze}
        </Button>
        {onOptimize && (
          <Button onClick={onOptimize}>
            <TrendingUp className="h-4 w-4 mr-2" />
            {currentContent.optimize}
          </Button>
        )}
      </div>
    </div>
  );
}
