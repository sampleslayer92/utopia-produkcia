
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, User, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

interface AutoFillFromContactButtonProps {
  contactName: string;
  contactEmail: string;
  onAutoFill: () => void;
  canAutoFill: boolean;
  alreadyExists: boolean;
  stepType: 'authorized' | 'actual-owner';
  className?: string;
}

const AutoFillFromContactButton = ({
  contactName,
  contactEmail,
  onAutoFill,
  canAutoFill,
  alreadyExists,
  stepType,
  className = ""
}: AutoFillFromContactButtonProps) => {
  const { t } = useTranslation(['steps', 'forms', 'common']);

  const stepTypeKey = stepType === 'authorized' ? 'authorizedPersons' : 'actualOwners';

  // Debug logging
  console.log('AutoFillFromContactButton data:', { contactName, contactEmail, stepType, stepTypeKey });

  if (!canAutoFill) {
    return null;
  }

  if (alreadyExists) {
    // Try interpolation with explicit options
    const existsText = t(`steps:${stepTypeKey}.autoFill.exists`, { 
      name: contactName, 
      email: contactEmail 
    });
    
    // Fallback: manual replacement if i18next interpolation fails
    const fallbackText = existsText.includes('{name}') || existsText.includes('{email}') 
      ? existsText.replace('{name}', contactName).replace('{email}', contactEmail)
      : existsText;

    console.log('Exists text:', { original: existsText, fallback: fallbackText });

    return (
      <Card className={`border-green-200 bg-green-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-sm text-green-800">
                {fallbackText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Try interpolation with explicit options
  const questionText = t(`steps:${stepTypeKey}.autoFill.question`, { 
    name: contactName, 
    email: contactEmail 
  });
  
  // Fallback: manual replacement if i18next interpolation fails
  const fallbackQuestionText = questionText.includes('{name}') || questionText.includes('{email}') 
    ? questionText.replace('{name}', contactName).replace('{email}', contactEmail)
    : questionText;

  console.log('Question text:', { original: questionText, fallback: fallbackQuestionText });

  return (
    <Card className={`border-blue-200 bg-blue-50 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <User className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm text-blue-800 mb-2">
              {fallbackQuestionText}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onAutoFill}
              className="border-blue-300 text-blue-700 hover:bg-blue-100"
            >
              <Copy className="h-4 w-4 mr-2" />
              {t(`steps:${stepTypeKey}.autoFill.button`)}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoFillFromContactButton;
