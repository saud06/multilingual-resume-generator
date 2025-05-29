"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SignupPromptProps {
  onSignupClick: () => void;
  isLastDemo?: boolean;
}

export default function SignupPrompt({ onSignupClick, isLastDemo = false }: SignupPromptProps) {
  const { language } = useLanguage();

  const content = {
    en: {
      titleLast: "🎉 Great Resume!",
      titleMore: "🚀 Ready for More?",
      messageLast: "You've used your last free generation. Sign up to continue creating amazing resumes!",
      messageMore: "Love what you see? Sign up to save this resume and unlock unlimited generations!",
      features: {
        saveUnlimited: "Save unlimited resumes",
        aiTone: "AI tone customization", 
        atsScoring: "ATS scoring & analytics",
        jobParser: "Job posting parser"
      },
      signUpFree: "Sign Up Free",
      free: "100% Free",
      disclaimer: "No credit card required • Takes 30 seconds"
    },
    de: {
      titleLast: "🎉 Großartiger Lebenslauf!",
      titleMore: "🚀 Bereit für mehr?",
      messageLast: "Sie haben Ihre letzte kostenlose Erstellung verwendet. Registrieren Sie sich, um weitere fantastische Lebensläufe zu erstellen!",
      messageMore: "Gefällt Ihnen was Sie sehen? Registrieren Sie sich, um diesen Lebenslauf zu speichern und unbegrenzte Erstellungen freizuschalten!",
      features: {
        saveUnlimited: "Unbegrenzt Lebensläufe speichern",
        aiTone: "KI-Tonalitäts-Anpassung",
        atsScoring: "ATS-Bewertung & Analyse", 
        jobParser: "Stellenausschreibungs-Parser"
      },
      signUpFree: "Kostenlos registrieren",
      free: "100% Kostenlos",
      disclaimer: "Keine Kreditkarte erforderlich • Dauert 30 Sekunden"
    }
  };

  const currentContent = content[language];

  return (
    <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 shadow-lg">
      <CardContent className="p-6 text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Sparkles className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 text-gray-900">
          {isLastDemo ? currentContent.titleLast : currentContent.titleMore}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {isLastDemo 
            ? currentContent.messageLast
            : currentContent.messageMore
          }
        </p>

        <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>{currentContent.features.saveUnlimited}</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>{currentContent.features.aiTone}</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>{currentContent.features.atsScoring}</span>
          </div>
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-4 w-4" />
            <span>{currentContent.features.jobParser}</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button 
            onClick={onSignupClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
          >
            <Star className="h-4 w-4" />
            {currentContent.signUpFree}
          </Button>
          
          <Badge variant="secondary" className="flex items-center gap-1 px-3 py-1">
            <Zap className="h-3 w-3" />
            {currentContent.free}
          </Badge>
        </div>

        <p className="text-xs text-gray-500 mt-3">
          {currentContent.disclaimer}
        </p>
      </CardContent>
    </Card>
  );
}
