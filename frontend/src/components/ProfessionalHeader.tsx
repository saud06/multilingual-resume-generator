"use client";

import Link from "next/link";
import { FileText, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ProfessionalHeaderProps {
  language: "en" | "de";
  onLanguageChange: (language: "en" | "de") => void;
  session?: any;
  onSignOut?: () => void;
  onAuthClick?: () => void;
  content: {
    signIn: string;
  };
}

export default function ProfessionalHeader({
  language,
  onLanguageChange,
  session,
  onSignOut,
  onAuthClick,
  content
}: ProfessionalHeaderProps) {
  return (
    <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50 shadow-professional">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="h-10 w-10 gradient-professional rounded-xl flex items-center justify-center shadow-professional group-hover:shadow-professional-lg transition-all duration-300">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-gradient-professional">ResumeAI</span>
            <span className="text-xs text-professional-light">Professional Resume Builder</span>
          </div>
        </Link>
        
        <div className="flex items-center space-x-6">
          {/* Language Toggle */}
          <div className="flex items-center space-x-3 bg-muted/50 rounded-full px-4 py-2">
            <Label htmlFor="language-toggle" className="text-sm font-medium">EN</Label>
            <Switch
              id="language-toggle"
              checked={language === "de"}
              onCheckedChange={(checked) => onLanguageChange(checked ? "de" : "en")}
              className="data-[state=checked]:bg-secondary"
            />
            <Label htmlFor="language-toggle" className="text-sm font-medium">DE</Label>
          </div>

          {/* User Section */}
          {session ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium">Hello, {session.user?.name?.split(' ')[0]}</p>
                <p className="text-xs text-professional-light">Welcome back</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onSignOut}
                className="border-primary/20 hover:bg-primary/5"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAuthClick}
              className="border-primary/20 hover:bg-primary/5 shadow-professional"
            >
              <User className="mr-2 h-4 w-4" />
              {content.signIn}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
