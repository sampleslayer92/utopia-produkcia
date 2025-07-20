
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import PageBreadcrumbs from "./PageBreadcrumbs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useChatBot } from "@/hooks/useChatBot";
import ChatBotFloatingButton from "@/components/chatbot/ChatBotFloatingButton";
import ChatBotWindow from "@/components/chatbot/ChatBotWindow";
import { useViewport } from "@/hooks/useViewport";

interface AdminLayoutProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const AdminLayout = ({ title, subtitle, actions, children }: AdminLayoutProps) => {
  const { i18n } = useTranslation();
  const [languageKey, setLanguageKey] = useState(i18n.language);
  const viewport = useViewport();
  const {
    messages,
    isOpen,
    isLoading,
    hasNewMessage,
    sendMessage,
    toggleChatBot,
    clearMessages,
  } = useChatBot();

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

  // Responsive classes based on viewport
  const getResponsiveClasses = () => {
    if (viewport.width <= 1366) {
      return "min-h-screen flex w-full bg-gradient-to-br from-blue-50/20 via-indigo-50/15 to-purple-50/20";
    }
    if (viewport.width <= 1440) {
      return "min-h-screen flex w-full bg-gradient-to-br from-blue-50/25 via-indigo-50/18 to-purple-50/25";
    }
    return "min-h-screen flex w-full bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30";
  };

  const getMainPadding = () => {
    if (viewport.width <= 1366) return "p-2";
    if (viewport.width <= 1440) return "p-3";
    return "p-4 md:p-6";
  };

  return (
    <SidebarProvider key={languageKey}>
      <div className={`${getResponsiveClasses()} safe-area-inset-top safe-area-inset-bottom overflow-hidden`}>
        <AdminSidebar />
        
        <SidebarInset className="flex flex-col w-full min-w-0 overflow-hidden">
          <AdminHeader 
            title={title} 
            subtitle={subtitle} 
            actions={actions}
            isCompact={viewport.width <= 1366}
          />
          
          <PageBreadcrumbs />
          
          <main className={`flex-1 ${getMainPadding()} safe-area-inset-left safe-area-inset-right overflow-hidden`}>
            <div className="h-full overflow-hidden">
              {children}
            </div>
          </main>
        </SidebarInset>
        
        {/* ChatBot Components */}
        <ChatBotFloatingButton
          isOpen={isOpen}
          hasNewMessage={hasNewMessage}
          onClick={toggleChatBot}
        />
        
        {isOpen && (
          <ChatBotWindow
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
            onClearMessages={clearMessages}
          />
        )}
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
