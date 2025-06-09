
import { useState } from "react";
import { OnboardingData } from "@/types/onboarding";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileCheck, PenTool, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SignaturePad from "./ui/SignaturePad";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface ConsentsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
  onSaveSignature?: () => void;
}

const ConsentsStep = ({ 
  data, 
  updateData, 
  onComplete, 
  onSaveSignature 
}: ConsentsStepProps) => {
  const { t } = useTranslation();
  const isMobile = useIsMobile();
  const [signature, setSignature] = useState(data.consents?.signature || data.consents?.signatureUrl || '');

  const updateConsents = (field: string, value: any) => {
    updateData({
      consents: {
        ...data.consents,
        [field]: value
      }
    });
  };

  const handleSignatureChange = (signatureData: string) => {
    setSignature(signatureData);
    updateConsents('signature', signatureData);
    updateConsents('signatureUrl', signatureData);
  };

  const clearSignature = () => {
    setSignature('');
    updateConsents('signature', '');
    updateConsents('signatureUrl', '');
  };

  const saveSignature = () => {
    if (onSaveSignature) {
      onSaveSignature();
    }
  };

  const isFormValid = () => {
    if (!data.consents) return false;
    
    const consents = data.consents;
    return (
      (consents.dataProcessing === true || consents.gdpr === true) &&
      consents.terms === true &&
      signature.trim() !== ''
    );
  };

  const consentItems = [
    {
      key: 'dataProcessing',
      label: t('onboarding.consents.dataProcessing'),
      required: true
    },
    {
      key: 'terms',
      label: t('onboarding.consents.terms'),
      required: true
    },
    {
      key: 'marketing',
      label: t('onboarding.consents.marketing'),
      required: false
    }
  ];

  const infoTooltipData = {
    description: t('onboarding.consents.title'),
    features: [
      t('onboarding.consents.dataProcessing'),
      t('onboarding.consents.terms'),
      t('onboarding.consents.signature'),
      t('onboarding.navigation.completeRegistration')
    ]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title={t('onboarding.steps.consents.title')}
        icon={<FileCheck className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoTooltipData}
      >
        <div className="space-y-8">
          {/* Consents */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              {t('onboarding.consents.title')}
            </h3>
            
            {consentItems.map((item) => (
              <div key={item.key} className="flex items-start space-x-3">
                <Checkbox
                  id={item.key}
                  checked={Boolean(data.consents?.[item.key as keyof typeof data.consents])}
                  onCheckedChange={(checked) => updateConsents(item.key, checked)}
                  className="mt-1"
                />
                <label htmlFor={item.key} className="text-sm text-slate-700 leading-relaxed">
                  {item.label}
                  {item.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
            ))}
          </div>

          {/* Signature */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <PenTool className="h-5 w-5 text-blue-600" />
                {t('onboarding.consents.signature')}
                <span className="text-red-500">*</span>
              </h3>
              {signature && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveSignature}
                    className="text-blue-600"
                  >
                    {t('onboarding.navigation.saveSignature')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <canvas 
                width={300} 
                height={150} 
                className="border border-gray-200 w-full"
                style={{ touchAction: 'none' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                {t('onboarding.consents.signatureCanvas')}
              </p>
            </div>
            
            {!signature && (
              <p className="text-sm text-red-600">
                {t('onboarding.consents.signatureRequired')}
              </p>
            )}
          </div>

          {/* Complete Button */}
          <div className="pt-6 border-t border-slate-200">
            <Button
              onClick={onComplete}
              disabled={!isFormValid()}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-3"
            >
              {t('onboarding.navigation.completeRegistration')}
            </Button>
          </div>
        </div>
      </MobileOptimizedCard>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <FileCheck className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              {t('onboarding.steps.consents.title')}
            </h2>
            <p className="text-slate-600 mt-1">
              {t('onboarding.steps.consents.subtitle')}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Consents */}
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-blue-600" />
              {t('onboarding.consents.title')}
            </h3>
            
            {consentItems.map((item) => (
              <div key={item.key} className="flex items-start space-x-3 p-4 bg-slate-50 rounded-lg">
                <Checkbox
                  id={item.key}
                  checked={Boolean(data.consents?.[item.key as keyof typeof data.consents])}
                  onCheckedChange={(checked) => updateConsents(item.key, checked)}
                  className="mt-1"
                />
                <label htmlFor={item.key} className="text-sm text-slate-700 leading-relaxed">
                  {item.label}
                  {item.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              </div>
            ))}
          </div>

          {/* Right Column - Signature */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-slate-900 flex items-center gap-2">
                <PenTool className="h-5 w-5 text-blue-600" />
                {t('onboarding.consents.signature')}
                <span className="text-red-500">*</span>
              </h3>
              {signature && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={saveSignature}
                    className="text-blue-600"
                  >
                    {t('onboarding.navigation.saveSignature')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="border border-gray-300 rounded-lg p-4 bg-white">
              <canvas 
                width={400} 
                height={200} 
                className="border border-gray-200 w-full"
                style={{ touchAction: 'none' }}
              />
              <p className="text-sm text-gray-500 mt-2">
                {t('onboarding.consents.signatureCanvas')}
              </p>
            </div>
            
            {!signature && (
              <p className="text-sm text-red-600">
                {t('onboarding.consents.signatureRequired')}
              </p>
            )}
          </div>
        </div>

        {/* Complete Button */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex justify-center">
            <Button
              onClick={onComplete}
              disabled={!isFormValid()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg px-8 py-3"
            >
              {t('onboarding.navigation.completeRegistration')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConsentsStep;
