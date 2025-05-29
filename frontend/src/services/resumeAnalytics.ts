export interface ATSScore {
  overall: number; // 0-100
  breakdown: {
    keywords: number;
    formatting: number;
    structure: number;
    length: number;
    readability: number;
  };
  recommendations: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface ResumeAnalytics {
  wordCount: number;
  characterCount: number;
  readabilityScore: number; // Flesch reading ease
  keywordDensity: { [key: string]: number };
  sectionAnalysis: {
    hasSummary: boolean;
    hasExperience: boolean;
    hasEducation: boolean;
    hasSkills: boolean;
    hasContact: boolean;
  };
  atsScore: ATSScore;
  suggestions: string[];
}

class ResumeAnalyticsService {
  // Common ATS-friendly keywords by category
  private readonly atsKeywords = {
    technical: [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
      'Python', 'Java', 'C#', 'PHP', 'Laravel', 'Django', 'Spring',
      'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
      'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'Agile', 'Scrum'
    ],
    soft: [
      'leadership', 'communication', 'teamwork', 'problem-solving',
      'analytical', 'creative', 'innovative', 'collaborative',
      'adaptable', 'detail-oriented', 'organized', 'motivated'
    ],
    action: [
      'achieved', 'developed', 'implemented', 'managed', 'led',
      'created', 'improved', 'increased', 'reduced', 'optimized',
      'designed', 'built', 'delivered', 'executed', 'coordinated'
    ]
  };

  // Analyze complete resume
  analyzeResume(
    content: string,
    personalInfo: any,
    experiences: any[],
    education: any[],
    skills: string[],
    language: 'en' | 'de' = 'en'
  ): ResumeAnalytics {
    const wordCount = this.getWordCount(content);
    const characterCount = content.length;
    const readabilityScore = this.calculateReadabilityScore(content, language);
    const keywordDensity = this.analyzeKeywordDensity(content);
    const sectionAnalysis = this.analyzeSections(content, personalInfo, experiences, education, skills);
    const atsScore = this.calculateATSScore(content, personalInfo, experiences, education, skills, language);
    const suggestions = this.generateSuggestions(content, sectionAnalysis, atsScore, language);

    return {
      wordCount,
      characterCount,
      readabilityScore,
      keywordDensity,
      sectionAnalysis,
      atsScore,
      suggestions
    };
  }

  // Calculate word count
  private getWordCount(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  // Calculate readability score (simplified Flesch Reading Ease)
  private calculateReadabilityScore(text: string, language: 'en' | 'de'): number {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const syllables = this.countSyllables(text, language);

    if (sentences.length === 0 || words.length === 0) return 0;

    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;

    // Flesch Reading Ease formula (adapted for German)
    const multiplier = language === 'de' ? 180 : 206.835;
    const wordFactor = language === 'de' ? 1.015 : 1.015;
    const syllableFactor = language === 'de' ? 84.6 : 84.6;

    const score = multiplier - (wordFactor * avgWordsPerSentence) - (syllableFactor * avgSyllablesPerWord);
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  // Count syllables (simplified)
  private countSyllables(text: string, language: 'en' | 'de'): number {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    let totalSyllables = 0;

    for (const word of words) {
      if (language === 'de') {
        // German syllable counting (simplified)
        const vowels = word.match(/[aeiouäöü]/g) || [];
        totalSyllables += Math.max(1, vowels.length);
      } else {
        // English syllable counting (simplified)
        const vowels = word.match(/[aeiouy]+/g) || [];
        let syllableCount = vowels.length;
        if (word.endsWith('e')) syllableCount--;
        totalSyllables += Math.max(1, syllableCount);
      }
    }

    return totalSyllables;
  }

  // Analyze keyword density
  private analyzeKeywordDensity(content: string): { [key: string]: number } {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const totalWords = words.length;
    const density: { [key: string]: number } = {};

    // Count all keywords
    const allKeywords = [
      ...this.atsKeywords.technical,
      ...this.atsKeywords.soft,
      ...this.atsKeywords.action
    ];

    for (const keyword of allKeywords) {
      const count = words.filter(word => 
        word === keyword.toLowerCase() || 
        content.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      
      if (count > 0) {
        density[keyword] = Math.round((count / totalWords) * 100 * 100) / 100; // Percentage with 2 decimals
      }
    }

    return density;
  }

  // Analyze resume sections
  private analyzeSections(
    content: string,
    personalInfo: any,
    experiences: any[],
    education: any[],
    skills: string[]
  ): ResumeAnalytics['sectionAnalysis'] {
    const contentLower = content.toLowerCase();

    return {
      hasSummary: !!(personalInfo?.summary && personalInfo.summary.trim().length > 0),
      hasExperience: experiences.length > 0,
      hasEducation: education.length > 0,
      hasSkills: skills.length > 0,
      hasContact: !!(personalInfo?.email && personalInfo?.phone)
    };
  }

  // Calculate ATS score
  private calculateATSScore(
    content: string,
    personalInfo: any,
    experiences: any[],
    education: any[],
    skills: string[],
    language: 'en' | 'de'
  ): ATSScore {
    const keywordScore = this.calculateKeywordScore(content);
    const formattingScore = this.calculateFormattingScore(content);
    const structureScore = this.calculateStructureScore(personalInfo, experiences, education, skills);
    const lengthScore = this.calculateLengthScore(content);
    const readabilityScore = this.calculateReadabilityScore(content, language);

    const overall = Math.round(
      (keywordScore * 0.3 + 
       formattingScore * 0.2 + 
       structureScore * 0.25 + 
       lengthScore * 0.15 + 
       readabilityScore * 0.1)
    );

    const recommendations = this.generateATSRecommendations(
      keywordScore, formattingScore, structureScore, lengthScore, readabilityScore, language
    );

    const strengths = this.identifyStrengths(
      keywordScore, formattingScore, structureScore, lengthScore, readabilityScore, language
    );

    const weaknesses = this.identifyWeaknesses(
      keywordScore, formattingScore, structureScore, lengthScore, readabilityScore, language
    );

    return {
      overall,
      breakdown: {
        keywords: keywordScore,
        formatting: formattingScore,
        structure: structureScore,
        length: lengthScore,
        readability: Math.round(readabilityScore)
      },
      recommendations,
      strengths,
      weaknesses
    };
  }

  // Calculate keyword score for ATS
  private calculateKeywordScore(content: string): number {
    const keywordDensity = this.analyzeKeywordDensity(content);
    const keywordCount = Object.keys(keywordDensity).length;
    const totalPossibleKeywords = this.atsKeywords.technical.length + 
                                 this.atsKeywords.soft.length + 
                                 this.atsKeywords.action.length;

    // Score based on keyword coverage and density
    const coverage = (keywordCount / totalPossibleKeywords) * 100;
    const avgDensity = Object.values(keywordDensity).reduce((sum, density) => sum + density, 0) / keywordCount || 0;

    // Optimal density is between 1-3%
    const densityScore = avgDensity >= 1 && avgDensity <= 3 ? 100 : 
                        avgDensity < 1 ? avgDensity * 100 : 
                        Math.max(0, 100 - (avgDensity - 3) * 20);

    return Math.round((coverage * 0.7 + densityScore * 0.3));
  }

  // Calculate formatting score
  private calculateFormattingScore(content: string): number {
    let score = 100;

    // Check for common formatting issues
    if (content.includes('\t')) score -= 10; // Tabs can cause issues
    if (content.match(/\s{3,}/g)) score -= 5; // Multiple spaces
    if (content.match(/[^\x00-\x7F]/g)?.length > content.length * 0.1) score -= 15; // Too many special characters
    if (!content.match(/\n\n/g)) score -= 10; // No paragraph breaks

    // Positive formatting indicators
    if (content.includes('•') || content.includes('-')) score += 5; // Bullet points
    if (content.match(/\b\d{4}\b/g)) score += 5; // Years (dates)
    if (content.match(/@\w+\.\w+/g)) score += 5; // Email format

    return Math.max(0, Math.min(100, score));
  }

  // Calculate structure score
  private calculateStructureScore(
    personalInfo: any,
    experiences: any[],
    education: any[],
    skills: string[]
  ): number {
    let score = 0;

    // Essential sections
    if (personalInfo?.firstName && personalInfo?.lastName) score += 20;
    if (personalInfo?.email) score += 15;
    if (personalInfo?.phone) score += 10;
    if (personalInfo?.summary && personalInfo.summary.length > 50) score += 15;
    if (experiences.length > 0) score += 25;
    if (education.length > 0) score += 10;
    if (skills.length > 0) score += 5;

    return Math.min(100, score);
  }

  // Calculate length score
  private calculateLengthScore(content: string): number {
    const wordCount = this.getWordCount(content);
    
    // Optimal range: 300-800 words
    if (wordCount >= 300 && wordCount <= 800) return 100;
    if (wordCount >= 200 && wordCount < 300) return 80;
    if (wordCount >= 800 && wordCount <= 1000) return 80;
    if (wordCount >= 100 && wordCount < 200) return 60;
    if (wordCount > 1000 && wordCount <= 1200) return 60;
    if (wordCount < 100) return Math.max(0, wordCount);
    return Math.max(0, 100 - (wordCount - 1200) / 20);
  }

  // Generate ATS recommendations
  private generateATSRecommendations(
    keywordScore: number,
    formattingScore: number,
    structureScore: number,
    lengthScore: number,
    readabilityScore: number,
    language: 'en' | 'de'
  ): string[] {
    const recommendations: string[] = [];

    if (language === 'de') {
      if (keywordScore < 70) recommendations.push('Fügen Sie mehr branchenspezifische Schlüsselwörter hinzu');
      if (formattingScore < 80) recommendations.push('Verbessern Sie die Formatierung für bessere ATS-Lesbarkeit');
      if (structureScore < 80) recommendations.push('Stellen Sie sicher, dass alle wichtigen Abschnitte vorhanden sind');
      if (lengthScore < 70) recommendations.push('Optimieren Sie die Länge Ihres Lebenslaufs (300-800 Wörter)');
      if (readabilityScore < 60) recommendations.push('Vereinfachen Sie die Sprache für bessere Lesbarkeit');
    } else {
      if (keywordScore < 70) recommendations.push('Add more industry-specific keywords');
      if (formattingScore < 80) recommendations.push('Improve formatting for better ATS readability');
      if (structureScore < 80) recommendations.push('Ensure all essential sections are present');
      if (lengthScore < 70) recommendations.push('Optimize resume length (300-800 words)');
      if (readabilityScore < 60) recommendations.push('Simplify language for better readability');
    }

    return recommendations;
  }

  // Identify strengths
  private identifyStrengths(
    keywordScore: number,
    formattingScore: number,
    structureScore: number,
    lengthScore: number,
    readabilityScore: number,
    language: 'en' | 'de'
  ): string[] {
    const strengths: string[] = [];

    if (language === 'de') {
      if (keywordScore >= 80) strengths.push('Ausgezeichnete Schlüsselwort-Optimierung');
      if (formattingScore >= 85) strengths.push('ATS-freundliche Formatierung');
      if (structureScore >= 90) strengths.push('Vollständige und gut strukturierte Abschnitte');
      if (lengthScore >= 85) strengths.push('Optimale Länge für ATS-Systeme');
      if (readabilityScore >= 70) strengths.push('Gute Lesbarkeit');
    } else {
      if (keywordScore >= 80) strengths.push('Excellent keyword optimization');
      if (formattingScore >= 85) strengths.push('ATS-friendly formatting');
      if (structureScore >= 90) strengths.push('Complete and well-structured sections');
      if (lengthScore >= 85) strengths.push('Optimal length for ATS systems');
      if (readabilityScore >= 70) strengths.push('Good readability');
    }

    return strengths;
  }

  // Identify weaknesses
  private identifyWeaknesses(
    keywordScore: number,
    formattingScore: number,
    structureScore: number,
    lengthScore: number,
    readabilityScore: number,
    language: 'en' | 'de'
  ): string[] {
    const weaknesses: string[] = [];

    if (language === 'de') {
      if (keywordScore < 60) weaknesses.push('Zu wenige relevante Schlüsselwörter');
      if (formattingScore < 70) weaknesses.push('Formatierungsprobleme für ATS');
      if (structureScore < 70) weaknesses.push('Fehlende wichtige Abschnitte');
      if (lengthScore < 60) weaknesses.push('Suboptimale Länge');
      if (readabilityScore < 50) weaknesses.push('Schwer lesbar');
    } else {
      if (keywordScore < 60) weaknesses.push('Insufficient relevant keywords');
      if (formattingScore < 70) weaknesses.push('Formatting issues for ATS');
      if (structureScore < 70) weaknesses.push('Missing essential sections');
      if (lengthScore < 60) weaknesses.push('Suboptimal length');
      if (readabilityScore < 50) weaknesses.push('Poor readability');
    }

    return weaknesses;
  }

  // Generate general suggestions
  private generateSuggestions(
    content: string,
    sectionAnalysis: ResumeAnalytics['sectionAnalysis'],
    atsScore: ATSScore,
    language: 'en' | 'de'
  ): string[] {
    const suggestions: string[] = [];

    if (language === 'de') {
      if (!sectionAnalysis.hasSummary) {
        suggestions.push('Fügen Sie eine berufliche Zusammenfassung hinzu');
      }
      if (!sectionAnalysis.hasSkills) {
        suggestions.push('Listen Sie Ihre wichtigsten Fähigkeiten auf');
      }
      if (atsScore.overall < 70) {
        suggestions.push('Optimieren Sie Ihren Lebenslauf für ATS-Systeme');
      }
    } else {
      if (!sectionAnalysis.hasSummary) {
        suggestions.push('Add a professional summary section');
      }
      if (!sectionAnalysis.hasSkills) {
        suggestions.push('Include a skills section with relevant keywords');
      }
      if (atsScore.overall < 70) {
        suggestions.push('Optimize your resume for ATS systems');
      }
    }

    return suggestions;
  }
}

export const resumeAnalytics = new ResumeAnalyticsService();
