
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Monitor, Globe, Smartphone, Zap } from "lucide-react";
import SolutionSelectionCard from "../components/SolutionSelectionCard";

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
  const solutionTypes = [
    {
      id: 'terminal',
      title: 'Platobný terminál',
      description: 'Klasické platobné terminály pre prijímanie kariet',
      icon: <CreditCard className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'pos',
      title: 'Pokladničné riešenie',
      description: 'Komplexné POS systémy s tabletmi',
      icon: <Monitor className="h-8 w-8 text-green-600" />
    },
    {
      id: 'gateway',
      title: 'Platobná brána',
      description: 'Online platby pre e-commerce',
      icon: <Globe className="h-8 w-8 text-purple-600" />
    },
    {
      id: 'softpos',
      title: 'Terminál v mobile (SoftPOS)',
      description: 'Mobilné aplikácie pre platby',
      icon: <Smartphone className="h-8 w-8 text-orange-600" />
    },
    {
      id: 'charging',
      title: 'Nabíjacia stanica',
      description: 'Riešenia pre elektromobily',
      icon: <Zap className="h-8 w-8 text-yellow-600" />
    }
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-slate-900">Výber riešenia</CardTitle>
        <CardDescription className="text-slate-600 text-lg">
          Vyberte typy riešení, ktoré chcete používať vo vašom podnikaní
        </CardDescription>
        <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
          <div className="bg-blue-600 h-2 rounded-full w-1/4"></div>
        </div>
        <p className="text-sm text-slate-500 mt-2">Krok 1 z 4</p>
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
                Vybrané riešenia: {selectedSolutions.length}
              </p>
              <p className="text-blue-600 text-sm">
                Pokračujte na konfiguráciu zariadení a služieb
              </p>
            </div>
            <button 
              onClick={onNext}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              Ďalší krok - Výber zariadení a služieb
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SolutionSelectionSection;
