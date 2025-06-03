
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

interface SolutionSelectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const SolutionSelectionCard = ({ 
  title, 
  description, 
  icon, 
  isSelected, 
  onClick 
}: SolutionSelectionCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:scale-105 border-2 ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-lg' 
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center relative">
        {isSelected && (
          <div className="absolute top-3 right-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
        <div className="mb-4 flex justify-center">
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default SolutionSelectionCard;
