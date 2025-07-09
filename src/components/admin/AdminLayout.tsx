
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const AdminLayout = ({ title, subtitle, actions, children }: AdminLayoutProps) => {
  const { i18n } = useTranslation();
  const [languageKey, setLanguageKey] = useState(i18n.language);

  // Listen for language changes and force re-render
  useEffect(() => {
    const handleLanguageChange = () => {
      console.log('AdminLayout: Language change detected, forcing re-render');
      setLanguageKey(i18n.language + '_' + Date.now());
    };

    window.addEventListener('languageChanged', handleLanguageChange);
    
    // Also listen to i18n changes directly
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange);
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  return (
    <SidebarProvider key={languageKey}>
      <div className="min-h-screen flex w-full bg-slate-100 safe-area-inset-top safe-area-inset-bottom">
        <AdminSidebar />
        
        <SidebarInset className="flex flex-col w-full">
          <AdminHeader title={title} subtitle={subtitle} actions={actions} />
          
          <main className="flex-1 p-3 md:p-6 safe-area-inset-left safe-area-inset-right">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
