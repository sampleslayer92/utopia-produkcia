
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CodeBlock from '../CodeBlock';

interface ColorsSectionProps {
  searchTerm: string;
}

const ColorsSection: React.FC<ColorsSectionProps> = ({ searchTerm }) => {
  if (searchTerm && !('farby colors brand').includes(searchTerm.toLowerCase())) {
    return null;
  }

  const colorPalette = [
    { name: 'Primary', var: '--primary', class: 'bg-primary', desc: 'Hlavná farba aplikácie' },
    { name: 'Secondary', var: '--secondary', class: 'bg-secondary', desc: 'Sekundárna farba' },
    { name: 'Destructive', var: '--destructive', class: 'bg-destructive', desc: 'Chybové stavy' },
    { name: 'Muted', var: '--muted', class: 'bg-muted', desc: 'Tlmené pozadie' },
    { name: 'Accent', var: '--accent', class: 'bg-accent', desc: 'Zvýrazňovacia farba' },
    { name: 'Border', var: '--border', class: 'bg-border', desc: 'Okraje a rozdeľovače' },
    { name: 'Input', var: '--input', class: 'bg-input', desc: 'Pozadie input polí' },
    { name: 'Ring', var: '--ring', class: 'bg-ring', desc: 'Focus ring farba' },
  ];

  return (
    <section id="colors" className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">🎨 Farby & Brand Identity</h2>
        <p className="text-muted-foreground">
          Farebná paleta a brand identity elementy používané v aplikácii.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hlavná farebná paleta</CardTitle>
          <CardDescription>
            CSS custom properties definované v našom design systéme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {colorPalette.map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`h-16 rounded-lg border ${color.class}`}></div>
                <div>
                  <p className="font-medium text-sm">{color.name}</p>
                  <p className="text-xs text-muted-foreground">{color.desc}</p>
                  <code className="text-xs bg-muted px-1 rounded">{color.var}</code>
                </div>
              </div>
            ))}
          </div>
          
          <CodeBlock
            code={`// Použitie farieb v Tailwind CSS
<div className="bg-primary text-primary-foreground">
  Primárny button
</div>

<div className="bg-destructive text-destructive-foreground">
  Chybový stav
</div>

// CSS Custom Properties
:root {
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
}`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gradients & Effects</CardTitle>
          <CardDescription>Špeciálne efekty a gradienty</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="h-24 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600"></div>
            <div className="h-24 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600"></div>
            <div className="h-24 rounded-lg bg-gradient-to-r from-orange-500 to-red-600"></div>
          </div>
          
          <CodeBlock
            code={`// Gradient utilities
<div className="bg-gradient-to-r from-blue-500 to-purple-600">
  Gradient pozadie
</div>

// Backdrop blur efekt
<div className="bg-white/80 backdrop-blur-sm">
  Glassmorphism efekt
</div>`}
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default ColorsSection;
