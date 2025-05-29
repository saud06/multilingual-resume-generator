"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Star, Eye, Users, Briefcase, GraduationCap, Target, Award, TrendingUp, Globe, Zap } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import { apiService } from "@/lib/api";

export default function TemplatesPage() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  // Remove PDF preview functionality since we're using image previews on cards

  const handleUseTemplate = (template: any) => {
    // Store selected template in localStorage for the create page to use
    const templateData = {
      id: template.id,
      name: template.name,
      style: template.style,
      category: template.category
    };
    
    localStorage.setItem('selectedTemplate', JSON.stringify(templateData));
    
    // Navigate to create page
    router.push('/create');
  };

  const content = {
    en: {
      title: "Resume Templates",
      subtitle: "Choose from our collection of ATS-friendly, professional resume templates",
      categories: {
        all: "All Templates",
        modern: "Modern",
        classic: "Classic", 
        creative: "Creative"
      },
      templates: [
        {
          id: 1,
          name: "Professional International",
          description: "Clean, ATS-optimized template perfect for international applications",
          category: "modern",
          style: "international",
          features: ["ATS-Friendly", "Skills-Focused", "Modern Design"],
          popular: true
        },
        {
          id: 2,
          name: "German Lebenslauf",
          description: "Traditional German CV format with photo placeholder and formal structure",
          category: "classic",
          style: "german",
          features: ["Photo Section", "Formal Layout", "Chronological"]
        },
        {
          id: 3,
          name: "Tech Professional",
          description: "Perfect for software developers and tech professionals with modern design",
          category: "creative",
          style: "international",
          features: ["Project Showcase", "Skills Matrix", "GitHub Integration"]
        }
      ],
      buttons: {
        preview: "Preview PDF",
        use: "Use Template",
        download: "Download"
      },
      comingSoon: {
        title: "More Templates Coming Soon",
        description: "We're constantly adding new templates. Have a specific industry or style in mind?",
        categories: {
          executive: "Executive",
          academic: "Academic",
          creative: "Creative",
          industrySpecific: "Industry-Specific",
          healthcare: "Healthcare",
          finance: "Finance & Banking",
          marketing: "Marketing & Sales",
          engineering: "Engineering",
          legal: "Legal & Law",
          consulting: "Consulting",
          nonprofit: "Non-Profit",
          startup: "Startup & Tech"
        }
      },
      popular: "Popular"
    },
    de: {
      title: "Lebenslauf Vorlagen",
      subtitle: "Wählen Sie aus unserer Sammlung von ATS-freundlichen, professionellen Lebenslauf-Vorlagen",
      categories: {
        all: "Alle Vorlagen",
        modern: "Modern",
        classic: "Klassisch",
        creative: "Kreativ"
      },
      templates: [
        {
          id: 1,
          name: "Professionell International",
          description: "Saubere, ATS-optimierte Vorlage perfekt für internationale Bewerbungen",
          category: "modern",
          style: "international",
          features: ["ATS-Freundlich", "Fähigkeiten-fokussiert", "Modernes Design"],
          popular: true
        },
        {
          id: 2,
          name: "Deutscher Lebenslauf",
          description: "Traditionelles deutsches CV-Format mit Foto-Platzhalter und formaler Struktur",
          category: "classic",
          style: "german",
          features: ["Foto-Bereich", "Formales Layout", "Chronologisch"]
        },
        {
          id: 3,
          name: "Tech Professional",
          description: "Perfekt für Softwareentwickler und Tech-Profis mit modernem Design",
          category: "creative",
          style: "international",
          features: ["Projekt-Showcase", "Fähigkeiten-Matrix", "GitHub-Integration"]
        }
      ],
      buttons: {
        preview: "PDF Vorschau",
        use: "Vorlage verwenden",
        download: "Herunterladen"
      },
      comingSoon: {
        title: "Weitere Vorlagen kommen bald",
        description: "Wir fügen ständig neue Vorlagen hinzu. Haben Sie eine bestimmte Branche oder einen Stil im Sinn?",
        categories: {
          executive: "Führungskraft",
          academic: "Akademisch",
          creative: "Kreativ",
          industrySpecific: "Branchenspezifisch",
          healthcare: "Gesundheitswesen",
          finance: "Finanzen & Banking",
          marketing: "Marketing & Vertrieb",
          engineering: "Ingenieurwesen",
          legal: "Recht & Jura",
          consulting: "Beratung",
          nonprofit: "Non-Profit",
          startup: "Startup & Tech"
        }
      },
      popular: "Beliebt"
    }
  };

  const currentContent = content[language];

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

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentContent.templates.map((template) => (
            <Card key={template.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
              {template.popular && (
                <div className="absolute top-4 right-4 z-10">
                  <Badge className="bg-yellow-500 text-white">
                    <Star className="h-3 w-3 mr-1" />
                    {currentContent.popular}
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="aspect-[3/4] bg-white border rounded-lg mb-4 shadow-sm overflow-hidden">
                  <div className="relative w-full h-full">
                    {(() => {
                      // Generate image filename based on template (shared for both languages)
                      let templateSlug = '';
                      let fileExtension = '';
                      
                      if (template.id === 1) {
                        templateSlug = 'professional-international';
                        fileExtension = 'png';
                      } else if (template.id === 2) {
                        templateSlug = 'german-lebenslauf';
                        fileExtension = 'jpg';
                      } else if (template.id === 3) {
                        templateSlug = 'tech-professional';
                        fileExtension = 'png';
                      }
                      
                      const imageSrc = `/images/templates/${templateSlug}.${fileExtension}`;
                      
                      return (
                        <>
                          <img 
                            src={imageSrc}
                            alt={`${template.name} preview`}
                            className="w-full h-full object-cover object-top"
                            onError={(e) => {
                              // Fallback to placeholder if image doesn't exist
                              const target = e.currentTarget as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) {
                                fallback.style.display = 'flex';
                              }
                            }}
                          />
                          
                          {/* Fallback placeholder if image fails to load */}
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center" style={{display: 'none'}}>
                            <div className="text-center text-gray-500">
                              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">Preview Coming Soon</p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
                
                <CardTitle className="flex items-center gap-2">
                  {template.name}
                  <Badge variant={template.style === 'german' ? 'secondary' : 'outline'}>
                    {template.style === 'german' ? 'DE' : 'INT'}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {template.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleUseTemplate(template)}
                  >
                    {currentContent.buttons.use}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-16">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5" />
                {currentContent.comingSoon.title}
              </CardTitle>
              <CardDescription>
                {currentContent.comingSoon.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 text-sm">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.executive}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <GraduationCap className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.academic}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <FileText className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.creative}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Star className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.industrySpecific}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Users className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.healthcare}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Briefcase className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.finance}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Target className="h-5 w-5 text-pink-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.marketing}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Award className="h-5 w-5 text-orange-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.engineering}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.legal}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <TrendingUp className="h-5 w-5 text-teal-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.consulting}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.nonprofit}</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Zap className="h-5 w-5 text-cyan-600" />
                  <span className="font-medium text-gray-700">{currentContent.comingSoon.categories.startup}</span>
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
