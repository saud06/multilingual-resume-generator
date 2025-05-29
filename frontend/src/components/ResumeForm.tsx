"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSession } from "next-auth/react";
import AuthModal from "./AuthModal";
import DemoStatus from "./DemoStatus";
import JobPostingParser from "./JobPostingParser";
import ResumeAnalyticsComponent from "./ResumeAnalytics";
import CoverLetterGenerator from "./CoverLetterGenerator";
import { resumeStorage } from "@/services/resumeStorage";
import { type JobMatchAnalysis } from "@/services/jobPostingParser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Copy, 
  Eye, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Languages, 
  FolderOpen,
  AlertCircle,
  CheckCircle,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  Globe,
  Zap,
  Sparkles,
  Trash2,
  Plus,
  FileDown
} from "lucide-react";
import { apiService, type GenerateResumeRequest } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: string[];
  projects: string[];
}

export default function ResumeForm() {
  const [currentTab, setCurrentTab] = useState("personal");
  const { language, setLanguage } = useLanguage();
  const [resumeStyle, setResumeStyle] = useState<"german" | "international">("international");
  const [aiTone, setAiTone] = useState<"conservative" | "balanced" | "dynamic">("balanced");
  const [pdfTemplate, setPdfTemplate] = useState<"classic" | "modern" | "creative">("classic");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<string | null>(null);
  const [enhancedResumeData, setEnhancedResumeData] = useState<any>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [jobAnalysis, setJobAnalysis] = useState<JobMatchAnalysis | null>(null);
  
  const { isAuthenticated, isLoading, demoGenerationsLeft, useDemoGeneration, isDemoMode, updateNextAuthSession } = useAuth();
  const { data: session, status } = useSession();

  // Sync NextAuth session with AuthContext
  useEffect(() => {
    updateNextAuthSession(session);
  }, [session, updateNextAuthSession]);

  // Load selected template or existing resume from localStorage
  useEffect(() => {
    // Check for editing resume first (this takes priority over form persistence)
    const editingResume = localStorage.getItem('editingResume');
    const viewingResume = localStorage.getItem('viewingResume');
    
    if (editingResume || viewingResume) {
      try {
        const resume = JSON.parse(editingResume || viewingResume || '{}');
        
        // Load resume data
        setResumeData({
          personalInfo: resume.personalInfo || {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            location: "",
            title: "",
            summary: ""
          },
          experiences: resume.experiences || [],
          education: resume.education || [],
          skills: resume.skills || [],
          languages: resume.languages || [],
          projects: resume.projects || []
        });
        
        // Set resume settings
        setResumeStyle(resume.style || 'international');
        setPdfTemplate((resume as any).template || 'classic');
        setGeneratedResume(resume.content || null);
        
        // Clear localStorage
        localStorage.removeItem('editingResume');
        localStorage.removeItem('viewingResume');
        localStorage.removeItem(FORM_DATA_KEY);
        
        // Show notification
        const message = language === 'de' 
          ? `Lebenslauf "${resume.personalInfo?.firstName} ${resume.personalInfo?.lastName}" wurde geladen`
          : `Resume "${resume.personalInfo?.firstName} ${resume.personalInfo?.lastName}" has been loaded`;
        console.log(message);
        
      } catch (error) {
        console.error('Error loading resume:', error);
      }
    }
  }, [language]);

  // Form data persistence functions (only for resume content, not generation settings)
  const FORM_DATA_KEY = 'resumeFormData';
  
  const saveFormDataToStorage = (data: ResumeData) => {
    try {
      // Only save the actual form data, not the generation settings
      localStorage.setItem(FORM_DATA_KEY, JSON.stringify(data));
      console.log('Form data saved to localStorage:', data);
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const loadFormDataFromStorage = (): ResumeData | null => {
    try {
      const saved = localStorage.getItem(FORM_DATA_KEY);
      console.log('Raw localStorage data:', saved);
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('Parsed localStorage data:', parsed);
        
        // Check if this is old format with settings mixed in
        if (parsed.resumeStyle || parsed.aiTone || parsed.pdfTemplate) {
          // Extract only the resume data, ignore old settings
          const { resumeStyle: _, aiTone: __, pdfTemplate: ___, language: ____, ...resumeData } = parsed;
          console.log('Migrated old format, extracted resume data:', resumeData);
          return resumeData;
        }
        
        // New format - just return the data
        return parsed;
      }
    } catch (error) {
      console.error('Error loading form data:', error);
    }
    return null;
  };

  const clearFormData = () => {
    const confirmMessage = language === 'de' 
      ? 'Sind Sie sicher, dass Sie alle Formulardaten zurücksetzen möchten? diese Aktion kann nicht rückgängig gemacht werden.'
      : 'Are you sure you want to reset all form data? This action cannot be undone.';
    
    if (!confirm(confirmMessage)) {
      return;
    }
    
    const emptyData: ResumeData = {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        title: "",
        summary: ""
      },
      experiences: [],
      education: [],
      skills: [],
      languages: [],
      projects: []
    };
    
    setResumeData(emptyData);
    setGeneratedResume(null);
    setEnhancedResumeData(null);
    setGenerationError(null);
    setJobAnalysis(null);
    
    // Clear localStorage
    localStorage.removeItem(FORM_DATA_KEY);
    
    // Reset form settings to defaults
    setResumeStyle("international");
    setAiTone("balanced");
    setPdfTemplate("classic");
    
    // Show success message
    const successMessage = language === 'de' 
      ? 'Formular wurde erfolgreich zurückgesetzt'
      : 'Form has been successfully reset';
    console.log(successMessage);
  };

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "",
      title: "",
      summary: ""
    },
    experiences: [],
    education: [],
    skills: [],
    languages: [],
    projects: []
  });

  // Combined data loading effect - handles all data loading priorities
  useEffect(() => {
    // Priority 0: Check for selected template from template page (highest priority for template)
    const selectedTemplateData = localStorage.getItem('selectedTemplate');
    let templateApplied = false;
    
    if (selectedTemplateData) {
      try {
        const selectedTemplate = JSON.parse(selectedTemplateData);
        
        // Map template ID to PDF template type
        let templateType: "classic" | "modern" | "creative" = "classic";
        if (selectedTemplate.id === 1) {
          templateType = "modern"; // Professional International
        } else if (selectedTemplate.id === 2) {
          templateType = "classic"; // German Lebenslauf
        } else if (selectedTemplate.id === 3) {
          templateType = "creative"; // Tech Professional
        }
        
        setPdfTemplate(templateType);
        
        // Set resume style based on template
        if (selectedTemplate.style) {
          setResumeStyle(selectedTemplate.style);
        }
        
        templateApplied = true;
        
        // Clear the selected template from localStorage after using it
        localStorage.removeItem('selectedTemplate');
      } catch (error) {
        // Silently handle template parsing errors
      }
    }

    // Priority 1: Check for demo data in URL params (highest priority)
    const urlParams = new URLSearchParams(window.location.search);
    const demoData = urlParams.get('demo');
    
    if (demoData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(demoData));
        setResumeData(parsedData);
        
        // Set appropriate settings for demo
        if (parsedData.language) setLanguage(parsedData.language);
        if (parsedData.style) setResumeStyle(parsedData.style);
        if (parsedData.tone) setAiTone(parsedData.tone);
        
        return; // Don't load other data if demo data is present
      } catch (error) {
        // Silently handle demo data parsing errors
      }
    }
    
    // Priority 2: Check for shared resume data (medium priority)
    const sharedData = urlParams.get('data');
    if (sharedData) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(sharedData));
        setResumeData(parsedData);
        return;
      } catch (error) {
        // Silently handle shared data parsing errors
      }
      return;
    }
    
    // Priority 3: Load form persistence data (lowest priority)
    const savedData = loadFormDataFromStorage();
    if (savedData) {
      setResumeData(savedData);
    }
    
    // Reset generation settings to defaults if not set by template selection or URL params
    if (!templateApplied && !demoData && !sharedData) {
      setResumeStyle("international");
      setAiTone("balanced");
      setPdfTemplate("classic");
      // Language will use the default from LanguageContext
    }
  }, []);

  // Template selection effect
  useEffect(() => {
    const selectedTemplate = localStorage.getItem('selectedTemplate');
    if (selectedTemplate) {
      try {
        const template = JSON.parse(selectedTemplate);
        
        // Set PDF template based on template ID
        if (template.id === 1) {
          setPdfTemplate('modern');
        } else if (template.id === 2) {
          setPdfTemplate('classic');
        } else if (template.id === 3) {
          setPdfTemplate('creative');
        }
        
        // Set resume style
        if (template.style) {
          setResumeStyle(template.style);
        }
        
        // Clear template after use
        localStorage.removeItem('selectedTemplate');
      } catch (error) {
        // Silently handle template parsing errors
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes (with a small delay to prevent initial save)
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Mark as initialized after first render
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Only save after component is initialized to prevent overwriting loaded data
    if (isInitialized) {
      saveFormDataToStorage(resumeData);
    }
  }, [resumeData, isInitialized]);

  // Custom setResumeData that also saves to localStorage
  const updateResumeData = (newData: ResumeData | ((prev: ResumeData) => ResumeData)) => {
    setResumeData(prev => {
      const updatedData = typeof newData === 'function' ? newData(prev) : newData;
      // Save to localStorage will happen in useEffect above
      return updatedData;
    });
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      location: ""
    };
    updateResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, newExp]
    }));
  };

  const removeExperience = (id: string) => {
    updateResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    updateResumeData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: ""
    };
    updateResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEdu]
    }));
  };

  const removeEducation = (id: string) => {
    updateResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const updateEducation = (id: string, field: keyof Education, value: any) => {
    updateResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      updateResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
    }
  };

  const removeSkill = (skill: string) => {
    updateResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addLanguage = (language: string) => {
    if (language.trim() && !resumeData.languages.includes(language.trim())) {
      updateResumeData(prev => ({
        ...prev,
        languages: [...prev.languages, language.trim()]
      }));
    }
  };

  const removeLanguage = (language: string) => {
    updateResumeData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== language)
    }));
  };

  const addProject = (project: string) => {
    if (project.trim() && !resumeData.projects.includes(project.trim())) {
      updateResumeData(prev => ({
        ...prev,
        projects: [...prev.projects, project.trim()]
      }));
    }
  };

  const removeProject = (project: string) => {
    updateResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p !== project)
    }));
  };

  // Function to render complete resume from enhanced data
  const renderCompleteResume = () => {
    if (!enhancedResumeData) return generatedResume;

    const data = enhancedResumeData;
    let resume = '';

    // Header
    if (data.personal_info) {
      const pi = data.personal_info;
      resume += `${pi.firstName} ${pi.lastName}\n`;
      if (pi.title) resume += `${pi.title}\n`;
      resume += `${pi.email} | ${pi.phone}\n`;
      if (pi.location) resume += `${pi.location}\n`;
      resume += '\n';
    }

    // Professional Summary
    if (data.summary) {
      resume += 'PROFESSIONAL SUMMARY\n';
      resume += `${data.summary}\n\n`;
    }

    // Experience
    if (data.experiences && data.experiences.length > 0) {
      resume += 'PROFESSIONAL EXPERIENCE\n';
      data.experiences.forEach((exp: any) => {
        resume += `${exp.position} | ${exp.company}\n`;
        if (exp.startDate || exp.endDate) {
          resume += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
        }
        if (exp.location) resume += `${exp.location}\n`;
        if (exp.description) {
          resume += `${exp.description}\n`;
        }
        resume += '\n';
      });
    }

    // Education
    if (data.education && data.education.length > 0) {
      resume += 'EDUCATION\n';
      data.education.forEach((edu: any) => {
        resume += `${edu.degree}`;
        if (edu.field) resume += ` in ${edu.field}`;
        resume += `\n${edu.institution}`;
        if (edu.endDate) resume += ` | ${edu.endDate}`;
        resume += '\n';
        if (edu.description) resume += `${edu.description}\n`;
        resume += '\n';
      });
    }

    // Skills
    if (data.skills && data.skills.length > 0) {
      resume += 'TECHNICAL SKILLS\n';
      resume += `${data.skills.join(', ')}\n\n`;
    }

    // Languages
    if (data.languages && data.languages.length > 0) {
      resume += 'LANGUAGES\n';
      resume += `${data.languages.join(', ')}\n\n`;
    }

    // Projects
    if (data.projects && data.projects.length > 0) {
      resume += 'PROJECTS\n';
      data.projects.forEach((project: string) => {
        resume += `• ${project}\n`;
      });
      resume += '\n';
    }

    return resume.trim();
  };
  const handleGenerateResume = async () => {
    // Check demo limits for non-authenticated users
    if (!isAuthenticated && !isDemoMode) {
      setShowAuthModal(true);
      return;
    }

    setIsGenerating(true);
    setGenerationError(null);

    try {
      const apiData: GenerateResumeRequest = {
        personal_info: {
          firstName: resumeData.personalInfo.firstName,
          lastName: resumeData.personalInfo.lastName,
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone,
          location: resumeData.personalInfo.location,
          title: resumeData.personalInfo.title,
          summary: resumeData.personalInfo.summary,
        },
        experiences: resumeData.experiences,
        education: resumeData.education,
        skills: resumeData.skills,
        languages: resumeData.languages,
        projects: resumeData.projects,
        style: resumeStyle,
        language: language,
        tone: aiTone,
      };

      const response = await apiService.generateResume(apiData);

      if (response.success && response.data) {
        // Use demo generation if not authenticated
        if (!isAuthenticated) {
          useDemoGeneration();
        }
        
        setGeneratedResume(response.data.content);
        setEnhancedResumeData(response.data.enhanced_data);
        setIsFallback(response.data.fallback || false);
        
        // Save resume for authenticated users
        if (isAuthenticated) {
          const resumeTitle = `${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName} - ${resumeData.personalInfo.title || 'Resume'}`;
          
          resumeStorage.saveResume({
            title: resumeTitle,
            content: response.data.content,
            personalInfo: resumeData.personalInfo,
            experiences: resumeData.experiences,
            education: resumeData.education,
            skills: resumeData.skills,
            languages: resumeData.languages,
            projects: resumeData.projects,
            language: language,
            style: resumeStyle,
            isFallback: response.data.fallback || false,
          });
        }
        
        // Switch to a results view or scroll to results
        setCurrentTab("results");
        
        // Show signup prompt after successful demo generation
        if (!isAuthenticated) {
          if (demoGenerationsLeft === 1) {
            // Last demo - show immediate prompt
            setTimeout(() => {
              setShowAuthModal(true);
            }, 1500);
          } else if (demoGenerationsLeft === 0) {
            // No demos left - show immediate signup
            setTimeout(() => {
              setShowAuthModal(true);
            }, 500);
          }
        }
      } else {
        throw new Error(response.message || "Failed to generate resume");
      }
    } catch (error) {
      console.error("Resume generation failed:", error);
      setGenerationError(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPdf = async () => {
    if (!generatedResume && !enhancedResumeData) return;
    
    setIsExportingPdf(true);
    try {
      const exportData = {
        personal_info: {
          firstName: resumeData.personalInfo.firstName,
          lastName: resumeData.personalInfo.lastName,
          email: resumeData.personalInfo.email,
          phone: resumeData.personalInfo.phone,
          location: resumeData.personalInfo.location,
          title: resumeData.personalInfo.title,
          summary: resumeData.personalInfo.summary || '',
        },
        experiences: resumeData.experiences.map(exp => ({
          position: exp.position,
          company: exp.company,
          startDate: exp.startDate,
          endDate: exp.endDate,
          current: exp.current,
          description: exp.description,
          location: exp.location || '',
        })),
        education: resumeData.education.map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          field: edu.field,
          startDate: edu.startDate || '',
          endDate: edu.endDate,
          gpa: edu.gpa || '',
        })),
        skills: resumeData.skills,
        languages: resumeData.languages,
        projects: resumeData.projects,
        content: generatedResume,
        enhanced_data: enhancedResumeData,
        language: language,
        style: resumeStyle,
        template: pdfTemplate,
      };

      const blob = await apiService.exportPdf(exportData);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personalInfo.firstName}-${resumeData.personalInfo.lastName}-Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const content = {
    en: {
      header: {
        title: "Resume Builder",
        subtitle: "Create your professional resume with AI assistance"
      },
      tabs: {
        personal: "Personal Info",
        experience: "Experience",
        education: "Education",
        skills: "Skills & Projects",
        jobAnalysis: "Job Analysis",
        coverLetter: "Cover Letter",
        analytics: "Analytics",
        results: "Generated Resume"
      },
      personal: {
        title: "Personal Information",
        description: "Basic information about yourself",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number",
        location: "Location",
        jobTitle: "Professional Title",
        summary: "Professional Summary"
      },
      experience: {
        title: "Work Experience",
        description: "Your professional background",
        addButton: "Add Experience",
        company: "Company",
        position: "Position",
        startDate: "Start Date",
        endDate: "End Date",
        current: "Currently working here",
        jobDescription: "Job Description",
        location: "Location"
      },
      education: {
        title: "Education",
        description: "Your educational background",
        addButton: "Add Education",
        institution: "Institution",
        degree: "Degree",
        field: "Field of Study",
        gpa: "GPA (Optional)"
      },
      skills: {
        title: "Skills & Projects",
        description: "Your technical skills and notable projects",
        skillsLabel: "Skills",
        skillsPlaceholder: "Type a skill and press Enter",
        languagesLabel: "Languages",
        languagesPlaceholder: "Type a language and press Enter",
        projectsLabel: "Projects",
        projectsPlaceholder: "Type a project and press Enter"
      },
      generate: {
        title: "Generate Resume",
        description: "Choose your preferred style and generate your AI-powered resume",
        style: "Resume Style",
        language: "Language",
        germanStyle: "German Style",
        internationalStyle: "International Style",
        germanDesc: "Traditional German Lebenslauf format with photo and personal details",
        internationalDesc: "Modern international format optimized for ATS systems",
        tone: "AI Tone",
        conservative: "Conservative",
        balanced: "Balanced",
        dynamic: "Dynamic",
        conservativeDesc: "Formal, traditional language with proven track record focus",
        balancedDesc: "Professional yet approachable tone with balanced achievements",
        dynamicDesc: "Energetic, forward-thinking language emphasizing innovation",
        template: "PDF Template",
        classic: "Classic",
        modern: "Modern",
        creative: "Creative",
        classicDesc: "Traditional, professional layout with clean typography",
        modernDesc: "Contemporary design with sidebar and visual elements",
        creativeDesc: "Colorful, dynamic layout with gradient backgrounds",
        button: "Generate AI Resume",
        generating: "Generating...",
        fillRequired: "Please fill in the required personal information fields to generate your resume.",
        signUpToGenerate: "Sign In to Generate",
        successTitle: "Resume Generated Successfully!",
        successMessage: "Your resume has been generated. Click on the \"Generated Resume\" tab to view and download it.",
        errorTitle: "Generation Failed",
        copyToClipboard: "Copy to Clipboard",
        downloadAsText: "Download as Text",
        exportAsPdf: "Export as PDF",
        generatingPdf: "Generating PDF..."
      }
    },
    de: {
      header: {
        title: "Lebenslauf-Generator",
        subtitle: "Erstellen Sie Ihren professionellen Lebenslauf mit KI-Unterstützung"
      },
      tabs: {
        personal: "Persönlich",
        experience: "Erfahrung",
        education: "Bildung",
        skills: "Fähigkeiten",
        jobAnalysis: "Stellenanalyse",
        coverLetter: "Anschreiben",
        analytics: "Analyse",
        results: "Lebenslauf"
      },
      personal: {
        title: "Persönliche Informationen",
        description: "Grundlegende Informationen über Sie",
        firstName: "Vorname",
        lastName: "Nachname",
        email: "E-Mail-Adresse",
        phone: "Telefonnummer",
        location: "Ort",
        jobTitle: "Berufsbezeichnung",
        summary: "Berufliche Zusammenfassung"
      },
      experience: {
        title: "Berufserfahrung",
        description: "Ihr beruflicher Werdegang",
        addButton: "Erfahrung hinzufügen",
        company: "Unternehmen",
        position: "Position",
        startDate: "Startdatum",
        endDate: "Enddatum",
        current: "Derzeit tätig",
        jobDescription: "Tätigkeitsbeschreibung",
        location: "Ort"
      },
      education: {
        title: "Bildung",
        description: "Ihr Bildungsweg",
        addButton: "Bildung hinzufügen",
        institution: "Institution",
        degree: "Abschluss",
        field: "Studienrichtung",
        gpa: "Note (Optional)"
      },
      skills: {
        title: "Fähigkeiten & Projekte",
        description: "Ihre technischen Fähigkeiten und bemerkenswerte Projekte",
        skillsLabel: "Fähigkeiten",
        skillsPlaceholder: "Fähigkeit eingeben und Enter drücken",
        languagesLabel: "Sprachen",
        languagesPlaceholder: "Sprache eingeben und Enter drücken",
        projectsLabel: "Projekte",
        projectsPlaceholder: "Projekt eingeben und Enter drücken"
      },
      generate: {
        title: "Lebenslauf erstellen",
        description: "Wählen Sie Ihren bevorzugten Stil und erstellen Sie Ihren KI-gestützten Lebenslauf",
        style: "Lebenslauf-Stil",
        language: "Sprache",
        germanStyle: "Deutscher Stil",
        internationalStyle: "Internationaler Stil",
        germanDesc: "Traditionelles deutsches Lebenslauf-Format mit Foto und persönlichen Details",
        internationalDesc: "Modernes internationales Format, optimiert für ATS-Systeme",
        tone: "KI-Tonalität",
        conservative: "Konservativ",
        balanced: "Ausgewogen",
        dynamic: "Dynamisch",
        conservativeDesc: "Formelle, traditionelle Sprache mit Fokus auf bewährte Erfolge",
        balancedDesc: "Professioneller aber zugänglicher Ton mit ausgewogenen Leistungen",
        dynamicDesc: "Energische, zukunftsorientierte Sprache mit Betonung auf Innovation",
        template: "PDF-Vorlage",
        classic: "Klassisch",
        modern: "Modern",
        creative: "Kreativ",
        classicDesc: "Traditionelles, professionelles Layout mit sauberer Typografie",
        modernDesc: "Zeitgemäßes Design mit Seitenleiste und visuellen Elementen",
        creativeDesc: "Farbenfrohes, dynamisches Layout mit Farbverläufen",
        button: "KI-Lebenslauf erstellen",
        generating: "Wird erstellt...",
        fillRequired: "Bitte füllen Sie die erforderlichen persönlichen Informationsfelder aus, um Ihren Lebenslauf zu erstellen.",
        signUpToGenerate: "Anmelden zum Erstellen",
        successTitle: "Lebenslauf erfolgreich erstellt!",
        successMessage: "Ihr Lebenslauf wurde erstellt. Klicken Sie auf den Tab \"Lebenslauf\" um ihn anzuzeigen und herunterzuladen.",
        errorTitle: "Erstellung fehlgeschlagen",
        copyToClipboard: "In Zwischenablage kopieren",
        downloadAsText: "Als Text herunterladen",
        exportAsPdf: "Als PDF exportieren",
        generatingPdf: "PDF wird erstellt..."
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-4 text-gradient-professional">
            {currentContent.header.title}
          </h1>
          <p className="text-xl text-gray-600">{currentContent.header.subtitle}</p>
        </div>

        {/* Demo Status */}
        <DemoStatus onSignupClick={() => setShowAuthModal(true)} />

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="flex w-full gap-1 overflow-x-auto">
          <TabsTrigger value="personal" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            <User className="h-4 w-4 flex-shrink-0" />
            <span>{currentContent.tabs.personal}</span>
          </TabsTrigger>
          <TabsTrigger value="experience" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            <Briefcase className="h-4 w-4 flex-shrink-0" />
            <span>{currentContent.tabs.experience}</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            <GraduationCap className="h-4 w-4 flex-shrink-0" />
            <span>{currentContent.tabs.education}</span>
          </TabsTrigger>
          <TabsTrigger value="skills" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            <Award className="h-4 w-4 flex-shrink-0" />
            <span>{currentContent.tabs.skills}</span>
          </TabsTrigger>
          <TabsTrigger value="jobAnalysis" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span>{currentContent.tabs.jobAnalysis}</span>
          </TabsTrigger>
          <TabsTrigger value="coverLetter" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
            <FileText className="h-4 w-4 flex-shrink-0" />
            <span>{currentContent.tabs.coverLetter}</span>
          </TabsTrigger>
          {generatedResume && (
            <TabsTrigger value="analytics" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <BarChart3 className="h-4 w-4 flex-shrink-0" />
              <span>{currentContent.tabs.analytics}</span>
            </TabsTrigger>
          )}
          {generatedResume && (
            <TabsTrigger value="results" className="flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap flex-shrink-0">
              <Eye className="h-4 w-4 flex-shrink-0" />
              <span>{currentContent.tabs.results}</span>
            </TabsTrigger>
          )}
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {currentContent.personal.title}
              </CardTitle>
              <CardDescription>{currentContent.personal.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    {currentContent.personal.firstName}
                  </Label>
                  <Input
                    id="firstName"
                    value={resumeData.personalInfo.firstName}
                    onChange={(e) => updateResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder={language === 'de' ? 'Geben Sie Ihren Vornamen ein' : 'Enter your first name'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    {currentContent.personal.lastName}
                  </Label>
                  <Input
                    id="lastName"
                    value={resumeData.personalInfo.lastName}
                    onChange={(e) => updateResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder={language === 'de' ? 'Geben Sie Ihren Nachnamen ein' : 'Enter your last name'}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    {currentContent.personal.email}
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => updateResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, email: e.target.value }
                    }))}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder={language === 'de' ? 'ihre.email@beispiel.de' : 'your.email@example.com'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    {currentContent.personal.phone}
                  </Label>
                  <Input
                    id="phone"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => updateResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, phone: e.target.value }
                    }))}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder={language === 'de' ? '+49 (0) 123 456789' : '+1 (555) 123-4567'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                    {currentContent.personal.location}
                  </Label>
                  <Input
                    id="location"
                    value={resumeData.personalInfo.location}
                    onChange={(e) => updateResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, location: e.target.value }
                    }))}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder={language === 'de' ? 'Stadt, Deutschland' : 'City, Country'}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    {currentContent.personal.jobTitle}
                  </Label>
                  <Input
                    id="title"
                    value={resumeData.personalInfo.title}
                    onChange={(e) => updateResumeData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, title: e.target.value }
                    }))}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    placeholder={language === 'de' ? 'Software-Entwickler' : 'Software Engineer'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary" className="text-sm font-medium text-gray-700">
                  {currentContent.personal.summary}
                </Label>
                <Textarea
                  id="summary"
                  rows={4}
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => updateResumeData(prev => ({
                    ...prev,
                    personalInfo: { ...prev.personalInfo, summary: e.target.value }
                  }))}
                  className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
                  placeholder={language === 'de' ? 'Kurze Beschreibung Ihres beruflichen Hintergrunds und Ihrer wichtigsten Stärken...' : 'Brief description of your professional background and key strengths...'}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                {currentContent.experience.title}
              </CardTitle>
              <CardDescription>{currentContent.experience.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.experiences.map((exp, index) => (
                <Card key={exp.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Experience {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${exp.id}`} className="text-sm font-medium text-gray-700">
                          {currentContent.experience.company}
                        </Label>
                        <Input
                          id={`company-${exp.id}`}
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                          placeholder={language === 'de' ? 'Unternehmen eingeben' : 'Enter company name'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`position-${exp.id}`} className="text-sm font-medium text-gray-700">
                          {currentContent.experience.position}
                        </Label>
                        <Input
                          id={`position-${exp.id}`}
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                          placeholder={language === 'de' ? 'Position eingeben' : 'Enter job title'}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${exp.id}`} className="text-sm font-medium text-gray-700">
                          {currentContent.experience.startDate}
                        </Label>
                        <Input
                          id={`startDate-${exp.id}`}
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${exp.id}`} className="text-sm font-medium text-gray-700">
                          {currentContent.experience.endDate}
                        </Label>
                        <Input
                          id={`endDate-${exp.id}`}
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                          disabled={exp.current}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary disabled:bg-gray-50"
                        />
                      </div>
                      <div className="flex items-end">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={exp.current}
                            onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label className="text-sm font-medium text-gray-700">{currentContent.experience.current}</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`location-${exp.id}`} className="text-sm font-medium text-gray-700">
                        {currentContent.experience.location}
                      </Label>
                      <Input
                        id={`location-${exp.id}`}
                        value={exp.location}
                        onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        placeholder={language === 'de' ? 'Standort eingeben' : 'Enter location'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`description-${exp.id}`} className="text-sm font-medium text-gray-700">
                        {currentContent.experience.jobDescription}
                      </Label>
                      <div className="relative">
                        <Textarea
                          id={`description-${exp.id}`}
                          rows={4}
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                          className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
                          placeholder={language === 'de' 
                            ? 'Beschreiben Sie Ihre Aufgaben und Erfolge...\n• Verwendung von Stichpunkten wird empfohlen\n• Quantifizieren Sie Ihre Erfolge wenn möglich\n• Verwenden Sie Aktionsverben'
                            : 'Describe your responsibilities and achievements...\n• Use bullet points for better readability\n• Quantify your accomplishments when possible\n• Start with action verbs'
                          }
                        />
                        <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                          {exp.description.length}/500
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {language === 'de' 
                          ? 'Tipp: Verwenden Sie • für Stichpunkte. Die KI wird Ihren Text verbessern.'
                          : 'Tip: Use • for bullet points. AI will enhance your text during generation.'
                        }
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button onClick={addExperience} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {currentContent.experience.addButton}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                {currentContent.education.title}
              </CardTitle>
              <CardDescription>{currentContent.education.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {resumeData.education.map((edu, index) => (
                <Card key={edu.id} className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Education {index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`institution-${edu.id}`} className="text-sm font-medium text-gray-700">
                          {currentContent.education.institution}
                        </Label>
                        <Input
                          id={`institution-${edu.id}`}
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                          placeholder={language === 'de' ? 'Bildungseinrichtung eingeben' : 'Enter institution name'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`degree-${edu.id}`} className="text-sm font-medium text-gray-700">
                          {currentContent.education.degree}
                        </Label>
                        <Input
                          id={`degree-${edu.id}`}
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                          placeholder={language === 'de' ? 'Abschluss eingeben' : 'Enter degree'}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor={`field-${edu.id}`} className="text-sm font-medium text-gray-700">
                          {currentContent.education.field}
                        </Label>
                        <Input
                          id={`field-${edu.id}`}
                          value={edu.field}
                          onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                          placeholder={language === 'de' ? 'Studienbereich eingeben' : 'Enter field of study'}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`eduStartDate-${edu.id}`} className="text-sm font-medium text-gray-700">
                          Start Date
                        </Label>
                        <Input
                          id={`eduStartDate-${edu.id}`}
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`eduEndDate-${edu.id}`} className="text-sm font-medium text-gray-700">
                          End Date
                        </Label>
                        <Input
                          id={`eduEndDate-${edu.id}`}
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                          className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`gpa-${edu.id}`} className="text-sm font-medium text-gray-700">
                        {currentContent.education.gpa}
                      </Label>
                      <Input
                        id={`gpa-${edu.id}`}
                        value={edu.gpa || ''}
                        onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        placeholder={language === 'de' ? 'Note eingeben (optional)' : 'Enter GPA (optional)'}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Button onClick={addEducation} variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                {currentContent.education.addButton}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                {currentContent.skills.title}
              </CardTitle>
              <CardDescription>{currentContent.skills.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skills-input" className="text-sm font-medium text-gray-700">
                  {currentContent.skills.skillsLabel}
                </Label>
                <div className="space-y-4">
                  <Input
                    id="skills-input"
                    placeholder={currentContent.skills.skillsPlaceholder}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addSkill(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="cursor-pointer px-3 py-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-2 hover:text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'de' 
                      ? 'Drücken Sie Enter, um eine Fähigkeit hinzuzufügen. Die KI wird relevante Fähigkeiten vorschlagen.'
                      : 'Press Enter to add a skill. AI will suggest relevant skills during generation.'
                    }
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="languages-input" className="text-sm font-medium text-gray-700">
                  {currentContent.skills.languagesLabel}
                </Label>
                <div className="space-y-4">
                  <Input
                    id="languages-input"
                    placeholder={currentContent.skills.languagesPlaceholder}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addLanguage(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {resumeData.languages.map((language, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer px-3 py-1">
                        {language}
                        <button
                          onClick={() => removeLanguage(language)}
                          className="ml-2 hover:text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'de' 
                      ? 'Drücken Sie Enter, um eine Sprache hinzuzufügen.'
                      : 'Press Enter to add a language.'
                    }
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects-input" className="text-sm font-medium text-gray-700">
                  {currentContent.skills.projectsLabel}
                </Label>
                <div className="space-y-4">
                  <Input
                    id="projects-input"
                    placeholder={currentContent.skills.projectsPlaceholder}
                    className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addProject(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {resumeData.projects.map((project, index) => (
                      <Badge key={index} variant="outline" className="cursor-pointer px-3 py-1 bg-blue-50">
                        {project}
                        <button
                          onClick={() => removeProject(project)}
                          className="ml-2 hover:text-red-500 font-bold"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'de' 
                      ? 'Drücken Sie Enter, um ein Projekt hinzuzufügen.'
                      : 'Press Enter to add a project.'
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Job Analysis Tab */}
        <TabsContent value="jobAnalysis" className="space-y-6">
          <JobPostingParser 
            language={language}
            onJobAnalyzed={setJobAnalysis}
            resumeSkills={resumeData.skills}
            resumeExperience={resumeData.experiences}
          />
        </TabsContent>

        {/* Cover Letter Tab */}
        <TabsContent value="coverLetter" className="space-y-6">
          <CoverLetterGenerator
            resumeData={resumeData}
            language={language}
          />
        </TabsContent>

        {/* Analytics Tab */}
        {generatedResume && (
          <TabsContent value="analytics" className="space-y-6">
            <ResumeAnalyticsComponent
              content={generatedResume}
              personalInfo={resumeData.personalInfo}
              experiences={resumeData.experiences}
              education={resumeData.education}
              skills={resumeData.skills}
              language={language}
              onOptimize={() => {
                // Switch to personal tab for optimization
                setCurrentTab("personal");
              }}
            />
          </TabsContent>
        )}

        {/* Results Tab */}
        <TabsContent value="results" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Generated Resume
                {isFallback ? (
                  <Badge variant="secondary" className="ml-2">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Template Mode
                  </Badge>
                ) : (
                  <Badge variant="default" className="ml-2 bg-green-600">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Generated
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {isFallback 
                  ? "Generated using intelligent template system (Professional quality guaranteed)"
                  : "AI-generated resume content"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(generatedResume || enhancedResumeData) && (
                <>
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <pre className="whitespace-pre-wrap font-mono text-sm text-gray-800">
                      {renderCompleteResume()}
                    </pre>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigator.clipboard.writeText(renderCompleteResume() || '')}
                      variant="outline"
                      size="sm"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {currentContent.generate.copyToClipboard}
                    </Button>
                    
                    <Button
                      onClick={() => {
                        const completeResume = renderCompleteResume() || '';
                        const blob = new Blob([completeResume], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `resume-${resumeData.personalInfo.firstName}-${resumeData.personalInfo.lastName}.txt`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {currentContent.generate.downloadAsText}
                    </Button>
                    
                    <Button
                      onClick={handleExportPdf}
                      disabled={isExportingPdf}
                      variant="default"
                      size="sm"
                    >
                      <FileDown className="h-4 w-4 mr-2" />
                      {isExportingPdf ? currentContent.generate.generatingPdf : currentContent.generate.exportAsPdf}
                    </Button>
                    
                    {!isAuthenticated && (
                      <Button
                        onClick={() => setShowAuthModal(true)}
                        variant="outline"
                        size="sm"
                        className="border-primary/20 text-primary hover:bg-primary/5"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Save Resume
                      </Button>
                    )}
                  </div>
                </>
              )}
              
              {generationError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <span className="font-semibold">{currentContent.generate.errorTitle}</span>
                  </div>
                  <p className="text-red-700 mt-2">{generationError}</p>
                  <Button
                    onClick={() => {
                      setGenerationError(null);
                      setCurrentTab("personal");
                    }}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                  >
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Generate Resume Section */}
      <Card className="bg-gradient-to-r bg-gray-50 border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            {currentContent.generate.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {generationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-semibold">{currentContent.generate.errorTitle}</span>
              </div>
              <p className="text-red-700 mt-2">{generationError}</p>
            </div>
          )}

          {generatedResume && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                <span className="font-semibold">{currentContent.generate.successTitle}</span>
              </div>
              <p className="text-green-700 mt-2">
                {currentContent.generate.successMessage}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {currentContent.generate.style}
              </Label>
              <Select value={resumeStyle} onValueChange={(value: "german" | "international") => setResumeStyle(value)}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-primary focus:ring-primary w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="german">{currentContent.generate.germanStyle}</SelectItem>
                  <SelectItem value="international">{currentContent.generate.internationalStyle}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {currentContent.generate.language}
              </Label>
              <Select value={language} onValueChange={(value: "en" | "de") => setLanguage(value)}>
                <SelectTrigger className="h-11 border-gray-300 focus:border-primary focus:ring-primary w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* AI Tone Selection */}
          <div>
            <Label className="text-base font-semibold">{currentContent.generate.tone}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <Card 
                className={`cursor-pointer transition-all ${aiTone === 'conservative' ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-gray-50'}`}
                onClick={() => setAiTone('conservative')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm mb-2">{currentContent.generate.conservative}</div>
                  <p className="text-xs text-gray-600">{currentContent.generate.conservativeDesc}</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${aiTone === 'balanced' ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-gray-50'}`}
                onClick={() => setAiTone('balanced')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm mb-2">{currentContent.generate.balanced}</div>
                  <p className="text-xs text-gray-600">{currentContent.generate.balancedDesc}</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${aiTone === 'dynamic' ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-gray-50'}`}
                onClick={() => setAiTone('dynamic')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm mb-2">{currentContent.generate.dynamic}</div>
                  <p className="text-xs text-gray-600">{currentContent.generate.dynamicDesc}</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* PDF Template Selection */}
          <div>
            <Label className="text-base font-semibold">{currentContent.generate.template}</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
              <Card 
                className={`cursor-pointer transition-all ${pdfTemplate === 'classic' ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-gray-50'}`}
                onClick={() => setPdfTemplate('classic')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm mb-2">{currentContent.generate.classic}</div>
                  <p className="text-xs text-gray-600">{currentContent.generate.classicDesc}</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${pdfTemplate === 'modern' ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-gray-50'}`}
                onClick={() => setPdfTemplate('modern')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm mb-2">{currentContent.generate.modern}</div>
                  <p className="text-xs text-gray-600">{currentContent.generate.modernDesc}</p>
                </CardContent>
              </Card>
              
              <Card 
                className={`cursor-pointer transition-all ${pdfTemplate === 'creative' ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-gray-50'}`}
                onClick={() => setPdfTemplate('creative')}
              >
                <CardContent className="p-4 text-center">
                  <div className="font-semibold text-sm mb-2">{currentContent.generate.creative}</div>
                  <p className="text-xs text-gray-600">{currentContent.generate.creativeDesc}</p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={clearFormData}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
              size="lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {language === 'de' ? 'Formular zurücksetzen' : 'Reset Form'}
            </Button>
            
            <Button 
              onClick={handleGenerateResume}
              disabled={isGenerating || (!resumeData.personalInfo.firstName || !resumeData.personalInfo.lastName || !resumeData.personalInfo.email)}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
              size="lg"
            >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                {currentContent.generate.generating}
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                {!isAuthenticated && isDemoMode 
                  ? `${currentContent.generate.button} (${demoGenerationsLeft} left)`
                  : !isAuthenticated && !isDemoMode
                  ? currentContent.generate.signUpToGenerate
                  : currentContent.generate.button
                }
              </>
            )}
            </Button>
          </div>

          {(!resumeData.personalInfo.firstName || !resumeData.personalInfo.lastName || !resumeData.personalInfo.email) && (
            <p className="text-sm text-gray-500 text-center">
              {currentContent.generate.fillRequired}
            </p>
          )}
        </CardContent>
      </Card>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="signup"
        title="Unlock Full Access"
        description="Sign up to save your resumes and get unlimited generations"
      />
    </div>
  );
}
