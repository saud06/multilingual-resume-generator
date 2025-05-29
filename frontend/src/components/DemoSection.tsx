"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Download } from "lucide-react";

interface DemoSectionProps {
  language: "en" | "de";
}

export default function DemoSection({ language }: DemoSectionProps) {
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

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
    setIsDownloading(type);
    
    try {
      const sampleData = type === "german" ? sampleGermanData : sampleInternationalData;
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      
      const response = await fetch(`${apiUrl}/resumes/export-pdf`, {
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      const baseUrl = apiUrl.replace('/api', '');
      alert(`Download failed. Please make sure the backend server is running on ${baseUrl}`);
    } finally {
      setIsDownloading(null);
    }
  };

  const content = {
    en: {
      title: "See It In Action",
      description: "Experience the power of AI-driven resume generation",
      german: "German Style (Lebenslauf)",
      international: "International Style",
      germanPreviewTitle: "German Lebenslauf Preview",
      internationalPreviewTitle: "International Resume Preview",
      professionalExperience: "Professional Experience",
      keySkills: "Key Skills",
      downloadPdf: "Download PDF",
      generating: "Generating...",
      photo: "Photo"
    },
    de: {
      title: "In Aktion erleben",
      description: "Erleben Sie die Kraft der KI-gesteuerten Lebenslauf-Erstellung",
      german: "Deutscher Stil (Lebenslauf)",
      international: "Internationaler Stil",
      germanPreviewTitle: "Deutsche Lebenslauf-Vorschau",
      internationalPreviewTitle: "Internationale Lebenslauf-Vorschau",
      professionalExperience: "Berufserfahrung",
      keySkills: "Wichtige Fähigkeiten",
      downloadPdf: "PDF herunterladen",
      generating: "Wird erstellt...",
      photo: "Foto"
    }
  };

  const currentContent = content[language];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{currentContent.title}</h2>
          <p className="text-xl text-gray-600">{currentContent.description}</p>
        </div>

        <Tabs defaultValue="german" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="german">{currentContent.german}</TabsTrigger>
            <TabsTrigger value="international">{currentContent.international}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="german" className="mt-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  {currentContent.germanPreviewTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-20 bg-gray-300 rounded flex items-center justify-center text-xs">
                      {currentContent.photo}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">Max Mustermann</h3>
                      <p className="text-sm text-gray-600">Software Entwickler</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Geboren: 15.03.1990 | Familienstand: Ledig
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Berufserfahrung</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>2020-2024:</strong> Senior Software Entwickler, TechCorp GmbH</p>
                    <p><strong>2018-2020:</strong> Junior Entwickler, StartupXYZ</p>
                  </div>
                </div>
                <Button 
                  className="w-full btn-professional shadow-professional hover:shadow-professional-lg" 
                  onClick={() => handleDemoDownload("german")}
                  disabled={isDownloading === "german"}
                >
                  {isDownloading === "german" ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {currentContent.generating}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {currentContent.downloadPdf}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="international" className="mt-8">
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="mr-2 h-5 w-5" />
                  {currentContent.internationalPreviewTitle}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg">John Smith</h3>
                  <p className="text-gray-600">Full-Stack Software Engineer</p>
                  <p className="text-sm text-gray-500">john.smith@email.com | +1-555-0123</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">{currentContent.professionalExperience}</h4>
                  <div className="text-sm space-y-1">
                    <p><strong>Senior Software Engineer</strong> | TechCorp (2020-2024)</p>
                    <p><strong>Software Developer</strong> | StartupXYZ (2018-2020)</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">{currentContent.keySkills}</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">React</Badge>
                    <Badge variant="secondary">TypeScript</Badge>
                    <Badge variant="secondary">Node.js</Badge>
                    <Badge variant="secondary">AWS</Badge>
                  </div>
                </div>
                <Button 
                  className="w-full btn-gold shadow-gold hover:shadow-professional-lg" 
                  onClick={() => handleDemoDownload("international")}
                  disabled={isDownloading === "international"}
                >
                  {isDownloading === "international" ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {currentContent.generating}
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {currentContent.downloadPdf}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
