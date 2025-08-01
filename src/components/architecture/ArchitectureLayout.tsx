import ArchitectureSidebar from "./ArchitectureSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface ArchitectureLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  selectedSection: string;
  onSectionChange: (section: string, subsection?: string) => void;
  pluginCounts: Record<string, number>;
}

const ArchitectureLayout = ({ 
  title, 
  subtitle, 
  actions, 
  children, 
  selectedSection, 
  onSectionChange,
  pluginCounts 
}: ArchitectureLayoutProps) => {
  const { i18n } = useTranslation();
  const [languageKey, setLanguageKey] = useState(i18n.language);

  // Listen for language changes and force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      setLanguageKey(i18n.language + '_' + Date.now());
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <SidebarProvider key={languageKey}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30">
        <ArchitectureSidebar 
          selectedSection={selectedSection}
          onSectionChange={onSectionChange}
          pluginCounts={pluginCounts}
        />
        
        <SidebarInset className="flex flex-col w-full">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b border-slate-200/50 bg-white/80 backdrop-blur-sm">
            <SidebarTrigger className="-ml-1" />
            <div className="flex flex-1 items-center justify-between">
              <div className="flex flex-col">
                <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-slate-600">{subtitle}</p>
                )}
              </div>
              {actions && (
                <div className="flex items-center gap-2">
                  {actions}
                </div>
              )}
            </div>
          </header>
          
          <main className="flex-1 p-3 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ArchitectureLayout;