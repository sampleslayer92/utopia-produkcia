
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, UserPlus, Building, FileSignature, RefreshCw, AlertTriangle, CheckCheck } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import { getAutoFillSuggestions, findDuplicatePersons, getDataConsistencyIssues } from "../utils/crossStepAutoFill";
import { useCrossStepAutoFill } from "../hooks/useCrossStepAutoFill";

interface AutoFillSuggestionsProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  currentStep: number;
}

const AutoFillSuggestions = ({ data, updateData, currentStep }: AutoFillSuggestionsProps) => {
  const suggestions = getAutoFillSuggestions(data);
  const duplicates = findDuplicatePersons(data);
  const consistencyIssues = getDataConsistencyIssues(data);
  const { 
    autoFillAuthorizedPerson, 
    autoFillActualOwner, 
    autoFillBusinessLocation,
    syncContactData,
    syncAddresses,
    applyAllSuggestions
  } = useCrossStepAutoFill({
    data,
    updateData,
    currentStep
  });

  const allIssues = [...duplicates, ...consistencyIssues];
  const hasBasicSuggestions = suggestions.length > allIssues.length;
  const hasIssues = allIssues.length > 0;

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
    } else if (suggestion.includes('rozdielne údaje')) {
      syncContactData();
    } else if (suggestion.includes('nemá adresu sídla')) {
      syncAddresses();
    }
  };

  const handleIssueAction = (action: string) => {
    switch (action) {
      case 'sync-contact-data':
        syncContactData();
        break;
      case 'sync-business-location-address':
        syncAddresses();
        break;
      case 'add-contact-to-authorized':
        autoFillAuthorizedPerson();
        break;
      default:
        break;
    }
  };

  const getSuggestionIcon = (suggestion: string) => {
    if (suggestion.includes('oprávnených osôb')) {
      return <UserPlus className="h-4 w-4" />;
    } else if (suggestion.includes('skutočného majiteľa')) {
      return <FileSignature className="h-4 w-4" />;
    } else if (suggestion.includes('prevádzku')) {
      return <Building className="h-4 w-4" />;
    } else if (suggestion.includes('rozdielne údaje') || suggestion.includes('nemá adresu')) {
      return <RefreshCw className="h-4 w-4" />;
    }
    return <Lightbulb className="h-4 w-4" />;
  };

  const getCardColor = () => {
    if (hasIssues) {
      return "border-orange-200 bg-orange-50";
    }
    return "border-amber-200 bg-amber-50";
  };

  const getIconColor = () => {
    if (hasIssues) {
      return "bg-orange-100 text-orange-600";
    }
    return "bg-amber-100 text-amber-600";
  };

  const getButtonColor = () => {
    if (hasIssues) {
      return "border-orange-300 text-orange-700 hover:bg-orange-100";
    }
    return "border-amber-300 text-amber-700 hover:bg-amber-100";
  };

  return (
    <Card className={`${getCardColor()} shadow-sm mb-6`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`h-8 w-8 rounded-full ${getIconColor()} flex items-center justify-center flex-shrink-0 mt-0.5`}>
            {hasIssues ? <AlertTriangle className="h-4 w-4" /> : <Lightbulb className="h-4 w-4" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-sm font-medium ${hasIssues ? 'text-orange-900' : 'text-amber-900'}`}>
                {hasIssues ? 'Problémy s údajmi a návrhy' : 'Inteligentné návrhy na vyplnenie'}
              </h3>
              {hasBasicSuggestions && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={applyAllSuggestions}
                  className={`${getButtonColor()} gap-1`}
                >
                  <CheckCheck className="h-3 w-3" />
                  Aplikovať všetko
                </Button>
              )}
            </div>
            <div className="space-y-2">
              {/* Issues first */}
              {allIssues.map((issue, index) => (
                <div key={`issue-${index}`} className="flex items-center justify-between p-2 bg-white rounded border border-orange-200">
                  <div className="flex items-center gap-2 text-sm text-orange-800">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{issue.message}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleIssueAction(issue.action)}
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                  >
                    Opraviť
                  </Button>
                </div>
              ))}
              
              {/* Basic suggestions */}
              {suggestions.filter(suggestion => 
                !allIssues.some(issue => issue.message === suggestion)
              ).map((suggestion, index) => (
                <div key={`suggestion-${index}`} className="flex items-center justify-between p-2 bg-white rounded border border-amber-200">
                  <div className="flex items-center gap-2 text-sm text-amber-800">
                    {getSuggestionIcon(suggestion)}
                    <span>{suggestion}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={getButtonColor()}
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
