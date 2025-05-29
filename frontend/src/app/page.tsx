"use client";

import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Globe, 
  Sparkles, 
  FileText, 
  Languages, 
  Zap, 
  Target,
  Brain,
  Download,
  ArrowRight,
  CheckCircle,
  Play,
  User
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DemoSection from "@/components/DemoSection";

export default function Home() {
  const { language, setLanguage } = useLanguage();
  // const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  // const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { data: session, status, update } = useSession();
  const { updateNextAuthSession, isAuthenticated, user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const getLinkClassName = (path: string) => {
    const baseClasses = "transition-colors font-medium";
    if (isActive(path)) {
      return `${baseClasses} text-primary border-b-2 border-primary pb-1`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900`;
  };

  // Sync NextAuth session with AuthContext
  useEffect(() => {
    updateNextAuthSession(session);
  }, [session, updateNextAuthSession]);

  // Refresh session when modal closes (in case user logged in)
  useEffect(() => {
    if (!showAuthModal && status === 'unauthenticated') {
      // Small delay to allow for potential authentication state changes
      const timer = setTimeout(() => {
        update();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [showAuthModal, status, update]);

  // Sample data for demo PDF generation
  const sampleGermanData = {
    personal_info: {
      firstName: "Max",
      lastName: "Mustermann",
      email: "max.mustermann@email.com",
      phone: "+49 123 456789",
      location: "Berlin, Deutschland",
      title: "Software Entwickler",
      summary: "Erfahrener Software-Entwickler mit 6+ Jahren Erfahrung in der Entwicklung von Web-Anwendungen und Backend-Systemen."
    },
    experiences: [
      {
        id: "1",
        company: "TechCorp GmbH",
        position: "Senior Software Entwickler",
        startDate: "2020",
        endDate: "2024",
        current: false,
        description: "Entwicklung und Wartung von Enterprise-Web-Anwendungen mit React, Node.js und PostgreSQL.",
        location: "Berlin"
      },
      {
        id: "2",
        company: "StartupXYZ",
        position: "Junior Entwickler",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "Frontend-Entwicklung mit modernen JavaScript-Frameworks und responsive Design.",
        location: "München"
      }
    ],
    education: [
      {
        id: "1",
        institution: "Technische Universität Berlin",
        degree: "Bachelor of Science",
        field: "Informatik",
        startDate: "2014",
        endDate: "2018",
        gpa: "1.8"
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "PostgreSQL", "Docker", "AWS"],
    languages: ["Deutsch (Muttersprache)", "Englisch (Fließend)"],
    projects: ["E-Commerce Platform", "Task Management System"],
    content: "Erfahrener Software-Entwickler mit nachgewiesener Erfolgsbilanz in der Entwicklung skalierbarer Web-Anwendungen. Spezialisiert auf moderne JavaScript-Technologien und Cloud-Infrastruktur.",
    language: "de",
    style: "german",
    template: "classic"
  };

  const sampleInternationalData = {
    personal_info: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@email.com",
      phone: "+1-555-0123",
      location: "New York, NY",
      title: "Full-Stack Software Engineer",
      summary: "Experienced full-stack software engineer with 6+ years of expertise in developing scalable web applications and backend systems."
    },
    experiences: [
      {
        id: "1",
        company: "TechCorp",
        position: "Senior Software Engineer",
        startDate: "2020",
        endDate: "2024",
        current: false,
        description: "Led development of enterprise web applications using React, Node.js, and PostgreSQL. Improved system performance by 40%.",
        location: "New York, NY"
      },
      {
        id: "2",
        company: "StartupXYZ",
        position: "Software Developer",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "Developed responsive frontend applications using modern JavaScript frameworks and implemented RESTful APIs.",
        location: "San Francisco, CA"
      }
    ],
    education: [
      {
        id: "1",
        institution: "University of Technology",
        degree: "Bachelor of Science",
        field: "Computer Science",
        startDate: "2014",
        endDate: "2018",
        gpa: "3.8"
      }
    ],
    skills: ["JavaScript", "React", "TypeScript", "Node.js", "AWS", "Docker"],
    languages: ["English (Native)", "Spanish (Conversational)"],
    projects: ["E-Commerce Platform", "Real-time Chat Application"],
    content: "Results-driven software engineer with proven track record of delivering high-quality, scalable web applications. Expertise in modern JavaScript technologies and cloud infrastructure with focus on performance optimization.",
    language: "en",
    style: "international",
    template: "modern"
  };

  const handleDemoDownload = async (type: "german" | "international") => {
    // setIsDownloading(type);
    
    try {
      const sampleData = type === "german" ? sampleGermanData : sampleInternationalData;
      
      const response = await fetch('http://localhost:8000/api/resumes/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type === "german" ? "Max-Mustermann" : "John-Smith"}-Resume-Demo.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed. Please make sure the backend server is running on http://localhost:8000`);
    } finally {
      // setIsDownloading(null);
    }
  };

  const content = {
    en: {
      nav: {
        createResume: "Create Resume",
        myResumes: "My Resumes", 
        templates: "Templates",
        examples: "Examples"
      },
      hero: {
        badge: "Powered by AI",
        title: "AI-Powered Multilingual Resume Generator",
        subtitle: "Create professional resumes and cover letters in English & German with cultural intelligence",
        cta: isAuthenticated ? "Create Resume" : "Try Free Demo",
        secondary: "See How It Works"
      },
      features: {
        title: "Why Choose Our Generator?",
        items: [
          {
            icon: <Languages className="h-6 w-6" />,
            title: "Bilingual Intelligence",
            description: "Not just translation - cultural adaptation for German and international markets"
          },
          {
            icon: <Brain className="h-6 w-6" />,
            title: "AI-Powered Content",
            description: "Smart content generation tailored to your experience and target job"
          },
          {
            icon: <Target className="h-6 w-6" />,
            title: "ATS Optimized",
            description: "Templates designed to pass Applicant Tracking Systems"
          },
          {
            icon: <Zap className="h-6 w-6" />,
            title: "Instant Generation",
            description: "Generate professional documents in seconds, not hours"
          }
        ]
      },
      demo: {
        title: "See It In Action",
        description: "Experience the power of AI-driven resume generation",
        german: "German Style (Lebenslauf)",
        international: "International Style"
      },
      howItWorks: {
        title: "How It Works",
        description: "Our AI-powered system creates professional resumes in 4 simple steps",
        steps: [
          {
            number: "01",
            icon: <User className="h-8 w-8" />,
            title: "Enter Your Information",
            description: "Fill in your personal details, work experience, education, and skills through our intuitive form. Add your contact information, professional summary, job history with achievements, educational background, technical skills, languages, and any relevant projects or certifications."
          },
          {
            number: "02",
            icon: <Globe className="h-8 w-8" />,
            title: "Choose Language & Style",
            description: "Select between English and German languages, then choose your preferred style. Pick International format for global markets with ATS optimization, or German Lebenslauf format with traditional structure, photo section, and formal European styling for German-speaking markets."
          },
          {
            number: "03",
            icon: <Brain className="h-8 w-8" />,
            title: "AI Generation",
            description: "Our advanced AI analyzes your information and creates professional, culturally-adapted content using state-of-the-art language models. The system intelligently formats your experience, optimizes keywords for ATS systems, and adapts the tone and structure for your target market."
          },
          {
            number: "04",
            icon: <Download className="h-8 w-8" />,
            title: "Download & Apply",
            description: "Receive your professionally formatted resume instantly in multiple formats. Download as PDF for applications, get ATS-friendly versions for online submissions, and access editable formats for future updates. Start applying to your dream jobs with confidence and professional presentation."
          }
        ],
        features: [
          "🤖 AI-powered content generation",
          "🌍 Bilingual support (EN/DE)",
          "🎯 ATS-optimized formatting",
          "⚡ Instant generation",
          "🔄 Smart fallback system",
          "📱 Mobile-friendly interface"
        ]
      },
      footer: {
        allRightsReserved: "All rights reserved."
      },
      auth: {
        hello: "Hello",
        signIn: "Sign In",
        signOut: "Sign Out",
        signUp: "Sign Up",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        firstName: "First Name",
        lastName: "Last Name",
        signInTitle: "Welcome Back",
        signInDescription: "Sign in to access your saved resumes and continue building your career",
        signUpTitle: "Create Account",
        signUpDescription: "Join thousands of professionals who trust our AI-powered resume generator",
        signInButton: "Sign In",
        signUpButton: "Create Account",
        switchToSignUp: "Don't have an account? Sign up",
        switchToSignIn: "Already have an account? Sign in",
        forgotPassword: "Forgot password?",
        orContinue: "Or continue with",
        googleLogin: "Continue with Google",
        githubLogin: "Continue with GitHub",
        benefits: [
          "Save unlimited resumes",
          "Access premium templates",
          "Export in multiple formats",
          "Track application history"
        ]
      }
    },
    de: {
      nav: {
        createResume: "Lebenslauf erstellen",
        myResumes: "Meine Lebensläufe",
        templates: "Vorlagen", 
        examples: "Beispiele"
      },
      hero: {
        badge: "KI-gestützt",
        title: "KI-gestützter mehrsprachiger Lebenslauf-Generator",
        subtitle: "Erstellen Sie professionelle Lebensläufe und Anschreiben auf Englisch & Deutsch mit kultureller Intelligenz",
        cta: isAuthenticated ? "Lebenslauf erstellen" : "Kostenlose Demo",
        secondary: "Funktionsweise ansehen"
      },
      features: {
        title: "Warum unseren Generator wählen?",
        items: [
          {
            icon: <Languages className="h-6 w-6" />,
            title: "Zweisprachige Intelligenz",
            description: "Nicht nur Übersetzung - kulturelle Anpassung für deutsche und internationale Märkte"
          },
          {
            icon: <Brain className="h-6 w-6" />,
            title: "KI-gestützter Inhalt",
            description: "Intelligente Inhaltserstellung angepasst an Ihre Erfahrung und Zielposition"
          },
          {
            icon: <Target className="h-6 w-6" />,
            title: "ATS-optimiert",
            description: "Vorlagen entwickelt für Bewerbermanagementsysteme"
          },
          {
            icon: <Zap className="h-6 w-6" />,
            title: "Sofortige Erstellung",
            description: "Professionelle Dokumente in Sekunden, nicht Stunden generieren"
          }
        ]
      },
      demo: {
        title: "In Aktion erleben",
        description: "Erleben Sie die Kraft der KI-gesteuerten Lebenslauf-Erstellung",
        german: "Deutscher Stil (Lebenslauf)",
        international: "Internationaler Stil"
      },
      howItWorks: {
        title: "Funktionsweise",
        description: "Unser KI-gestütztes System erstellt professionelle Lebensläufe in 4 einfachen Schritten",
        steps: [
          {
            number: "01",
            icon: <User className="h-8 w-8" />,
            title: "Informationen eingeben",
            description: "Geben Sie Ihre persönlichen Daten, Berufserfahrung, Bildung und Fähigkeiten über unser intuitives Formular ein. Fügen Sie Kontaktinformationen, berufliche Zusammenfassung, Arbeitshistorie mit Erfolgen, Bildungshintergrund, technische Fähigkeiten, Sprachen und relevante Projekte oder Zertifizierungen hinzu."
          },
          {
            number: "02",
            icon: <Globe className="h-8 w-8" />,
            title: "Sprache & Stil wählen",
            description: "Wählen Sie zwischen Englisch und Deutsch, dann Ihren bevorzugten Stil. Wählen Sie internationales Format für globale Märkte mit ATS-Optimierung oder deutsches Lebenslauf-Format mit traditioneller Struktur, Foto-Bereich und formaler europäischer Gestaltung für deutschsprachige Märkte."
          },
          {
            number: "03",
            icon: <Brain className="h-8 w-8" />,
            title: "KI-Generierung",
            description: "Unsere fortschrittliche KI analysiert Ihre Informationen und erstellt professionelle, kulturell angepasste Inhalte mit modernsten Sprachmodellen. Das System formatiert intelligent Ihre Erfahrung, optimiert Schlüsselwörter für ATS-Systeme und passt Ton und Struktur für Ihren Zielmarkt an."
          },
          {
            number: "04",
            icon: <Download className="h-8 w-8" />,
            title: "Herunterladen & Bewerben",
            description: "Erhalten Sie Ihren professionell formatierten Lebenslauf sofort in mehreren Formaten. Laden Sie als PDF für Bewerbungen herunter, erhalten Sie ATS-freundliche Versionen für Online-Einreichungen und greifen Sie auf bearbeitbare Formate für zukünftige Updates zu. Bewerben Sie sich selbstbewusst auf Ihre Traumjobs."
          }
        ],
        features: [
          "🤖 KI-gestützte Inhaltserstellung",
          "🌍 Zweisprachige Unterstützung (EN/DE)",
          "🎯 ATS-optimierte Formatierung",
          "⚡ Sofortige Generierung",
          "🔄 Intelligentes Fallback-System",
          "📱 Mobile-freundliche Oberfläche"
        ]
      },
      footer: {
        allRightsReserved: "Alle Rechte vorbehalten."
      },
      auth: {
        hello: "Hallo",
        signIn: "Anmelden",
        signOut: "Abmelden",
        signUp: "Registrieren",
        email: "E-Mail",
        password: "Passwort",
        confirmPassword: "Passwort bestätigen",
        firstName: "Vorname",
        lastName: "Nachname",
        signInTitle: "Willkommen zurück",
        signInDescription: "Melden Sie sich an, um auf Ihre gespeicherten Lebensläufe zuzugreifen und Ihre Karriere voranzutreiben",
        signUpTitle: "Konto erstellen",
        signUpDescription: "Schließen Sie sich Tausenden von Fachkräften an, die unserem KI-gestützten Lebenslauf-Generator vertrauen",
        signInButton: "Anmelden",
        signUpButton: "Konto erstellen",
        switchToSignUp: "Noch kein Konto? Registrieren",
        switchToSignIn: "Bereits ein Konto? Anmelden",
        forgotPassword: "Passwort vergessen?",
        orContinue: "Oder fortfahren mit",
        googleLogin: "Mit Google fortfahren",
        githubLogin: "Mit GitHub fortfahren",
        benefits: [
          "Unbegrenzte Lebensläufe speichern",
          "Zugang zu Premium-Vorlagen",
          "Export in mehreren Formaten",
          "Bewerbungsverlauf verfolgen"
        ]
      }
    }
  };

  const currentContent = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 gradient-professional rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">ResumeAI</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/create" className={getLinkClassName("/create")}>
              {currentContent.nav.createResume}
            </Link>
            {(isAuthenticated || session) && (
              <Link href="/my-resumes" className={getLinkClassName("/my-resumes")}>
                {currentContent.nav.myResumes}
              </Link>
            )}
            <Link href="/templates" className={getLinkClassName("/templates")}>
              {currentContent.nav.templates}
            </Link>
            <Link href="/examples" className={getLinkClassName("/examples")}>
              {currentContent.nav.examples}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setLanguage("de")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  language === "de"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                DE
              </button>
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  language === "en"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                EN
              </button>
            </div>
            {(isAuthenticated || session) ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {currentContent.auth.hello}, {session?.user?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    if (session) {
                      signOut();
                    } else {
                      logout();
                    }
                  }}
                >
                  {currentContent.auth.signOut}
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAuthModal(true)}
              >
                <User className="mr-2 h-4 w-4" />
                {currentContent.auth.signIn}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="h-4 w-4 mr-1" />
            {currentContent.hero.badge}
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 font-bold">
            {currentContent.hero.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {currentContent.hero.subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                {currentContent.hero.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <Play className="mr-2 h-4 w-4" />
                  {currentContent.hero.secondary}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[65vw] !max-w-none max-h-[90vh] overflow-y-auto p-8" style={{maxWidth: 'none', width: '65vw'}}>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-center mb-2">
                    {currentContent.howItWorks.title}
                  </DialogTitle>
                  <DialogDescription className="text-center text-lg">
                    {currentContent.howItWorks.description}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="mt-6">
                  {/* Steps */}
                  <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {currentContent.howItWorks.steps.map((step, index) => (
                      <div key={index} className="flex gap-4 p-6 rounded-lg border bg-gradient-to-r bg-primary/5 min-h-[180px]">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 gradient-professional rounded-full flex items-center justify-center text-white font-bold">
                            {step.number}
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="text-primary">
                              {step.icon}
                            </div>
                            <h3 className="font-semibold text-base">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Features */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="font-semibold text-lg mb-4 text-center">Key Features</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {currentContent.howItWorks.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <div className="text-center mt-6">
                    <Link href="/create">
                      <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                        {currentContent.hero.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            {currentContent.features.title}
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentContent.features.items.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="h-12 w-12 gradient-professional rounded-lg flex items-center justify-center text-white mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <DemoSection language={language} />
      {/* CTA Section */}
      <section className="py-20 px-4 gradient-professional text-white">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl font-bold mb-4">
            {isAuthenticated ? 
              (language === "de" ? "Bereit, Ihren perfekten Lebenslauf zu erstellen?" : "Ready to Create Your Perfect Resume?") :
              (language === "de" ? "Bereit, Ihren perfekten Lebenslauf zu erstellen?" : "Ready to Create Your Perfect Resume?")
            }
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {isAuthenticated ? 
              (language === "de" ? "Nutzen Sie unsere KI-gestützte Plattform für professionelle Lebensläufe" : "Use our AI-powered platform to create professional resumes") :
              (language === "de" ? "Schließen Sie sich Tausenden von Fachkräften an, die mit KI-gestützten Lebensläufen ihren Traumjob gefunden haben" : "Join thousands of professionals who landed their dream jobs with AI-powered resumes")
            }
          </p>
          <Link href="/create" className="w-full sm:w-auto flex justify-center">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100">
              {isAuthenticated ? (language === "de" ? "Lebenslauf erstellen" : "Create Resume") : (language === "de" ? "Kostenlose Demo starten" : "Start Free Demo")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-50 border-t">
        <div className="container mx-auto text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} ResumeAI. {currentContent.footer.allRightsReserved}</p>
        </div>
      </footer>

      {/* Unified Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="signup"
        title={language === "en" ? "Join ResumeAI" : "Bei ResumeAI anmelden"}
        description={language === "en" ? "Create professional resumes with AI assistance" : "Erstellen Sie professionelle Lebensläufe mit KI-Unterstützung"}
      />
    </div>
  );
}
