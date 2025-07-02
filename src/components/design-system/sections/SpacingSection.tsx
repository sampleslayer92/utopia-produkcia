import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SpacingSection = () => {
  const spacingSizes = [
    { name: 'px', value: '1px', class: 'px' },
    { name: '0.5', value: '2px', class: '0.5' },
    { name: '1', value: '4px', class: '1' },
    { name: '1.5', value: '6px', class: '1.5' },
    { name: '2', value: '8px', class: '2' },
    { name: '2.5', value: '10px', class: '2.5' },
    { name: '3', value: '12px', class: '3' },
    { name: '3.5', value: '14px', class: '3.5' },
    { name: '4', value: '16px', class: '4' },
    { name: '5', value: '20px', class: '5' },
    { name: '6', value: '24px', class: '6' },
    { name: '7', value: '28px', class: '7' },
    { name: '8', value: '32px', class: '8' },
    { name: '9', value: '36px', class: '9' },
    { name: '10', value: '40px', class: '10' },
    { name: '11', value: '44px', class: '11' },
    { name: '12', value: '48px', class: '12' },
    { name: '14', value: '56px', class: '14' },
    { name: '16', value: '64px', class: '16' },
    { name: '20', value: '80px', class: '20' },
    { name: '24', value: '96px', class: '24' },
    { name: '28', value: '112px', class: '28' },
    { name: '32', value: '128px', class: '32' },
  ];

  const spacingTypes = [
    { name: 'Margin', prefix: 'm', description: 'Vonkajší odstup' },
    { name: 'Padding', prefix: 'p', description: 'Vnútorný odstup' },
    { name: 'Gap', prefix: 'gap', description: 'Medzera v Grid/Flexbox' },
    { name: 'Space', prefix: 'space', description: 'Medzera medzi prvkami' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Spacing System</h1>
        <p className="text-slate-600 mb-6">
          Konzistentný systém odstupov založený na 4px grid systéme.
        </p>
      </div>

      {/* Spacing Scale */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spacingSizes.map((spacing) => (
              <div key={spacing.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div 
                    className="bg-blue-500 rounded"
                    style={{ width: spacing.value, height: spacing.value }}
                  />
                  <div>
                    <div className="font-medium text-slate-900">{spacing.name}</div>
                    <div className="text-sm text-slate-600">{spacing.value}</div>
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {spacing.class}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spacing Types */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spacingTypes.map((type) => (
              <div key={type.name} className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900">{type.name}</h3>
                  <p className="text-sm text-slate-600">{type.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="bg-slate-50 p-3 rounded border font-mono text-sm">
                    <div className="text-slate-600 mb-1">Všetky strany:</div>
                    <code className="text-blue-600">{type.prefix}-4</code>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded border font-mono text-sm">
                    <div className="text-slate-600 mb-1">Horizontálne/Vertikálne:</div>
                    <div className="space-x-2">
                      <code className="text-blue-600">{type.prefix}x-4</code>
                      <code className="text-blue-600">{type.prefix}y-4</code>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-3 rounded border font-mono text-sm">
                    <div className="text-slate-600 mb-1">Jednotlivé strany:</div>
                    <div className="grid grid-cols-2 gap-1">
                      <code className="text-blue-600">{type.prefix}t-4</code>
                      <code className="text-blue-600">{type.prefix}r-4</code>
                      <code className="text-blue-600">{type.prefix}b-4</code>
                      <code className="text-blue-600">{type.prefix}l-4</code>
                    </div>
                  </div>
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
          <div className="space-y-6">
            {/* Card Spacing */}
            <div>
              <h3 className="font-semibold mb-3">Card Spacing</h3>
              <div className="bg-white border rounded-lg p-6 space-y-4">
                <div className="font-medium">Card Header</div>
                <div className="text-sm text-slate-600">
                  Card s štandardným padding-om p-6 (24px)
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm">Footer sekcia s pt-4 (16px)</div>
                </div>
              </div>
              <code className="text-xs text-slate-600 mt-2 block">p-6 pt-4</code>
            </div>

            {/* Button Spacing */}
            <div>
              <h3 className="font-semibold mb-3">Button Spacing</h3>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  Primary
                </button>
                <button className="px-4 py-2 border border-slate-300 rounded hover:bg-slate-50">
                  Secondary
                </button>
              </div>
              <code className="text-xs text-slate-600 mt-2 block">px-4 py-2, space-x-3</code>
            </div>

            {/* Form Spacing */}
            <div>
              <h3 className="font-semibold mb-3">Form Spacing</h3>
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-3 py-2 border rounded-md" 
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Heslo</label>
                  <input 
                    type="password" 
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              </div>
              <code className="text-xs text-slate-600 mt-2 block">space-y-4, mb-2, px-3 py-2</code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SpacingSection;