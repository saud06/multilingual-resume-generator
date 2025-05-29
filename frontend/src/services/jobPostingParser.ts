export interface ParsedJobPosting {
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  experience: string;
  education: string;
  benefits: string[];
  salary: string;
  jobType: string; // full-time, part-time, contract, etc.
  remote: boolean;
  language: 'en' | 'de';
}

export interface SkillMatch {
  skill: string;
  matched: boolean;
  importance: 'high' | 'medium' | 'low';
}

export interface JobMatchAnalysis {
  overallMatch: number; // percentage
  skillMatches: SkillMatch[];
  missingSkills: string[];
  recommendations: string[];
  tailoredSummary: string;
}

class JobPostingParserService {
  // Parse job posting text
  parseJobPosting(jobText: string, language: 'en' | 'de' = 'en'): ParsedJobPosting {
    const lines = jobText.split('\n').filter(line => line.trim());
    
    return {
      title: this.extractTitle(jobText, language),
      company: this.extractCompany(jobText, language),
      location: this.extractLocation(jobText, language),
      description: this.extractDescription(jobText, language),
      requirements: this.extractRequirements(jobText, language),
      skills: this.extractSkills(jobText, language),
      experience: this.extractExperience(jobText, language),
      education: this.extractEducation(jobText, language),
      benefits: this.extractBenefits(jobText, language),
      salary: this.extractSalary(jobText, language),
      jobType: this.extractJobType(jobText, language),
      remote: this.extractRemote(jobText, language),
      language
    };
  }

  // Analyze how well a resume matches a job posting
  analyzeJobMatch(
    resumeSkills: string[],
    resumeExperience: any[],
    jobPosting: ParsedJobPosting
  ): JobMatchAnalysis {
    const skillMatches = this.analyzeSkillMatches(resumeSkills, jobPosting.skills);
    const missingSkills = this.findMissingSkills(resumeSkills, jobPosting.skills);
    const overallMatch = this.calculateOverallMatch(skillMatches, resumeExperience, jobPosting);
    const recommendations = this.generateRecommendations(skillMatches, missingSkills, jobPosting);
    const tailoredSummary = this.generateTailoredSummary(jobPosting, overallMatch);

    return {
      overallMatch,
      skillMatches,
      missingSkills,
      recommendations,
      tailoredSummary
    };
  }

  // Extract job title
  private extractTitle(text: string, language: 'en' | 'de'): string {
    const titlePatterns = language === 'de' 
      ? [/stelle[n]?[:\-\s]+(.*)/i, /position[:\-\s]+(.*)/i, /job[:\-\s]+(.*)/i]
      : [/job title[:\-\s]+(.*)/i, /position[:\-\s]+(.*)/i, /role[:\-\s]+(.*)/i];
    
    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim().split('\n')[0];
    }
    
    // Fallback: first line that looks like a title
    const lines = text.split('\n');
    for (const line of lines.slice(0, 5)) {
      if (line.trim().length > 10 && line.trim().length < 100) {
        return line.trim();
      }
    }
    
