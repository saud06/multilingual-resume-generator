"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Zap } from 'lucide-react';

interface DemoStatusProps {
  onSignupClick: () => void;
}

export default function DemoStatus({ onSignupClick }: DemoStatusProps) {
  const { isAuthenticated, isLoading, demoGenerationsLeft, totalDemoGenerations, isDemoMode } = useAuth();
  const { language } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const content = {
    en: {
      demoMode: "Demo Mode",
      limitReached: "Demo Limit Reached",
      left: "left",
      remainingGenerations: (count: number) => `You have ${count} free resume generation${count !== 1 ? 's' : ''} remaining`,
      signUpToContinue: "Sign in to continue generating resumes and unlock all features",
      signUpFree: "Sign In",
      signUpToSave: "💡 Sign up to save your resumes and get unlimited generations",
      signUp: "Sign Up"
    },
    de: {
      demoMode: "Demo-Modus",
      limitReached: "Demo-Limit erreicht",
      left: "übrig",
      remainingGenerations: (count: number) => `Sie haben noch ${count} kostenlose Lebenslauf-Erstellung${count !== 1 ? 'en' : ''} übrig`,
      signUpToContinue: "Melden Sie sich an, um weitere Lebensläufe zu erstellen und alle Funktionen freizuschalten",
      signUpFree: "Anmelden",
      signUpToSave: "💡 Registrieren Sie sich, um Ihre Lebensläufe zu speichern und unbegrenzte Erstellungen zu erhalten",
      signUp: "Registrieren"
    }
  };

  const currentContent = content[language];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading && !isAuthenticated) {
      // Only show content after a brief delay to ensure auth state is stable
      const timer = setTimeout(() => {
        setShowContent(true);
      }, 150);
      return () => clearTimeout(timer);
    } else if (isAuthenticated) {
      // Hide immediately if authenticated
      setShowContent(false);
    }
  }, [isMounted, isLoading, isAuthenticated]);

  // Don't render anything until mounted
  if (!isMounted) {
    return null;
  }

  // Don't show anything if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  // Don't show anything if still loading or content shouldn't be shown yet
  if (isLoading || !showContent) {
    return null;
  }

  // Show demo status
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full">
              {isDemoMode ? (
                <Zap className="h-4 w-4 text-primary" />
              ) : (
                <Clock className="h-4 w-4 text-orange-600" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">
                  {isDemoMode ? currentContent.demoMode : currentContent.limitReached}
                </h3>
                <Badge variant={isDemoMode ? "default" : "destructive"} className="text-xs">
                  {demoGenerationsLeft}/{totalDemoGenerations} {currentContent.left}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {isDemoMode 
                  ? currentContent.remainingGenerations(demoGenerationsLeft)
                  : currentContent.signUpToContinue
                }
              </p>
            </div>
          </div>
          
          {!isDemoMode && (
            <Button 
              onClick={onSignupClick}
              size="sm"
              className="flex items-center gap-2"
            >
              <Sparkles className="h-3 w-3" />
              {currentContent.signUpFree}
            </Button>
          )}
        </div>
        
        {isDemoMode && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-700">
                {currentContent.signUpToSave}
              </p>
              <Button 
                onClick={onSignupClick}
                variant="outline"
                size="sm"
                className="text-xs h-7"
              >
                {currentContent.signUp}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
