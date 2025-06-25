
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, Plus, Download, Trash2, Settings, ArrowRight } from 'lucide-react';

const ButtonsSection = () => {
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

  const buttonVariants = [
    {
      name: 'Default',
      variant: 'default' as const,
      description: 'Primárny button pre hlavné akcie',
      code: '<Button variant="default">Default Button</Button>'
    },
    {
      name: 'Secondary',
      variant: 'secondary' as const,
      description: 'Sekundárny button pre podporné akcie',
      code: '<Button variant="secondary">Secondary Button</Button>'
    },
    {
      name: 'Outline',
      variant: 'outline' as const,
      description: 'Button s okrajom pre menej dôležité akcie',
      code: '<Button variant="outline">Outline Button</Button>'
    },
    {
      name: 'Ghost',
      variant: 'ghost' as const,
      description: 'Minimálny button pre jemné akcie',
      code: '<Button variant="ghost">Ghost Button</Button>'
    },
    {
      name: 'Destructive',
      variant: 'destructive' as const,
      description: 'Button pre nebezpečné akcie (mazanie, reset)',
      code: '<Button variant="destructive">Destructive Button</Button>'
    },
    {
      name: 'Link',
      variant: 'link' as const,
      description: 'Button štylizovaný ako link',
      code: '<Button variant="link">Link Button</Button>'
    }
  ];

  const buttonSizes = [
    {
      name: 'Small',
      size: 'sm' as const,
      description: 'Malý button pre kompaktné rozhrania',
      code: '<Button size="sm">Small Button</Button>'
    },
    {
      name: 'Default',
      size: 'default' as const,
      description: 'Štandardná veľkosť buttonu',
      code: '<Button size="default">Default Button</Button>'
    },
    {
      name: 'Large',
      size: 'lg' as const,
      description: 'Veľký button pre dôležité akcie',
      code: '<Button size="lg">Large Button</Button>'
    },
    {
      name: 'Icon',
      size: 'icon' as const,
      description: 'Štvorcový button pre ikony',
      code: '<Button size="icon"><Plus className="h-4 w-4" /></Button>'
    }
  ];

  const buttonExamples = [
    {
      title: 'Button s ikonou',
      code: '<Button><Plus className="h-4 w-4 mr-2" />Add Item</Button>',
      component: <Button><Plus className="h-4 w-4 mr-2" />Add Item</Button>
    },
    {
      title: 'Loading state',
      code: '<Button disabled>Loading...</Button>',
      component: <Button disabled>Loading...</Button>
    },
    {
      title: 'Icon button',
      code: '<Button size="icon" variant="outline"><Settings className="h-4 w-4" /></Button>',
      component: <Button size="icon" variant="outline"><Settings className="h-4 w-4" /></Button>
    },
    {
      title: 'Button s trailing icon',
      code: '<Button variant="outline">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>',
      component: <Button variant="outline">Continue <ArrowRight className="h-4 w-4 ml-2" /></Button>
    }
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Button Components</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Kompletná kolekcia button komponentov s rôznymi variantmi, veľkosťami a stavmi. 
          Všetky buttony sú plne accessible a responzívne.
        </p>
      </div>

      {/* Button Variants */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Button Variants</CardTitle>
          <p className="text-slate-600">Rôzne vizuálne štýly buttonov pre rôzne kontexty</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buttonVariants.map((variant, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{variant.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(variant.code)}
                  >
                    {copiedCode === variant.code ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="mb-4 flex justify-center">
                  <Button variant={variant.variant}>
                    {variant.name} Button
                  </Button>
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{variant.description}</p>
                
                <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono block">
                  variant="{variant.variant}"
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Button Sizes */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Button Sizes</CardTitle>
          <p className="text-slate-600">Rôzne veľkosti buttonov pre rôzne použitia</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {buttonSizes.map((size, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-900">{size.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(size.code)}
                  >
                    {copiedCode === size.code ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="mb-4 flex justify-center">
                  {size.size === 'icon' ? (
                    <Button size={size.size}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size={size.size}>
                      {size.name}
                    </Button>
                  )}
                </div>
                
                <p className="text-sm text-slate-600 mb-3">{size.description}</p>
                
                <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono block">
                  size="{size.size}"
                </code>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Examples */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Common Button Patterns</CardTitle>
          <p className="text-slate-600">Často používané button kompozície a stavy</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {buttonExamples.map((example, index) => (
              <div key={index} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">{example.title}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(example.code)}
                  >
                    {copiedCode === example.code ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="mb-4">
                  {example.component}
                </div>
                
                <pre className="text-xs bg-slate-100 px-3 py-2 rounded font-mono overflow-x-auto">
                  {example.code}
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Button States */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Button States</CardTitle>
          <p className="text-slate-600">Všetky možné stavy buttonov</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <Button className="mb-2">Normal</Button>
              <p className="text-sm text-slate-600">Default state</p>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <Button className="mb-2 hover:bg-primary/90">Hover</Button>
              <p className="text-sm text-slate-600">Hover state</p>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <Button className="mb-2 focus:ring-2 focus:ring-offset-2">Focus</Button>
              <p className="text-sm text-slate-600">Focus state</p>
            </div>
            <div className="text-center p-4 border border-slate-200 rounded-lg">
              <Button disabled className="mb-2">Disabled</Button>
              <p className="text-sm text-slate-600">Disabled state</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ButtonsSection;
