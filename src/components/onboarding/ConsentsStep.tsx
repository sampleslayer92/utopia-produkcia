
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, Shield, AlertTriangle } from "lucide-react";
import { OnboardingData } from "@/types/onboarding";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConsentsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ConsentsStep = ({ data, updateData }: ConsentsStepProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const updateConsent = (consentType: string, value: boolean) => {
    updateData({
      consents: {
        ...data.consents,
        [consentType]: value
      }
    });
  };

  const allRequiredConsentsGiven = Boolean(
    data.consents?.dataProcessing && 
    data.consents?.termsAndConditions
  );

  const consentItems = [
    {
      id: 'dataProcessing',
      title: t('steps.consents.dataProcessing.title'),
      description: t('steps.consents.dataProcessing.description'),
      required: true,
      checked: data.consents?.dataProcessing || false,
      icon: <Shield className="h-5 w-5 text-blue-600" />
    },
    {
      id: 'termsAndConditions',
      title: t('steps.consents.terms.title'),
      description: t('steps.consents.terms.description'),
      required: true,
      checked: data.consents?.termsAndConditions || false,
      icon: <CheckCircle className="h-5 w-5 text-green-600" />
    },
    {
      id: 'marketing',
      title: t('steps.consents.marketing.title'),
      description: t('steps.consents.marketing.description'),
      required: false,
      checked: data.consents?.marketing || false,
      icon: <AlertTriangle className="h-5 w-5 text-orange-600" />
    }
  ];

  const infoTooltipData = {
    description: t('steps.consents.description'),
    features: []
  };

  const content = (
    <div className="space-y-6">
      {!allRequiredConsentsGiven && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-sm text-amber-800">
              {t('steps.consents.dataProcessing.required')} - {t('steps.consents.terms.required')}
            </p>
          </div>
        </div>
      )}

      {consentItems.map((item) => (
        <Card key={item.id} className="border-slate-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-slate-900 mb-2">
                      {item.title}
                      {item.required && <span className="text-red-500 ml-1">*</span>}
                    </h3>
                    <p className="text-sm text-slate-600 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      {item.required ? (
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                          {t('steps.consents.dataProcessing.required')}
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded">
                          {t('steps.consents.marketing.optional')}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <Checkbox
                      id={item.id}
                      checked={item.checked}
                      onCheckedChange={(checked) => updateConsent(item.id, Boolean(checked))}
                      className="h-5 w-5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {allRequiredConsentsGiven && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-800">
              {t('onboarding.common.continue')} - {t('steps.consents.description')}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('steps.consents.title')}
        icon={<CheckCircle className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        {content}
      </MobileOptimizedCard>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl text-slate-900 flex items-center gap-3">
          <CheckCircle className="h-6 w-6 text-blue-600" />
          {t('steps.consents.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};

export default ConsentsStep;
