"use client";

import Header from "@/components/Header";
import ResumeForm from "@/components/ResumeForm";
import SimpleFooter from "@/components/SimpleFooter";
import { useLanguage } from "@/contexts/LanguageContext";

export default function CreateResumePage() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header language={language} onLanguageChange={setLanguage} />
      <ResumeForm />
      <SimpleFooter language={language} />
    </div>
  );
}
