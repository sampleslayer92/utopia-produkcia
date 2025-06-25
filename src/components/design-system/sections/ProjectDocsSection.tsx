
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectDocsSectionProps {
  section: string;
}

const ProjectDocsSection = ({ section }: ProjectDocsSectionProps) => {
  const getSectionTitle = () => {
    switch (section) {
      case 'onboarding-flow':
        return 'Onboarding Flow Documentation';
      case 'database-schema':
        return 'Database Schema';
      case 'api-endpoints':
        return 'API Endpoints';
      case 'i18n-setup':
        return 'Internationalization Setup';
      default:
        return 'Project Documentation';
    }
  };

  const renderContent = () => {
    switch (section) {
      case 'onboarding-flow':
        return (
          <div className="space-y-6">
            <p className="text-slate-600">7-krokový onboarding proces:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Kontaktné informácie',
                'Informácie o spoločnosti', 
                'Obchodné miesta',
                'Výber zariadení a služieb',
                'Oprávnené osoby',
                'Skutočný vlastník',
                'Poplatky a súhlas'
              ].map((step, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <span className="font-medium">{step}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      case 'database-schema':
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Hlavné databázové tabuľky:</p>
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">contracts</h4>
                <p className="text-sm text-slate-600">Hlavná tabuľka so zmluvami a ich stavom</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">business_locations</h4>
                <p className="text-sm text-slate-600">Obchodné miesta merchantov</p>
              </div>
              <div className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">authorized_persons</h4>
                <p className="text-sm text-slate-600">Oprávnené osoby pre zmluvy</p>
              </div>
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
          Detailná dokumentácia projektových špecifikácií a architektúry.
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

export default ProjectDocsSection;
