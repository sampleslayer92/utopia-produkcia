
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Monitor, Globe, Smartphone, Zap } from "lucide-react";
import SolutionSelectionCard from "../components/SolutionSelectionCard";
import { useTranslation } from "react-i18next";

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

  const solutionTypes = [
    {
      id: 'terminal',
      title: t('deviceSelection.solutionSelection.solutions.terminal.title'),
      description: t('deviceSelection.solutionSelection.solutions.terminal.description'),
      icon: <CreditCard className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'pos',
      title: t('deviceSelection.solutionSelection.solutions.pos.title'),
      description: t('deviceSelection.solutionSelection.solutions.pos.description'),
      icon: <Monitor className="h-8 w-8 text-green-600" />
    },
    {
      id: 'gateway',
      title: t('deviceSelection.solutionSelection.solutions.gateway.title'),
      description: t('deviceSelection.solutionSelection.solutions.gateway.description'),
      icon: <Globe className="h-8 w-8 text-purple-600" />
    },
    {
      id: 'softpos',
      title: t('deviceSelection.solutionSelection.solutions.softpos.title'),
      description: t('deviceSelection.solutionSelection.solutions.softpos.description'),
      icon: <Smartphone className="h-8 w-8 text-orange-600" />
    },
    {
      id: 'charging',
      title: t('deviceSelection.solutionSelection.solutions.charging.title'),
      description: t('deviceSelection.solutionSelection.solutions.charging.description'),
      icon: <Zap className="h-8 w-8 text-yellow-600" />
    }
  ];

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
          {solutionTypes.map((solution) => (
            <SolutionSelectionCard
              key={solution.id}
              title={solution.title}
              description={solution.description}
              icon={solution.icon}
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
