"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSession } from 'next-auth/react';
import { resumeStorage, type SavedResume } from '@/services/resumeStorage';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import SimpleFooter from "@/components/SimpleFooter";
import AuthModal from "@/components/AuthModal";
import { 
  FileText, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Copy, 
  Trash2, 
  Download, 
  Calendar,
  Globe,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService } from '@/lib/api';

export default function MyResumesPage() {
  const { isAuthenticated } = useAuth();
  const { data: session, status } = useSession();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const content = {
    en: {
      title: "My Resumes",
      subtitle: "Manage and organize your professional resumes",
      searchPlaceholder: "Search resumes...",
      createNew: "Create New Resume",
      noResumes: "No resumes found",
      noResumesDesc: "You haven't created any resumes yet. Start by creating your first professional resume.",
      noResumesYet: "No resumes yet",
      createFirst: "Create your first resume to get started",
      createFirstButton: "Create Your First Resume",
      adjustSearch: "Try adjusting your search terms",
      signInRequired: "Sign In Required",
      signInDesc: "You need to sign in to view your saved resumes",
      signInButton: "Sign In",
      backToHome: "Back to Home",
      actions: {
        edit: "Edit",
        duplicate: "Duplicate", 
        download: "Download",
        delete: "Delete"
      },
      styles: {
        german: "German Style",
        international: "International"
      },
      view: "View",
      fallback: "Fallback",
      template: "Template"
    },
    de: {
      title: "Meine Lebensläufe",
      subtitle: "Verwalten und organisieren Sie Ihre professionellen Lebensläufe",
      searchPlaceholder: "Lebensläufe suchen...",
      createNew: "Neuen Lebenslauf erstellen",
      noResumes: "Keine Lebensläufe gefunden",
      noResumesDesc: "Sie haben noch keine Lebensläufe erstellt. Beginnen Sie mit der Erstellung Ihres ersten professionellen Lebenslaufs.",
      noResumesYet: "Noch keine Lebensläufe",
      createFirst: "Erstellen Sie Ihren ersten Lebenslauf, um zu beginnen",
      createFirstButton: "Ihren ersten Lebenslauf erstellen",
      adjustSearch: "Versuchen Sie, Ihre Suchbegriffe anzupassen",
      signInRequired: "Anmeldung erforderlich",
      signInDesc: "Sie müssen sich anmelden, um Ihre gespeicherten Lebensläufe anzuzeigen",
      signInButton: "Anmelden",
      backToHome: "Zurück zur Startseite",
      actions: {
        edit: "Bearbeiten",
        duplicate: "Duplizieren",
        download: "Herunterladen", 
        delete: "Löschen"
      },
      styles: {
        german: "Deutscher Stil",
        international: "International"
      },
      view: "Ansehen",
      fallback: "Fallback",
      template: "Vorlage"
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    if (isAuthenticated || session) {
      loadResumes();
    }
  }, [isAuthenticated, session]);

  const loadResumes = () => {
    const savedResumes = resumeStorage.getAllResumes();
    setResumes(savedResumes);
  };

  const handleDeleteResume = (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      resumeStorage.deleteResume(id);
      loadResumes();
    }
  };

  const handleDuplicateResume = (id: string) => {
    resumeStorage.duplicateResume(id);
    loadResumes();
  };

  const handleEditResume = (resume: SavedResume) => {
    // Store the resume data in localStorage for editing
    localStorage.setItem('editingResume', JSON.stringify(resume));
    router.push('/create');
  };

  const handleViewResume = (resume: SavedResume) => {
    // For now, redirect to create page with resume data for viewing
    // In the future, you could create a dedicated view page
    localStorage.setItem('viewingResume', JSON.stringify(resume));
    router.push('/create');
  };

  const handleDownloadResume = async (resume: SavedResume) => {
    try {
      // Prepare export data
      const exportData = {
        personal_info: resume.personalInfo,
        experiences: resume.experiences || [],
        education: resume.education || [],
        skills: resume.skills || [],
        languages: resume.languages || [],
        projects: resume.projects || [],
        content: resume.content,
        language: resume.language,
        style: resume.style,
        template: (resume as any).template || 'classic',
      };

      const blob = await apiService.exportPdf(exportData);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resume.personalInfo.firstName}-${resume.personalInfo.lastName}-Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('PDF download failed:', error);
      alert(language === 'de' ? 'PDF-Download fehlgeschlagen. Bitte versuchen Sie es erneut.' : 'PDF download failed. Please try again.');
    }
  };

  const filteredResumes = resumes.filter(resume =>
    resume.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resume.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <>
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <SimpleFooter language={language} />
      </>
    );
  }

  if (!isAuthenticated && !session) {
    return (
      <>
        <Header language={language} onLanguageChange={setLanguage} />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>{currentContent.signInRequired}</CardTitle>
              <CardDescription>
                {currentContent.signInDesc}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowAuthModal(true)}
                className="w-full mb-2"
              >
                <User className="mr-2 h-4 w-4" />
                {currentContent.signInButton}
              </Button>
              <Link href="/">
                <Button variant="outline" className="w-full">
                  {currentContent.backToHome}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialTab="login"
        />
        <SimpleFooter language={language} />
      </>
    );
  }

  return (
    <>
      <Header language={language} onLanguageChange={setLanguage} />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="text-center py-8">
            <h1 className="text-4xl font-bold mb-4 text-gradient-professional">
              {currentContent.title}
            </h1>
            <p className="text-xl text-gray-600">{currentContent.subtitle}</p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={currentContent.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Link href="/">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {currentContent.createNew}
              </Button>
            </Link>
          </div>

          {/* Resumes Grid */}
          {filteredResumes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? currentContent.noResumes : currentContent.noResumesYet}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? currentContent.adjustSearch
                    : currentContent.createFirst
                  }
                </p>
                {!searchTerm && (
                  <Link href="/">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      {currentContent.createFirstButton}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResumes.map((resume) => (
                <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1">{resume.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {resume.personalInfo.firstName} {resume.personalInfo.lastName}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditResume(resume)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {currentContent.actions.edit}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicateResume(resume.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            {currentContent.actions.duplicate}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownloadResume(resume)}>
                            <Download className="h-4 w-4 mr-2" />
                            {currentContent.actions.download}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteResume(resume.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {currentContent.actions.delete}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Badges */}
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          {resume.language.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {resume.style === 'german' ? currentContent.styles.german : currentContent.styles.international}
                        </Badge>
                        {resume.isFallback && (
                          <Badge variant="destructive" className="text-xs">
                            {currentContent.template}
                          </Badge>
                        )}
                      </div>

                      {/* Content Preview */}
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {resume.content.substring(0, 150)}...
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(resume.updatedAt).toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleViewResume(resume)}>
                          {currentContent.view}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
      <SimpleFooter language={language} />
    </>
  );
}
