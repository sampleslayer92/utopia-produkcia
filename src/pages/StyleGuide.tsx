
import React, { useState } from 'react';
import { Search, Copy, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StyleGuideNavigation from '@/components/styleguide/StyleGuideNavigation';
import ColorsSection from '@/components/styleguide/sections/ColorsSection';
import TypographySection from '@/components/styleguide/sections/TypographySection';
import BasicComponentsSection from '@/components/styleguide/sections/BasicComponentsSection';
import DataDisplaySection from '@/components/styleguide/sections/DataDisplaySection';
import InteractiveComponentsSection from '@/components/styleguide/sections/InteractiveComponentsSection';
import LayoutComponentsSection from '@/components/styleguide/sections/LayoutComponentsSection';
import SpecializedComponentsSection from '@/components/styleguide/sections/SpecializedComponentsSection';

const StyleGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen bg-background ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex">
        {/* Desktop Navigation */}
        <div className="hidden lg:block w-64 border-r border-border bg-card/50 sticky top-0 h-screen overflow-y-auto">
          <StyleGuideNavigation />
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Navigácia</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <StyleGuideNavigation onItemClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold">Style Guide</h1>
                  <p className="text-sm text-muted-foreground">
                    Kompletný prehľad design systému aplikácie
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative w-64 hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Hľadať komponenty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="icon" onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="p-6 space-y-12">
            {/* Introduction */}
            <section className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Vitajte v Style Guide</CardTitle>
                  <CardDescription>
                    Tento style guide obsahuje všetky komponenty, farby, typografiu a design patterns
                    používané v našej aplikácii. Slúži ako referencia pre dizajnérov a vývojárov.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">🎨 Design Tokens</h4>
                      <p className="text-sm text-muted-foreground">Farby, spacing, typography</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">🧩 Komponenty</h4>
                      <p className="text-sm text-muted-foreground">UI komponenty s live preview</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium">📱 Responsive Design</h4>
                      <p className="text-sm text-muted-foreground">Mobile-first prístup</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Sections */}
            <ColorsSection searchTerm={searchTerm} />
            <TypographySection searchTerm={searchTerm} />
            <BasicComponentsSection searchTerm={searchTerm} />
            <DataDisplaySection searchTerm={searchTerm} />
            <InteractiveComponentsSection searchTerm={searchTerm} />
            <LayoutComponentsSection searchTerm={searchTerm} />
            <SpecializedComponentsSection searchTerm={searchTerm} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default StyleGuide;
