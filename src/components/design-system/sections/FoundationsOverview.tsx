
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Type, Spacing, Zap, Layers } from 'lucide-react';

const FoundationsOverview = () => {
  const foundations = [
    {
      icon: Palette,
      title: 'Colors',
      description: 'Farebná paleta s primary, secondary, muted a ostatnými farbami',
      items: ['Primary Blue', 'Secondary Gray', 'Success Green', 'Warning Orange', 'Destructive Red']
    },
    {
      icon: Type,
      title: 'Typography',
      description: 'Typografické štýly pre nadpisy, texty a labels',
      items: ['Headings (h1-h6)', 'Body Text', 'Labels', 'Captions', 'Code']
    },
    {
      icon: Spacing,
      title: 'Spacing',
      description: 'Konzistentný spacing systém pre margins a paddings',
      items: ['4px grid system', 'Component spacing', 'Layout margins', 'Section gaps']
    },
    {
      icon: Layers,
      title: 'Shadows & Elevation',
      description: 'Shadow systém pre depth a elevation',
      items: ['Card shadows', 'Modal overlays', 'Dropdown shadows', 'Focus states']
    },
    {
      icon: Zap,
      title: 'Animations',
      description: 'Smooth transitions a micro-interactions',
      items: ['Fade animations', 'Scale effects', 'Slide transitions', 'Hover states', 'Loading states']
    }
  ];

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Design Foundations
        </h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Základné dizajnové prvky, ktoré definují vizuálny jazyk celého Utopia projektu. 
          Tieto foundations zabezpečujú konzistentnosť a jednotnosť naprieč všetkými komponentmi a stránkami.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foundations.map((foundation, index) => {
          const Icon = foundation.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{foundation.title}</CardTitle>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {foundation.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {foundation.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm text-slate-700">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Ako používať Design System
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Pre vývojárov</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                <span>Používajte pripravené komponenty namiesto custom riešení</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                <span>Dodržiavajte Tailwind classes definované v systéme</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2" />
                <span>Testujte komponenty pre všetky stavy (hover, focus, disabled)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Pre dizajnérov</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <span>Používajte iba farby a spacing definované v systéme</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <span>Navrhujte s ohľadom na responsive design</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2" />
                <span>Zachovávajte konzistentnosť v UX patterns</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoundationsOverview;
