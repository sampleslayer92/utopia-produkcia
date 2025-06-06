
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, UserPlus, Building, FileSignature } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { getAutoFillSuggestions } from "../utils/crossStepAutoFill";
import { useCrossStepAutoFill } from "../hooks/useCrossStepAutoFill";

interface AutoFillSuggestionsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  currentStep: number;
}

const AutoFillSuggestions = ({ data, updateData, currentStep }: AutoFillSuggestionsProps) => {
  const suggestions = getAutoFillSuggestions(data);
  const { autoFillAuthorizedPerson, autoFillActualOwner, autoFillBusinessLocation } = useCrossStepAutoFill({
    data,
    updateData,
    currentStep
  });

  if (suggestions.length === 0) {
    return null;
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes('oprávnených osôb')) {
      autoFillAuthorizedPerson();
    } else if (suggestion.includes('skutočného majiteľa')) {
      autoFillActualOwner();
    } else if (suggestion.includes('prevádzku')) {
      autoFillBusinessLocation();
    }
  };

  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.includes('oprávnených osôb')) {
      return <UserPlus className="h-4 w-4" />;
    } else if (suggestion.includes('skutočného majiteľa')) {
      return <FileSignature className="h-4 w-4" />;
    } else if (suggestion.includes('prevádzku')) {
      return <Building className="h-4 w-4" />;
    }
    return <Lightbulb className="h-4 w-4" />;
  };

  return (
    <Card className="border-amber-200 bg-amber-50 shadow-sm mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb className="h-4 w-4 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-900 mb-2">
              Inteligentné návrhy na vyplnenie
            </h3>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border border-amber-200">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    {getSuggestionIcon(suggestion)}
                    <span>{suggestion}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Aplikovať
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoFillSuggestions;
