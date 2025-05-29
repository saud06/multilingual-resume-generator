import Link from "next/link";
import { FileText, Github, Linkedin, Mail } from "lucide-react";

interface ProfessionalFooterProps {
  language: "en" | "de";
}

export default function ProfessionalFooter({ language }: ProfessionalFooterProps) {
  const currentYear = new Date().getFullYear();
  
  const content = {
    en: {
      tagline: "All rights reserved.",
      description: "Professional resume generation powered by artificial intelligence",
      links: {
        about: "About",
        privacy: "Privacy",
        terms: "Terms",
        contact: "Contact"
      },
      copyright: `© ${currentYear} ResumeAI. All rights reserved.`
    },
    de: {
      tagline: "Alle Rechte vorbehalten.",
      description: "Professionelle Lebenslauf-Erstellung mit künstlicher Intelligenz",
      links: {
        about: "Über uns",
        privacy: "Datenschutz",
        terms: "AGB",
        contact: "Kontakt"
      },
      copyright: `© ${currentYear} ResumeAI. Alle Rechte vorbehalten.`
    }
  };

  const currentContent = content[language];

  return (
    <footer className="bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-primary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 gradient-professional rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient-professional">ResumeAI</span>
            </div>
            <p className="text-professional mb-4 max-w-md">
              {currentContent.description}
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-professional hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5"
              >
                <Github className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-professional hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-professional hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/create" className="text-professional hover:text-primary transition-colors">
                  Create Resume
                </Link>
              </li>
              <li>
                <Link href="/templates" className="text-professional hover:text-primary transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-professional hover:text-primary transition-colors">
                  Examples
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-primary mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-professional hover:text-primary transition-colors">
                  {currentContent.links.about}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-professional hover:text-primary transition-colors">
                  {currentContent.links.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-professional hover:text-primary transition-colors">
                  {currentContent.links.terms}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-professional hover:text-primary transition-colors">
                  {currentContent.links.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-professional-light text-sm">
            {currentContent.copyright}
          </p>
          <p className="text-professional-light text-sm mt-2 md:mt-0">
            {currentContent.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
