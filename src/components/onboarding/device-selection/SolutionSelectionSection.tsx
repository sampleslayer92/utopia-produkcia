
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Monitor, Globe, Smartphone, Zap, icons } from "lucide-react";
import SolutionSelectionCard from "../components/SolutionSelectionCard";
import { useTranslation } from "react-i18next";
import { useSolutions } from '@/hooks/useSolutions';
import LoadingSpinner from '@/components/ui/loading-spinner';

interface SolutionSelectionSectionProps {
  selectedSolutions: string[];
  onToggleSolution: (solutionId: string) => void;
  onNext: () => void;
}

const SolutionSelectionSection = ({ 
  selectedSolutions, 
  onToggleSolution, 
  onNext 
}: SolutionSelectionSectionProps) => {
  const { t } = useTranslation('forms');
  const { data: solutions, isLoading } = useSolutions(true); // Only active solutions

  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return (
        <img 
          src={iconUrl} 
          alt="Solution icon" 
          className="h-8 w-8 object-contain"
        />
      );
    }

    if (iconName && icons[iconName as keyof typeof icons]) {
      const IconComponent = icons[iconName as keyof typeof icons];
      return <IconComponent className="h-8 w-8" style={{ color }} />;
    }

    // Fallback icon
    return <CreditCard className="h-8 w-8" style={{ color }} />;
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardContent className="py-8">
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-slate-900">
          {t('deviceSelection.solutionSelection.title')}
        </CardTitle>
        <CardDescription className="text-slate-600 text-lg">
          {t('deviceSelection.solutionSelection.description')}
        </CardDescription>
        <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
          <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
        </div>
        <p className="text-sm text-slate-500 mt-2">
          {t('deviceSelection.solutionSelection.stepProgress')}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {solutions?.map((solution) => (
            <SolutionSelectionCard
              key={solution.id}
              title={solution.name}
              description={solution.description || solution.subtitle || ''}
              icon={renderIcon(solution.icon_name, solution.icon_url, solution.color)}
              isSelected={selectedSolutions.includes(solution.id)}
              onClick={() => onToggleSolution(solution.id)}
            />
          ))}
        </div>
        
        {selectedSolutions.length > 0 && (
          <div className="text-center space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium">
                {t('deviceSelection.solutionSelection.selectedSolutions', { count: selectedSolutions.length })}
              </p>
              <p className="text-blue-600 text-sm">
                {t('deviceSelection.solutionSelection.continueMessage')}
              </p>
            </div>
            <button 
              onClick={onNext}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              {t('deviceSelection.solutionSelection.nextButton')}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolutionSelectionSection;
