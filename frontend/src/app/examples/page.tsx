"use client";

import Header from "@/components/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SimpleFooter from "@/components/SimpleFooter";
import { 
  FileText, 
  Eye, 
  Copy,
  Users,
  Code,
  Palette,
  Briefcase,
  GraduationCap,
  Heart,
  Globe,
  PenTool,
  Layout,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb
} from "lucide-react";

export default function ExamplesPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const handleViewExample = (example: any) => {
    // Generate realistic sample data based on the example
    const firstName = example.name.split(' ')[0] || 'John';
    const lastName = example.name.split(' ').slice(1).join(' ') || 'Doe';
    
    // Generate different sample data based on industry
    const industryData = {
      tech: {
        company: 'TechCorp Inc',
        location: 'San Francisco, CA',
        phone: '+1-555-0123',
        education: {
          institution: 'Stanford University',
          degree: 'Bachelor of Science',
          field: 'Computer Science'
        },
        projects: ['E-Commerce Platform', 'Real-time Chat Application', 'Machine Learning Pipeline']
      },
      business: {
        company: 'Global Business Solutions',
        location: 'New York, NY',
        phone: '+1-555-0456',
        education: {
          institution: 'Harvard Business School',
          degree: 'Master of Business Administration',
          field: 'Business Administration'
        },
        projects: ['Market Expansion Strategy', 'Digital Transformation Initiative', 'Cost Optimization Program']
      },
      creative: {
        company: 'Creative Studio Ltd',
        location: 'Los Angeles, CA',
        phone: '+1-555-0789',
        education: {
          institution: 'Art Institute',
          degree: 'Bachelor of Fine Arts',
          field: 'Graphic Design'
        },
        projects: ['Brand Identity Design', 'Website Redesign', 'Marketing Campaign']
      },
      academic: {
        company: 'Research University',
        location: 'Boston, MA',
        phone: '+1-555-0321',
        education: {
          institution: 'MIT',
          degree: 'Ph.D.',
          field: 'Computer Science'
        },
        projects: ['Research Publication', 'Grant Proposal', 'Conference Presentation']
      }
    };

    const currentIndustry = industryData[example.industry?.toLowerCase() as keyof typeof industryData] || industryData.tech;

    const sampleResumeData = {
      personalInfo: {
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/\s+/g, '')}@email.com`,
        phone: currentIndustry.phone,
        location: currentIndustry.location,
        title: example.name,
        summary: example.description
      },
      experiences: [
        {
          id: '1',
          company: currentIndustry.company,
          position: example.name,
          startDate: '2020',
          endDate: '2024',
          current: false,
          description: `${example.description}. Led cross-functional teams and delivered high-impact projects that improved business outcomes by 25%.`,
          location: currentIndustry.location
        },
        {
          id: '2',
          company: 'Previous Company',
          position: `Junior ${example.name.split(' ').slice(-1)[0]}`,
          startDate: '2018',
          endDate: '2020',
          current: false,
          description: 'Developed foundational skills and contributed to team success through innovative solutions.',
          location: currentIndustry.location
        }
      ],
      education: [
        {
          id: '1',
          institution: currentIndustry.education.institution,
          degree: currentIndustry.education.degree,
          field: currentIndustry.education.field,
          startDate: '2014',
          endDate: '2018',
          gpa: '3.8'
        }
      ],
      skills: example.skills || [],
      languages: language === 'de' ? ['Deutsch (Muttersprache)', 'Englisch (Fließend)'] : ['English (Native)', 'Spanish (Conversational)'],
      projects: currentIndustry.projects,
      content: `${example.description}. Experienced professional with a proven track record of delivering exceptional results in ${example.industry?.toLowerCase() || 'technology'}. Passionate about innovation and continuous learning.`,
      language: language,
      style: example.style,
      template: example.style === 'german' ? 'classic' : 'modern'
    };

    // Store the example data for viewing
    localStorage.setItem('viewingResume', JSON.stringify(sampleResumeData));
    router.push('/create');
  };

  const handleUseStyle = (example: any) => {
    // Store template selection based on example style
    const templateData = {
      id: example.id,
      name: example.name,
      style: example.style,
      category: example.style === 'german' ? 'classic' : 'modern'
    };

    localStorage.setItem('selectedTemplate', JSON.stringify(templateData));
    router.push('/create');
  };

  const content = {
    en: {
      title: "Resume Examples",
      subtitle: "Get inspired by real resume examples across different industries and experience levels",
      tabs: {
        tech: "Technology",
        business: "Business",
        creative: "Creative",
        academic: "Academic"
      },
      examples: {
        tech: [
          {
            id: 1,
            name: "Senior Software Engineer",
            experience: "8+ years",
            industry: "Tech",
            description: "Full-stack developer with expertise in React, Node.js, and cloud architecture",
            skills: ["React", "Node.js", "AWS", "Python", "Docker"],
            style: "international",
            popular: true
          },
          {
            id: 2,
            name: "DevOps Engineer",
            experience: "5 years",
            industry: "Tech",
            description: "Infrastructure specialist with strong automation and CI/CD experience",
            skills: ["Kubernetes", "Jenkins", "Terraform", "Linux", "Monitoring"],
            style: "international"
          }
        ],
        business: [
          {
            id: 3,
            name: "Marketing Manager",
            experience: "6 years",
            industry: "Marketing",
            description: "Digital marketing expert with proven track record in B2B campaigns",
            skills: ["Digital Marketing", "Analytics", "Strategy", "Team Leadership"],
            style: "german"
          },
          {
            id: 4,
            name: "Business Analyst",
            experience: "4 years",
            industry: "Consulting",
            description: "Data-driven analyst specializing in process optimization",
            skills: ["Data Analysis", "SQL", "Process Improvement", "Stakeholder Management"],
            style: "international"
          }
        ],
        creative: [
          {
            id: 5,
            name: "UX/UI Designer",
            experience: "5 years",
            industry: "Design",
            description: "User-centered designer with expertise in mobile and web applications",
            skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
            style: "international"
          },
          {
            id: 6,
            name: "Graphic Designer",
            experience: "3 years",
            industry: "Creative",
            description: "Brand identity specialist with strong visual communication skills",
            skills: ["Adobe Creative Suite", "Branding", "Typography", "Print Design"],
            style: "german"
          }
        ],
        academic: [
          {
            id: 7,
            name: "Research Scientist",
            experience: "PhD + 2 years",
            industry: "Research",
            description: "Computational biology researcher with multiple publications",
            skills: ["Research", "Publications", "Data Analysis", "Machine Learning"],
            style: "international"
          },
          {
            id: 8,
            name: "University Professor",
            experience: "12 years",
            industry: "Education",
            description: "Computer Science professor with extensive teaching and research experience",
            skills: ["Teaching", "Research", "Grant Writing", "Academic Leadership"],
          }
        ]
      },
      buttons: {
        view: "View Example",
        useTemplate: "Use This Style",
        copy: "Copy Style"
      },
      popular: "Popular",
      tips: {
        title: "Resume Tips",
        subtitle: "Expert advice to make your resume stand out and get you hired",
        categories: {
          content: {
            title: "Content & Writing",
            tips: [
              "Tailor your resume for each application",
              "Use action verbs and quantify achievements with numbers",
              "Include relevant keywords from the job description",
              "Write a compelling professional summary",
              "Focus on accomplishments, not just job duties"
            ]
          },
          formatting: {
            title: "Formatting & Design",
            tips: [
              "Keep it concise - 1-2 pages maximum",
              "Ensure ATS compatibility with clean formatting",
              "Use consistent fonts and spacing throughout",
              "Choose a professional, readable font (10-12pt)",
              "Include plenty of white space for readability"
            ]
          },
          strategy: {
            title: "Application Strategy",
            tips: [
              "Research the company and role thoroughly",
              "Network and get referrals when possible",
              "Follow up professionally after applying",
              "Prepare for common interview questions",
              "Keep your LinkedIn profile updated and consistent"
            ]
          },
          mistakes: {
            title: "Common Mistakes to Avoid",
            tips: [
              "Don't include irrelevant personal information",
              "Avoid spelling and grammar errors",
              "Don't use generic, one-size-fits-all resumes",
              "Never lie or exaggerate your experience",
              "Don't forget to include contact information"
            ]
          }
        }
      }
    },
    de: {
      title: "Lebenslauf Beispiele",
      subtitle: "Lassen Sie sich von echten Lebenslauf-Beispielen aus verschiedenen Branchen und Erfahrungsstufen inspirieren",
      tabs: {
        tech: "Technologie",
        business: "Business",
        creative: "Kreativ",
        academic: "Akademisch"
      },
      examples: {
        tech: [
          {
            id: 1,
            name: "Senior Software Engineer",
            experience: "8+ Jahre",
            industry: "Tech",
            description: "Full-stack Entwickler mit Expertise in React, Node.js und Cloud-Architektur",
            skills: ["React", "Node.js", "AWS", "Python", "Docker"],
            style: "international",
            popular: true
          },
          {
            id: 2,
            name: "DevOps Engineer",
            experience: "5 Jahre",
            industry: "Tech",
            description: "Infrastruktur-Spezialist mit starker Automatisierung und CI/CD-Erfahrung",
            skills: ["Kubernetes", "Jenkins", "Terraform", "Linux", "Monitoring"],
            style: "international"
          }
        ],
        business: [
          {
            id: 3,
            name: "Marketing Manager",
            experience: "6 Jahre",
            industry: "Marketing",
            description: "Digital Marketing Experte mit nachgewiesener Erfolgsbilanz in B2B-Kampagnen",
            skills: ["Digital Marketing", "Analytics", "Strategie", "Teamführung"],
            style: "german"
          },
          {
            id: 4,
            name: "Business Analyst",
            experience: "4 Jahre",
            industry: "Beratung",
            description: "Datengetriebener Analyst spezialisiert auf Prozessoptimierung",
            skills: ["Datenanalyse", "SQL", "Prozessverbesserung", "Stakeholder Management"],
            style: "international"
          }
        ],
        creative: [
          {
            id: 5,
            name: "UX/UI Designer",
            experience: "5 Jahre",
            industry: "Design",
            description: "Benutzerzentrierter Designer mit Expertise in mobilen und Web-Anwendungen",
            skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
            style: "international"
          },
          {
            id: 6,
            name: "Grafikdesigner",
            experience: "3 Jahre",
            industry: "Kreativ",
            description: "Markenidentitäts-Spezialist mit starken visuellen Kommunikationsfähigkeiten",
            skills: ["Adobe Creative Suite", "Branding", "Typografie", "Print Design"],
            style: "german"
          }
        ],
        academic: [
          {
            id: 7,
            name: "Forschungswissenschaftler",
            experience: "PhD + 2 Jahre",
            industry: "Forschung",
            description: "Computational Biology Forscher mit mehreren Publikationen",
            skills: ["Forschung", "Publikationen", "Datenanalyse", "Machine Learning"],
            style: "international"
          },
          {
            id: 8,
            name: "Universitätsprofessor",
            experience: "12 Jahre",
            industry: "Bildung",
            description: "Informatik-Professor mit umfangreicher Lehr- und Forschungserfahrung",
            skills: ["Lehre", "Forschung", "Grant Writing", "Akademische Führung"],
            style: "german"
          }
        ]
      },
      buttons: {
        view: "Beispiel ansehen",
        useTemplate: "Als Vorlage verwenden",
        copy: "Stil kopieren"
      },
      popular: "Beliebt",
      tips: {
        title: "Lebenslauf Tipps",
        subtitle: "Expertenrat, um Ihren Lebenslauf hervorzuheben und eingestellt zu werden",
        categories: {
          content: {
            title: "Inhalt & Schreibweise",
            tips: [
              "Passen Sie Ihren Lebenslauf für jede Bewerbung an",
              "Verwenden Sie Aktionsverben und quantifizieren Sie Erfolge mit Zahlen",
              "Fügen Sie relevante Schlüsselwörter aus der Stellenausschreibung hinzu",
              "Schreiben Sie eine überzeugende berufliche Zusammenfassung",
              "Konzentrieren Sie sich auf Erfolge, nicht nur auf Aufgaben"
            ]
          },
          formatting: {
            title: "Formatierung & Design",
            tips: [
              "Halten Sie es prägnant - maximal 1-2 Seiten",
              "Stellen Sie ATS-Kompatibilität mit sauberer Formatierung sicher",
              "Verwenden Sie durchgehend einheitliche Schriftarten und Abstände",
              "Wählen Sie eine professionelle, lesbare Schriftart (10-12pt)",
              "Lassen Sie ausreichend Weißraum für bessere Lesbarkeit"
            ]
          },
          strategy: {
            title: "Bewerbungsstrategie",
            tips: [
              "Recherchieren Sie das Unternehmen und die Stelle gründlich",
              "Nutzen Sie Netzwerke und holen Sie sich Empfehlungen",
              "Folgen Sie professionell nach der Bewerbung nach",
              "Bereiten Sie sich auf häufige Interviewfragen vor",
              "Halten Sie Ihr LinkedIn-Profil aktuell und konsistent"
            ]
          },
          mistakes: {
            title: "Häufige Fehler vermeiden",
            tips: [
              "Fügen Sie keine irrelevanten persönlichen Informationen hinzu",
              "Vermeiden Sie Rechtschreib- und Grammatikfehler",
              "Verwenden Sie keine generischen Einheits-Lebensläufe",
              "Lügen oder übertreiben Sie niemals Ihre Erfahrung",
              "Vergessen Sie nicht, Kontaktinformationen anzugeben"
            ]
          }
        }
      }
    }
  };

  const currentContent = content[language];

  const renderExamples = (examples: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {examples.map((example) => (
        <Card key={example.id} className="relative hover:shadow-lg transition-shadow">
          {example.popular && (
            <div className="absolute top-4 right-4 z-10">
              <Badge className="bg-yellow-500 text-white">
                <Heart className="h-3 w-3 mr-1" />
                {currentContent.popular}
              </Badge>
            </div>
          )}
          
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {example.name}
                  <Badge variant={example.style === 'german' ? 'secondary' : 'outline'}>
                    {example.style === 'german' ? 'DE' : 'INT'}
                  </Badge>
                </CardTitle>
                <CardDescription className="mt-1">
                  {example.experience} • {example.industry}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">
              {example.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {example.skills.slice(0, 4).map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {example.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{example.skills.length - 4} more
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleViewExample(example)}
              >
                <Eye className="h-4 w-4 mr-2" />
                {currentContent.buttons.view}
              </Button>
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleUseStyle(example)}
              >
                {currentContent.buttons.useTemplate}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen gradient-subtle">
      <Header language={language} onLanguageChange={setLanguage} />
      
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gradient-professional">
            {currentContent.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Examples Tabs */}
        <Tabs defaultValue="tech" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tech" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              {currentContent.tabs.tech}
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              {currentContent.tabs.business}
            </TabsTrigger>
            <TabsTrigger value="creative" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {currentContent.tabs.creative}
            </TabsTrigger>
            <TabsTrigger value="academic" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {currentContent.tabs.academic}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tech">
            {renderExamples(currentContent.examples.tech)}
          </TabsContent>
          
          <TabsContent value="business">
            {renderExamples(currentContent.examples.business)}
          </TabsContent>
          
          <TabsContent value="creative">
            {renderExamples(currentContent.examples.creative)}
          </TabsContent>
          
          <TabsContent value="academic">
            {renderExamples(currentContent.examples.academic)}
          </TabsContent>
        </Tabs>

        {/* Tips Section - Full Width */}
        <div className="mt-16">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Lightbulb className="h-6 w-6 text-yellow-500" />
                {currentContent.tips.title}
              </CardTitle>
              <CardDescription className="text-lg">
                {currentContent.tips.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Content & Writing */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <PenTool className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{currentContent.tips.categories.content.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentContent.tips.categories.content.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Formatting & Design */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Layout className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{currentContent.tips.categories.formatting.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentContent.tips.categories.formatting.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Application Strategy */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="h-5 w-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{currentContent.tips.categories.strategy.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentContent.tips.categories.strategy.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Common Mistakes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <h3 className="font-semibold text-lg">{currentContent.tips.categories.mistakes.title}</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentContent.tips.categories.mistakes.tips.map((tip: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Tips Section */}
              <div className="mt-12 p-8 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {language === 'de' ? 'Pro-Tipp' : 'Pro Tip'}
                    </h3>
                  </div>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    {language === 'de' 
                      ? 'Verwenden Sie unseren AI-gestützten Generator, um personalisierte Lebensläufe zu erstellen, die perfekt auf jede Stellenausschreibung zugeschnitten sind!'
                      : 'Use our AI-powered generator to create personalized resumes that are perfectly tailored to each job application!'
                    }
                  </p>
                </div>
                <div className="flex justify-center">
                  <Link href="/create">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      {language === 'de' ? 'Jetzt Lebenslauf erstellen' : 'Create Resume Now'}
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <SimpleFooter language={language} />
    </div>
  );
}
