
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import DesignSystemSidebar from '@/components/design-system/DesignSystemSidebar';
import DesignSystemContent from '@/components/design-system/DesignSystemContent';

const DesignSystemPage = () => {
  const [selectedSection, setSelectedSection] = useState('foundations');
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="text-2xl font-bold text-slate-900">
              Utopia Design System
            </h1>
          </div>
          
          <div className="relative w-96 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Vyhľadať komponenty, farby, ikony..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 left-0 z-30 w-80 bg-white border-r border-slate-200 
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'shadow-lg' : ''}
        `}>
          <DesignSystemSidebar 
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
            searchTerm={searchTerm}
          />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <DesignSystemContent 
            selectedSection={selectedSection}
            searchTerm={searchTerm}
          />
        </main>
      </div>
    </div>
  );
};

export default DesignSystemPage;
