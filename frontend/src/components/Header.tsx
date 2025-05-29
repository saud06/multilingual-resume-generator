"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FileText, Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AuthModal from "./AuthModal";

interface HeaderProps {
  language: "en" | "de";
  onLanguageChange: (language: "en" | "de") => void;
}

export default function Header({ language, onLanguageChange }: HeaderProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { data: session } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const getLinkClassName = (path: string) => {
    const baseClasses = "transition-colors font-medium";
    if (isActive(path)) {
      return `${baseClasses} text-primary border-b-2 border-primary pb-1`;
    }
    return `${baseClasses} text-gray-600 hover:text-gray-900`;
  };

  const content = {
    en: {
      nav: {
        createResume: "Create Resume",
        myResumes: "My Resumes",
        templates: "Templates",
        examples: "Examples"
      },
      auth: {
        hello: "Hello",
        signIn: "Sign In",
        signOut: "Sign Out"
      }
    },
    de: {
      nav: {
        createResume: "Lebenslauf erstellen",
        myResumes: "Meine Lebensläufe",
        templates: "Vorlagen",
        examples: "Beispiele"
      },
      auth: {
        hello: "Hallo",
        signIn: "Anmelden",
        signOut: "Abmelden"
      }
    }
  };

  const currentContent = content[language];

  return (
    <>
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">ResumeAI</span>
          </Link>
          
          {/* Desktop Navigation */}
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
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            {/* Language Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => onLanguageChange("de")}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  language === "de"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                DE
              </button>
              <button
                onClick={() => onLanguageChange("en")}
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
                {currentContent.auth.signIn}
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link 
                href="/create" 
                className={`block py-2 ${getLinkClassName("/create")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentContent.nav.createResume}
              </Link>
              {(isAuthenticated || session) && (
                <Link 
                  href="/my-resumes" 
                  className={`block py-2 ${getLinkClassName("/my-resumes")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {currentContent.nav.myResumes}
                </Link>
              )}
              <Link 
                href="/templates" 
                className={`block py-2 ${getLinkClassName("/templates")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentContent.nav.templates}
              </Link>
              <Link 
                href="/examples" 
                className={`block py-2 ${getLinkClassName("/examples")}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {currentContent.nav.examples}
              </Link>
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t">
                {(isAuthenticated || session) ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">
                      {currentContent.auth.hello}, {session?.user?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        if (session) {
                          signOut();
                        } else {
                          logout();
                        }
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      {currentContent.auth.signOut}
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setShowAuthModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {currentContent.auth.signIn}
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialTab="login"
        title="Welcome Back"
        description="Sign in to access your saved resumes"
      />
    </>
  );
}