    return 'Unknown Position';
  }

  // Extract company name
  private extractCompany(text: string, language: 'en' | 'de'): string {
    const companyPatterns = language === 'de'
      ? [/unternehmen[:\-\s]+(.*)/i, /firma[:\-\s]+(.*)/i, /company[:\-\s]+(.*)/i]
      : [/company[:\-\s]+(.*)/i, /employer[:\-\s]+(.*)/i, /organization[:\-\s]+(.*)/i];
    
    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim().split('\n')[0];
    }
    
    return 'Unknown Company';
  }

  // Extract location
  private extractLocation(text: string, language: 'en' | 'de'): string {
    const locationPatterns = [
      /location[:\-\s]+(.*)/i,
      /standort[:\-\s]+(.*)/i,
      /ort[:\-\s]+(.*)/i,
      /address[:\-\s]+(.*)/i,
      /based in[:\-\s]+(.*)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = text.match(pattern);
      if (match) return match[1].trim().split('\n')[0];
    }
    
    // Look for city patterns
    const cityPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*),?\s*([A-Z]{2,})\b/;
    const cityMatch = text.match(cityPattern);
    if (cityMatch) return cityMatch[0];
    
    return 'Remote/Unspecified';
  }

  // Extract job description
  private extractDescription(text: string, language: 'en' | 'de'): string {
    const descKeywords = language === 'de'
      ? ['beschreibung', 'aufgaben', 'tätigkeiten']
      : ['description', 'responsibilities', 'duties'];
    
    const lines = text.split('\n');
    let startIndex = -1;
    
    // Find description section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (descKeywords.some(keyword => line.includes(keyword))) {
        startIndex = i;
        break;
      }
    }
    
    if (startIndex !== -1) {
      const descLines = [];
      for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Stop at next section
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('requirements') || lowerLine.includes('qualifications') || 
            lowerLine.includes('anforderungen') || lowerLine.includes('benefits')) {
          break;
        }
        
        descLines.push(line);
        if (descLines.join(' ').length > 300) break;
      }
      
      if (descLines.length > 0) {
        return descLines.join(' ').trim();
      }
    }
    
    // Fallback: first substantial paragraph
    const paragraphs = text.split('\n\n');
    for (const para of paragraphs) {
      if (para.length > 100) return para.trim();
    }
    
    return text.substring(0, 300) + '...';
  }

  // Extract requirements
  private extractRequirements(text: string, language: 'en' | 'de'): string[] {
    const reqKeywords = language === 'de'
      ? ['anforderungen', 'voraussetzungen', 'qualifikationen']
      : ['requirements', 'qualifications', 'must have'];
    
    const lines = text.split('\n');
    let startIndex = -1;
    
    // Find requirements section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (reqKeywords.some(keyword => line.includes(keyword))) {
        startIndex = i;
        break;
      }
    }
    
    if (startIndex !== -1) {
      const requirements = [];
      for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Stop at next section
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('benefits') || lowerLine.includes('salary') || 
            lowerLine.includes('contact') || lowerLine.includes('apply')) {
          break;
        }
        
        // Clean up bullet points
        const cleanLine = line.replace(/^[•\-\*\+]\s*/, '').trim();
        if (cleanLine.length > 5) {
          requirements.push(cleanLine);
        }
        
        if (requirements.length >= 10) break;
      }
      
      return requirements;
    }
    
    return [];
  }

  // Extract skills
  private extractSkills(text: string, language: 'en' | 'de'): string[] {
    const commonSkills = language === 'de' 
      ? [
          'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
          'Python', 'Java', 'C#', 'PHP', 'Laravel', 'Django', 'Spring',
          'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
          'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'Agile', 'Scrum',
          'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap', 'Figma',
          'Photoshop', 'Illustrator', 'Sketch', 'InVision', 'Zeplin'
        ]
      : [
          'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
          'Python', 'Java', 'C#', 'PHP', 'Laravel', 'Django', 'Spring',
          'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes',
          'AWS', 'Azure', 'GCP', 'Git', 'Linux', 'Agile', 'Scrum',
          'HTML', 'CSS', 'Sass', 'Tailwind', 'Bootstrap', 'Figma',
          'Photoshop', 'Illustrator', 'Sketch', 'InVision', 'Zeplin'
        ];
    
    const foundSkills: string[] = [];
    const textLower = text.toLowerCase();
    
    for (const skill of commonSkills) {
      if (textLower.includes(skill.toLowerCase())) {
        foundSkills.push(skill);
      }
    }
    
    return foundSkills;
  }

  // Extract experience requirements
  private extractExperience(text: string, language: 'en' | 'de'): string {
    const expPatterns = language === 'de'
      ? [/(\d+)\+?\s*jahre?\s*(berufserfahrung|erfahrung)/i,
         /mindestens\s*(\d+)\s*jahre?/i]
      : [/(\d+)\+?\s*years?\s*(experience|exp)/i,
         /minimum\s*(\d+)\s*years?/i,
         /at least\s*(\d+)\s*years?/i];
    
    for (const pattern of expPatterns) {
      const match = text.match(pattern);
      if (match) return `${match[1]}+ years`;
    }
    
    if (text.toLowerCase().includes('entry level') || text.toLowerCase().includes('junior')) {
      return '0-2 years';
    }
    
    if (text.toLowerCase().includes('senior') || text.toLowerCase().includes('lead')) {
      return '5+ years';
    }
    
    return 'Not specified';
  }

  // Extract education requirements
  private extractEducation(text: string, language: 'en' | 'de'): string {
    const eduPatterns = language === 'de'
      ? [/bachelor|master|diplom|studium|abschluss/i]
      : [/bachelor|master|degree|diploma|university|college/i];
    
    for (const pattern of eduPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    
    return 'Not specified';
  }

  // Extract benefits
  private extractBenefits(text: string, language: 'en' | 'de'): string[] {
    const benefitKeywords = language === 'de'
      ? ['benefits', 'vorteile', 'leistungen']
      : ['benefits', 'perks', 'what we offer'];
    
    const lines = text.split('\n');
    let startIndex = -1;
    
    // Find benefits section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (benefitKeywords.some(keyword => line.includes(keyword))) {
        startIndex = i;
        break;
      }
    }
    
    if (startIndex !== -1) {
      const benefits = [];
      for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Stop at next section
        const lowerLine = line.toLowerCase();
        if (lowerLine.includes('requirements') || lowerLine.includes('contact') || 
            lowerLine.includes('apply') || lowerLine.includes('anforderungen')) {
          break;
        }
        
        // Clean up bullet points
        const cleanLine = line.replace(/^[•\-\*\+]\s*/, '').trim();
        if (cleanLine.length > 5) {
          benefits.push(cleanLine);
        }
        
        if (benefits.length >= 8) break;
      }
      
      return benefits;
    }
    
    return [];
  }

  // Extract salary information
  private extractSalary(text: string, language: 'en' | 'de'): string {
    const salaryPatterns = [
      /\$\d{2,3}[,.]?\d{0,3}k?[-–]\$?\d{2,3}[,.]?\d{0,3}k?/i,
      /€\d{2,3}[,.]?\d{0,3}k?[-–]€?\d{2,3}[,.]?\d{0,3}k?/i,
      /\d{2,3}[,.]?\d{0,3}k?[-–]\d{2,3}[,.]?\d{0,3}k?\s*(?:€|\$|USD|EUR)/i
    ];
    
    for (const pattern of salaryPatterns) {
      const match = text.match(pattern);
      if (match) return match[0];
    }
    
    return 'Not specified';
  }

  // Extract job type
  private extractJobType(text: string, language: 'en' | 'de'): string {
    const textLower = text.toLowerCase();
    
    if (textLower.includes('full-time') || textLower.includes('vollzeit')) return 'Full-time';
    if (textLower.includes('part-time') || textLower.includes('teilzeit')) return 'Part-time';
    if (textLower.includes('contract') || textLower.includes('freelance')) return 'Contract';
    if (textLower.includes('internship') || textLower.includes('praktikum')) return 'Internship';
    
    return 'Full-time';
  }

  // Extract remote work information
  private extractRemote(text: string, language: 'en' | 'de'): boolean {
    const textLower = text.toLowerCase();
    const remoteKeywords = language === 'de'
      ? ['remote', 'homeoffice', 'home office', 'fernarbeit']
      : ['remote', 'work from home', 'wfh', 'distributed', 'virtual'];
    
    return remoteKeywords.some(keyword => textLower.includes(keyword));
  }

  // Analyze skill matches
  private analyzeSkillMatches(resumeSkills: string[], jobSkills: string[]): SkillMatch[] {
    return jobSkills.map(jobSkill => ({
      skill: jobSkill,
      matched: resumeSkills.some(resumeSkill => 
        resumeSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(resumeSkill.toLowerCase())
      ),
      importance: this.getSkillImportance(jobSkill)
    }));
  }

  // Find missing skills
  private findMissingSkills(resumeSkills: string[], jobSkills: string[]): string[] {
    return jobSkills.filter(jobSkill => 
      !resumeSkills.some(resumeSkill => 
        resumeSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
        jobSkill.toLowerCase().includes(resumeSkill.toLowerCase())
      )
    );
  }

  // Calculate overall match percentage
  private calculateOverallMatch(
    skillMatches: SkillMatch[],
    resumeExperience: any[],
    jobPosting: ParsedJobPosting
  ): number {
    const skillScore = skillMatches.length > 0 
      ? (skillMatches.filter(s => s.matched).length / skillMatches.length) * 100
      : 0;
    
    // Simple calculation - can be enhanced
    return Math.round(skillScore);
  }

  // Generate recommendations
  private generateRecommendations(
    skillMatches: SkillMatch[],
    missingSkills: string[],
    jobPosting: ParsedJobPosting
  ): string[] {
    const recommendations: string[] = [];
    
    if (missingSkills.length > 0) {
      recommendations.push(`Consider highlighting these skills: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    
    const matchedHighImportanceSkills = skillMatches
      .filter(s => s.matched && s.importance === 'high')
      .map(s => s.skill);
    
    if (matchedHighImportanceSkills.length > 0) {
      recommendations.push(`Emphasize your expertise in: ${matchedHighImportanceSkills.slice(0, 3).join(', ')}`);
    }
    
    if (jobPosting.remote) {
      recommendations.push('Mention your remote work experience and self-management skills');
    }
    
    return recommendations;
  }

  // Generate tailored summary
  private generateTailoredSummary(jobPosting: ParsedJobPosting, matchPercentage: number): string {
    const language = jobPosting.language;
    
    if (language === 'de') {
      return `Basierend auf der Stellenausschreibung für ${jobPosting.title} bei ${jobPosting.company} haben Sie eine ${matchPercentage}%ige Übereinstimmung. Ihre Fähigkeiten passen gut zu den Anforderungen dieser Position.`;
    } else {
      return `Based on the job posting for ${jobPosting.title} at ${jobPosting.company}, you have a ${matchPercentage}% match. Your skills align well with the requirements for this position.`;
    }
  }

  // Get skill importance
  private getSkillImportance(skill: string): 'high' | 'medium' | 'low' {
    const highImportanceSkills = [
      'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js',
      'Python', 'Java', 'C#', 'AWS', 'Docker', 'Kubernetes'
    ];
    
    const mediumImportanceSkills = [
      'HTML', 'CSS', 'Git', 'Linux', 'MySQL', 'PostgreSQL', 'MongoDB'
    ];
    
    if (highImportanceSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      return 'high';
    }
    
    if (mediumImportanceSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      return 'medium';
    }
    
    return 'low';
  }
}

export const jobPostingParser = new JobPostingParserService();
