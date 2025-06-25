
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface OnboardingComponentsSectionProps {
  section: string;
}

const OnboardingComponentsSection = ({ section }: OnboardingComponentsSectionProps) => {
  const getSectionTitle = () => {
    switch (section) {
      case 'onboarding-inputs':
        return 'Onboarding Input Components';
      case 'step-components':
        return 'Step Navigation Components';
      case 'product-cards':
        return 'Product Selection Cards';
      default:
        return 'Onboarding Components';
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{getSectionTitle()}</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Špecializované komponenty pre onboarding proces s vlastnými štýlmi a funkčnosťou.
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

export default OnboardingComponentsSection;
