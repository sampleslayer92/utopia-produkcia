
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminComponentsSectionProps {
  section: string;
}

const AdminComponentsSection = ({ section }: AdminComponentsSectionProps) => {
  const getSectionTitle = () => {
    switch (section) {
      case 'admin-layout':
        return 'Admin Layout Components';
      case 'admin-tables':
        return 'Admin Data Tables';
      default:
        return 'Admin Components';
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{getSectionTitle()}</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Komponenty špecifické pre admin rozhranie s pokročilými funkčnosťami.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            Dokumentácia pre {getSectionTitle().toLowerCase()} bude čoskoro dostupná.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminComponentsSection;
