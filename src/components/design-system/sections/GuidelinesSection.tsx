
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GuidelinesSectionProps {
  section: string;
}

const GuidelinesSection = ({ section }: GuidelinesSectionProps) => {
  const getSectionTitle = () => {
    switch (section) {
      case 'file-structure':
        return 'File Organization';
      case 'naming-conventions':
        return 'Naming Conventions';
      case 'best-practices':
        return 'Best Practices';
      case 'accessibility':
        return 'Accessibility Guidelines';
      default:
        return 'Developer Guidelines';
    }
  };

  const renderContent = () => {
    switch (section) {
      case 'file-structure':
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Organizácia súborov v projekte:</p>
            <pre className="bg-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
{`src/
├── components/
│   ├── ui/              # Shadcn UI komponenty
│   ├── onboarding/      # Onboarding špecifické komponenty
│   ├── admin/           # Admin rozhranie komponenty
│   └── design-system/   # Design system komponenty
├── pages/               # Route komponenty
├── hooks/               # Custom React hooks
├── types/               # TypeScript definície
├── utils/               # Helper funkcie
└── i18n/                # Internacionalizácia`}
            </pre>
          </div>
        );
      case 'naming-conventions':
        return (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Komponenty</h3>
              <ul className="space-y-1 text-slate-600">
                <li>• PascalCase pre komponenty: <code>OnboardingInput</code></li>
                <li>• camelCase pre hooks: <code>useOnboardingData</code></li>
                <li>• kebab-case pre súbory: <code>onboarding-input.tsx</code></li>
              </ul>
            </div>
          </div>
        );
      default:
        return (
          <p className="text-slate-600">
            Dokumentácia pre {getSectionTitle().toLowerCase()} bude čoskoro dostupná.
          </p>
        );
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{getSectionTitle()}</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Pokyny a best practices pre vývoj v Utopia projekte.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getSectionTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidelinesSection;
