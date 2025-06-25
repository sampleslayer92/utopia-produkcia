
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check } from 'lucide-react';

const ColorsSection = () => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const colorPalettes = [
    {
      name: 'Primary Colors',
      description: 'Hlavné farby používané pre primárne akcie a branding',
      colors: [
        { name: 'Primary', hex: '#3B82F6', hsl: 'hsl(217, 91%, 60%)', css: 'bg-primary', usage: 'Buttons, links, highlights' },
        { name: 'Primary Foreground', hex: '#FFFFFF', hsl: 'hsl(0, 0%, 100%)', css: 'text-primary-foreground', usage: 'Text on primary background' },
      ]
    },
    {
      name: 'Secondary Colors',
      description: 'Sekundárne farby pre podporné elementy',
      colors: [
        { name: 'Secondary', hex: '#F1F5F9', hsl: 'hsl(210, 40%, 96%)', css: 'bg-secondary', usage: 'Secondary buttons, backgrounds' },
        { name: 'Secondary Foreground', hex: '#0F172A', hsl: 'hsl(222, 84%, 5%)', css: 'text-secondary-foreground', usage: 'Text on secondary background' },
      ]
    },
    {
      name: 'Neutral Colors',
      description: 'Neutrálne farby pre text, borders a backgrounds',
      colors: [
        { name: 'Background', hex: '#FFFFFF', hsl: 'hsl(0, 0%, 100%)', css: 'bg-background', usage: 'Main page background' },
        { name: 'Foreground', hex: '#0F172A', hsl: 'hsl(222, 84%, 5%)', css: 'text-foreground', usage: 'Primary text color' },
        { name: 'Muted', hex: '#F8FAFC', hsl: 'hsl(210, 40%, 98%)', css: 'bg-muted', usage: 'Subtle backgrounds' },
        { name: 'Muted Foreground', hex: '#64748B', hsl: 'hsl(215, 16%, 47%)', css: 'text-muted-foreground', usage: 'Secondary text' },
        { name: 'Border', hex: '#E2E8F0', hsl: 'hsl(214, 32%, 91%)', css: 'border-border', usage: 'Component borders' },
      ]
    },
    {
      name: 'Semantic Colors',
      description: 'Farby s významom pre feedback a stavy',
      colors: [
        { name: 'Destructive', hex: '#EF4444', hsl: 'hsl(0, 84%, 60%)', css: 'bg-destructive', usage: 'Error states, delete actions' },
        { name: 'Success', hex: '#10B981', hsl: 'hsl(158, 64%, 52%)', css: 'bg-green-500', usage: 'Success messages, completed states' },
        { name: 'Warning', hex: '#F59E0B', hsl: 'hsl(45, 93%, 47%)', css: 'bg-yellow-500', usage: 'Warning messages, pending states' },
        { name: 'Info', hex: '#3B82F6', hsl: 'hsl(217, 91%, 60%)', css: 'bg-blue-500', usage: 'Information messages' },
      ]
    }
  ];

  const copyToClipboard = async (value: string, type: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedColor(`${value}-${type}`);
      setTimeout(() => setCopiedColor(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Color System</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Kompletná farebná paleta Utopia projektu s hex, HSL hodnotami a Tailwind classes. 
          Kliknite na farbu pre skopírovanie hodnoty.
        </p>
      </div>

      <div className="space-y-8">
        {colorPalettes.map((palette, paletteIndex) => (
          <Card key={paletteIndex}>
            <CardHeader>
              <CardTitle className="text-2xl">{palette.name}</CardTitle>
              <p className="text-slate-600">{palette.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {palette.colors.map((color, colorIndex) => (
                  <div key={colorIndex} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    {/* Color Preview */}
                    <div 
                      className="w-full h-20 rounded-lg mb-4 border border-slate-200 shadow-inner"
                      style={{ backgroundColor: color.hex }}
                    />
                    
                    {/* Color Info */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900">{color.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {color.css}
                        </Badge>
                      </div>
                      
                      {/* Copy Buttons */}
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between h-8 px-3 font-mono text-xs"
                          onClick={() => copyToClipboard(color.hex, 'hex')}
                        >
                          <span>{color.hex}</span>
                          {copiedColor === `${color.hex}-hex` ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-between h-8 px-3 font-mono text-xs"
                          onClick={() => copyToClipboard(color.hsl, 'hsl')}
                        >
                          <span className="truncate">{color.hsl}</span>
                          {copiedColor === `${color.hsl}-hsl` ? (
                            <Check className="h-3 w-3 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                      
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {color.usage}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Usage Examples */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Použitie farieb v kóde</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tailwind Classes</h4>
              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`<Button className="bg-primary text-primary-foreground">
  Primary Button
</Button>

<div className="bg-muted text-muted-foreground p-4">
  Muted background section
</div>`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">CSS Variables</h4>
              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`:root {
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --secondary-foreground: 222 84% 5%;
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColorsSection;
