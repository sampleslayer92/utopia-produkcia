
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CodeBlock from '../CodeBlock';

interface LayoutComponentsSectionProps {
  searchTerm: string;
}

const LayoutComponentsSection: React.FC<LayoutComponentsSectionProps> = ({ searchTerm }) => {
  if (searchTerm && !('layout grid flex responsive rozloženie').includes(searchTerm.toLowerCase())) {
    return null;
  }

  return (
    <section id="layout" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">📱 Layout komponenty</h2>
        <p className="text-muted-foreground">
          Systémy rozloženia a responsive design patterns.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grid Systems</CardTitle>
          <CardDescription>CSS Grid a Flexbox rozloženia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Základný grid (3 stĺpce)</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded text-center">1</div>
                <div className="bg-muted p-4 rounded text-center">2</div>
                <div className="bg-muted p-4 rounded text-center">3</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Responsive grid</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-muted p-4 rounded text-center">1</div>
                <div className="bg-muted p-4 rounded text-center">2</div>
                <div className="bg-muted p-4 rounded text-center">3</div>
                <div className="bg-muted p-4 rounded text-center">4</div>
              </div>
            </div>
          </div>

          <CodeBlock
            code={`// Základný grid
<div className="grid grid-cols-3 gap-4">
  <div>Stĺpec 1</div>
  <div>Stĺpec 2</div>
  <div>Stĺpec 3</div>
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Automaticky sa prispôsobí obrazovke -->
</div>

// Flexbox rozloženie
<div className="flex justify-between items-center">
  <div>Vľavo</div>
  <div>Vpravo</div>
</div>`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Responsive Breakpoints</CardTitle>
          <CardDescription>Breakpointy používané v aplikácii</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">sm:</span>
              <span className="text-sm text-muted-foreground">640px a viac</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">md:</span>
              <span className="text-sm text-muted-foreground">768px a viac</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">lg:</span>
              <span className="text-sm text-muted-foreground">1024px a viac</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-muted rounded">
              <span className="font-medium">xl:</span>
              <span className="text-sm text-muted-foreground">1280px a viac</span>
            </div>
          </div>

          <CodeBlock
            code={`// Responsive utility classes
<div className="
  p-4 
  sm:p-6 
  md:p-8 
  lg:p-12
">
  Padding sa mení podľa obrazovky
</div>

// Hide/show na rôznych obrazovkách
<div className="block md:hidden">Iba mobile</div>
<div className="hidden md:block">Desktop a tablet</div>

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Responzívny nadpis
</h1>`}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default LayoutComponentsSection;
