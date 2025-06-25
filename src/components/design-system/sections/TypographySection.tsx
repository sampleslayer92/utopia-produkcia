
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

const TypographySection = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const headingStyles = [
    { level: 'h1', class: 'text-4xl font-bold', example: 'Main Page Title', usage: 'Page headers, hero titles' },
    { level: 'h2', class: 'text-3xl font-bold', example: 'Section Header', usage: 'Major section titles' },
    { level: 'h3', class: 'text-2xl font-semibold', example: 'Subsection Title', usage: 'Card titles, subsections' },
    { level: 'h4', class: 'text-xl font-semibold', example: 'Component Header', usage: 'Component titles' },
    { level: 'h5', class: 'text-lg font-medium', example: 'Small Header', usage: 'Form section headers' },
    { level: 'h6', class: 'text-base font-medium', example: 'Tiny Header', usage: 'Labels, small titles' },
  ];

  const textStyles = [
    { name: 'Body Large', class: 'text-lg text-slate-700', example: 'Large body text for important content', usage: 'Hero descriptions, important paragraphs' },
    { name: 'Body', class: 'text-base text-slate-700', example: 'Regular body text for general content', usage: 'Default paragraph text' },
    { name: 'Body Small', class: 'text-sm text-slate-600', example: 'Smaller text for secondary information', usage: 'Helper text, descriptions' },
    { name: 'Caption', class: 'text-xs text-slate-500', example: 'Very small text for captions and labels', usage: 'Form labels, captions' },
    { name: 'Code', class: 'font-mono text-sm bg-slate-100 px-2 py-1 rounded', example: 'const example = "code"', usage: 'Inline code snippets' },
  ];

  const specialStyles = [
    { name: 'Link', class: 'text-blue-600 hover:text-blue-800 underline', example: 'Interactive link text', usage: 'Navigation links, external links' },
    { name: 'Muted', class: 'text-slate-500', example: 'Muted secondary text', usage: 'Placeholder text, disabled text' },
    { name: 'Error', class: 'text-red-600', example: 'Error message text', usage: 'Form validation errors' },
    { name: 'Success', class: 'text-green-600', example: 'Success message text', usage: 'Success notifications' },
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Typography System</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Typografický systém Utopia projektu s konzistentnými veľkosťami, farbami a štýlmi textu. 
          Všetky štýly sú optimalizované pre čitateľnosť a accessibility.
        </p>
      </div>

      {/* Headings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Headings</CardTitle>
          <p className="text-slate-600">Hierarhia nadpisov pre štruktúrovanie obsahu</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {headingStyles.map((heading, index) => (
              <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                    {heading.level}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`<${heading.level} className="${heading.class}">${heading.example}</${heading.level}>`)}
                  >
                    {copiedCode === `<${heading.level} className="${heading.class}">${heading.example}</${heading.level}>` ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className={heading.class + ' mb-2'}>{heading.example}</div>
                <div className="text-sm text-slate-600 mb-2">{heading.usage}</div>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                  className="{heading.class}"
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Body Text */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Body Text</CardTitle>
          <p className="text-slate-600">Štýly pre bežný textový obsah</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {textStyles.map((text, index) => (
              <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">
                    {text.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`<p className="${text.class}">${text.example}</p>`)}
                  >
                    {copiedCode === `<p className="${text.class}">${text.example}</p>` ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className={text.class + ' mb-2'}>{text.example}</div>
                <div className="text-sm text-slate-600 mb-2">{text.usage}</div>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                  className="{text.class}"
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Special Styles */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Special Text Styles</CardTitle>
          <p className="text-slate-600">Špecializované štýly pre interaktívne a sémantické texty</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {specialStyles.map((style, index) => (
              <div key={index} className="border-b border-slate-200 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500">
                    {style.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(`<span className="${style.class}">${style.example}</span>`)}
                  >
                    {copiedCode === `<span className="${style.class}">${style.example}</span>` ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <div className={style.class + ' mb-2'}>{style.example}</div>
                <div className="text-sm text-slate-600 mb-2">{style.usage}</div>
                <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono">
                  className="{style.class}"
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Font Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Tailwind Config</h4>
              <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  mono: ['Fira Code', 'Monaco', 'monospace'],
}`}
              </pre>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Font Weights</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="font-normal text-lg">Normal</div>
                  <code className="text-xs">font-normal (400)</code>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="font-medium text-lg">Medium</div>
                  <code className="text-xs">font-medium (500)</code>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="font-semibold text-lg">Semibold</div>
                  <code className="text-xs">font-semibold (600)</code>
                </div>
                <div className="text-center p-3 bg-slate-50 rounded">
                  <div className="font-bold text-lg">Bold</div>
                  <code className="text-xs">font-bold (700)</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypographySection;
