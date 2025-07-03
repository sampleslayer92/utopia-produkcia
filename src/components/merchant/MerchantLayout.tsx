import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MerchantSidebar } from "./MerchantSidebar";

interface MerchantLayoutProps {
  children: React.ReactNode;
}

export function MerchantLayout({ children }: MerchantLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
        <MerchantSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header with global trigger */}
          <header className="h-12 flex items-center border-b border-slate-200/60 bg-white/80 backdrop-blur-sm px-4">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-slate-900">Merchant Dashboard</h1>
            </div>
          </header>
          
          {/* Main content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}