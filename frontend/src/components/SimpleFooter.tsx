interface SimpleFooterProps {
  language?: "en" | "de";
}

export default function SimpleFooter({ language = "en" }: SimpleFooterProps) {
  const content = {
    en: "All rights reserved.",
    de: "Alle Rechte vorbehalten."
  };

  return (
    <footer className="py-8 px-4 bg-gray-50 border-t">
      <div className="container mx-auto text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} ResumeAI. {content[language]}</p>
      </div>
    </footer>
  );
}
