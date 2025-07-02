import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ShadowsSection = () => {
  const shadows = [
    {
      name: 'shadow-sm',
      description: 'Jemný tieň pre subtílne zvýraznenie',
      value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      usage: 'Input fields, malé cards'
    },
    {
      name: 'shadow',
      description: 'Štandardný tieň pre základné komponenty',
      value: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
      usage: 'Buttons, cards, tooltips'
    },
    {
      name: 'shadow-md',
      description: 'Stredný tieň pre zvýraznené komponenty',
      value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      usage: 'Dropdown menus, popovers'
    },
    {
      name: 'shadow-lg',
      description: 'Veľký tieň pre floating prvky',
      value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      usage: 'Modals, large cards, sidebars'
    },
    {
      name: 'shadow-xl',
      description: 'Extra veľký tieň pre overlay prvky',
      value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      usage: 'Modal overlays, floating panels'
    },
    {
      name: 'shadow-2xl',
      description: 'Maximálny tieň pre najvyššie prvky',
      value: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      usage: 'Hero sections, landing headers'
    },
    {
      name: 'shadow-inner',
      description: 'Vnútorný tieň pre depressed look',
      value: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      usage: 'Input fields (focus), inset buttons'
    },
    {
      name: 'shadow-none',
      description: 'Bez tieňa',
      value: '0 0 #0000',
      usage: 'Reset tieňov, flat design'
    }
  ];

  const customShadows = [
    {
      name: 'shadow-elegant',
      description: 'Elegantný tieň s primárnou farbou',
      value: '0 10px 30px -10px hsl(var(--primary) / 0.3)',
      usage: 'Premium cards, highlights'
    },
    {
      name: 'shadow-glow',
      description: 'Svetelný efekt pre interaktívne prvky',
      value: '0 0 40px hsl(var(--primary-glow) / 0.4)',
      usage: 'Hover states, focus states'
    },
    {
      name: 'shadow-soft',
      description: 'Mäkký tieň pre jemné komponenty',
      value: '0 2px 15px 0 rgb(0 0 0 / 0.08)',
      usage: 'Onboarding cards, soft UI'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Shadow System</h1>
        <p className="text-slate-600 mb-6">
          Konzistentný systém tieňov pre vytvorenie vizuálnej hierarchie a hĺbky.
        </p>
      </div>

      {/* Default Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>Tailwind Shadow Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {shadows.map((shadow) => (
              <div key={shadow.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{shadow.name}</h3>
                  <Badge variant="outline" className="font-mono text-xs">
                    {shadow.name}
                  </Badge>
                </div>
                
                <div 
                  className={`bg-white p-6 rounded-lg border ${shadow.name}`}
                  style={{ minHeight: '80px' }}
                >
                  <div className="text-sm font-medium text-slate-900 mb-1">
                    Preview
                  </div>
                  <div className="text-xs text-slate-600">
                    {shadow.description}
                  </div>
                </div>
                
                <div className="text-xs text-slate-600">
                  <div className="font-medium mb-1">Použitie:</div>
                  <div>{shadow.usage}</div>
                </div>
                
                <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-700 break-all">
                  {shadow.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Project Shadows</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customShadows.map((shadow) => (
              <div key={shadow.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900">{shadow.name}</h3>
                  <Badge variant="outline" className="font-mono text-xs bg-blue-50 text-blue-700">
                    Custom
                  </Badge>
                </div>
                
                <div 
                  className="bg-white p-6 rounded-lg border"
                  style={{ 
                    boxShadow: shadow.value,
                    minHeight: '80px'
                  }}
                >
                  <div className="text-sm font-medium text-slate-900 mb-1">
                    Preview
                  </div>
                  <div className="text-xs text-slate-600">
                    {shadow.description}
                  </div>
                </div>
                
                <div className="text-xs text-slate-600">
                  <div className="font-medium mb-1">Použitie:</div>
                  <div>{shadow.usage}</div>
                </div>
                
                <div className="bg-slate-50 p-2 rounded text-xs font-mono text-slate-700 break-all">
                  {shadow.value}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Praktické príklady</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Card Hierarchy */}
            <div>
              <h3 className="font-semibold mb-4">Card Hierarchy</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border">
                  <div className="font-medium mb-2">Base Card</div>
                  <div className="text-sm text-slate-600">shadow-sm</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <div className="font-medium mb-2">Elevated Card</div>
                  <div className="text-sm text-slate-600">shadow-md</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <div className="font-medium mb-2">Floating Card</div>
                  <div className="text-sm text-slate-600">shadow-lg</div>
                </div>
              </div>
            </div>

            {/* Interactive States */}
            <div>
              <h3 className="font-semibold mb-4">Interactive States</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border">
                  <div className="font-medium mb-2">Hover Effect</div>
                  <div className="text-sm text-slate-600">shadow → shadow-md on hover</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-shadow cursor-pointer" tabIndex={0}>
                  <div className="font-medium mb-2">Focus Effect</div>
                  <div className="text-sm text-slate-600">shadow-md → shadow-lg + ring on focus</div>
                </div>
              </div>
            </div>

            {/* Custom Implementations */}
            <div>
              <h3 className="font-semibold mb-4">Custom Shadow Implementations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                  className="bg-white p-6 rounded-xl"
                  style={{ boxShadow: '0 10px 30px -10px hsl(var(--primary) / 0.3)' }}
                >
                  <div className="font-medium mb-2 text-blue-700">Premium Card</div>
                  <div className="text-sm text-slate-600">
                    Custom elegant shadow s primárnou farbou
                  </div>
                </div>
                
                <div 
                  className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border"
                  style={{ boxShadow: '0 0 40px hsl(220 100% 50% / 0.15)' }}
                >
                  <div className="font-medium mb-2 text-indigo-700">Glow Effect</div>
                  <div className="text-sm text-slate-600">
                    Svetelný efekt pre špeciálne zvýraznenie
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-800 mb-2">✨ Best Practices</h4>
              <ul className="space-y-1 text-sm text-amber-700">
                <li>• Používaj tienê konzistentne podľa hierarchie</li>
                <li>• Kombinuj s transition-shadow pre smooth animácie</li>
                <li>• Custom shadows definuj v tailwind.config.ts</li>
                <li>• Testuj tienê v dark mode</li>
              </ul>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">CSS Custom Properties</h4>
              <pre className="text-xs font-mono text-slate-700 overflow-x-auto">
{`// tailwind.config.ts
boxShadow: {
  'elegant': '0 10px 30px -10px hsl(var(--primary) / 0.3)',
  'glow': '0 0 40px hsl(var(--primary-glow) / 0.4)',
  'soft': '0 2px 15px 0 rgb(0 0 0 / 0.08)'
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShadowsSection;