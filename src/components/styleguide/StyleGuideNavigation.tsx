
import React from 'react';
import { Palette, Type, Package, BarChart3, MousePointer, Layout, Wrench } from 'lucide-react';

interface StyleGuideNavigationProps {
  onItemClick?: () => void;
}

const StyleGuideNavigation: React.FC<StyleGuideNavigationProps> = ({ onItemClick }) => {
  const sections = [
    { id: 'colors', title: 'Farby & Brand', icon: Palette },
    { id: 'typography', title: 'Typografia', icon: Type },
    { id: 'basic', title: 'Základné komponenty', icon: Package },
    { id: 'data', title: 'Zobrazovanie dát', icon: BarChart3 },
    { id: 'interactive', title: 'Interaktívne komponenty', icon: MousePointer },
    { id: 'layout', title: 'Layout komponenty', icon: Layout },
    { id: 'specialized', title: 'Špecializované komponenty', icon: Wrench },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onItemClick?.();
    }
  };

  return (
    <nav className="p-4 space-y-2">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Style Guide</h2>
        <p className="text-sm text-muted-foreground">
          Navigujte medzi sekciami
        </p>
      </div>
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Icon className="h-4 w-4" />
            <span className="text-sm">{section.title}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default StyleGuideNavigation;
