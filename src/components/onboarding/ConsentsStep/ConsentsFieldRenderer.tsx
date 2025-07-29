import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import OnboardingInput from '../ui/OnboardingInput';
import OnboardingSelect from '../ui/OnboardingSelect';
import SignaturePad from '../ui/SignaturePad';
import { useTranslation } from 'react-i18next';

interface ConsentsFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
}

export const ConsentsFieldRenderer: React.FC<ConsentsFieldRendererProps> = ({
  data,
  updateData
}) => {
  const updateConsents = (field: string, value: any) => {
    updateData({
      consents: {
        ...data.consents,
        [field]: value
      }
    });
  };

  const onSaveSignature = () => {
    // Auto-save logic can be handled here if needed
    console.log('Signature saved');
  };
  const { step, isStepEnabled, fields } = useStepConfiguration('consents');
  const { t } = useTranslation('forms');

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default consents components
  if (!step || fields.length === 0) {
    const authorizedPersonsOptions = data.authorizedPersons.map(person => ({
      value: person.id,
      label: `${person.firstName} ${person.lastName}`
    }));

    const handleSignatureChange = (url: string) => {
      updateConsents('signatureUrl', url);
      // Automatically call onSaveSignature when signature is created
      if (url && onSaveSignature) {
        onSaveSignature();
      }
    };

    return (
      <div className="space-y-6">
        {/* Consents section */}
        <div className="space-y-4">
          <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="gdpr"
                checked={data.consents.gdpr}
                onCheckedChange={(checked) => updateConsents('gdpr', checked)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="gdpr" className="text-sm font-medium text-slate-900">
                  {t('consents.agreements.gdpr.title')}
                </Label>
                <div className="text-sm text-slate-600">
                  <p>{t('consents.agreements.gdpr.description')}</p>
                  <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                    {t('consents.agreements.gdpr.viewFull')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={data.consents.terms}
                onCheckedChange={(checked) => updateConsents('terms', checked)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="terms" className="text-sm font-medium text-slate-900">
                  {t('consents.agreements.terms.title')}
                </Label>
                <div className="text-sm text-slate-600">
                  <p>{t('consents.agreements.terms.description')}</p>
                  <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                    {t('consents.agreements.terms.viewFull')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="electronicCommunication"
                checked={data.consents.electronicCommunication}
                onCheckedChange={(checked) => updateConsents('electronicCommunication', checked)}
                className="mt-1"
              />
              <div className="space-y-1">
                <Label htmlFor="electronicCommunication" className="text-sm font-medium text-slate-900">
                  {t('consents.agreements.electronicCommunication.title')}
                </Label>
                <div className="text-sm text-slate-600">
                  <p>{t('consents.agreements.electronicCommunication.description')}</p>
                  <p className="text-xs text-blue-600 mt-2 cursor-pointer hover:underline">
                    {t('consents.agreements.electronicCommunication.viewFull')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Signature information */}
        <div className="border-t border-slate-200 pt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <OnboardingInput
              label={t('consents.signature.date')}
              type="date"
              value={data.consents.signatureDate}
              onChange={(e) => updateConsents('signatureDate', e.target.value)}
              error={!data.consents.signatureDate ? t('consents.signature.dateError') : undefined}
            />

            <OnboardingSelect
              label={t('consents.signature.person')}
              value={data.consents.signingPersonId}
              onValueChange={(value) => updateConsents('signingPersonId', value)}
              options={authorizedPersonsOptions}
              placeholder={t('consents.signature.personPlaceholder')}
              error={!data.consents.signingPersonId ? t('consents.signature.personError') : undefined}
            />
          </div>
        </div>

        {/* Electronic Signature */}
        <div className="border-t border-slate-200 pt-6">
          <SignaturePad
            value={data.consents.signatureUrl}
            onSignatureChange={handleSignatureChange}
            disabled={!data.consents.signingPersonId}
          />
        </div>
      </div>
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special consent fields
        if (field.field_key === 'gdpr_consent') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="gdpr"
                      checked={data.consents.gdpr}
                      onCheckedChange={(checked) => updateConsents('gdpr', checked)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="gdpr" className="text-sm font-medium text-slate-900">
                        {t('consents.agreements.gdpr.title')}
                      </Label>
                      <div className="text-sm text-slate-600">
                        <p>{t('consents.agreements.gdpr.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        if (field.field_key === 'terms_consent') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <div className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={data.consents.terms}
                      onCheckedChange={(checked) => updateConsents('terms', checked)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="terms" className="text-sm font-medium text-slate-900">
                        {t('consents.agreements.terms.title')}
                      </Label>
                      <div className="text-sm text-slate-600">
                        <p>{t('consents.agreements.terms.description')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }

        if (field.field_key === 'signature_section') {
          const authorizedPersonsOptions = data.authorizedPersons.map(person => ({
            value: person.id,
            label: `${person.firstName} ${person.lastName}`
          }));

          const handleSignatureChange = (url: string) => {
            updateConsents('signatureUrl', url);
            if (url && onSaveSignature) {
              onSaveSignature();
            }
          };

          return (
            <div key={field.id}>
              {field.is_enabled && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <OnboardingInput
                      label={t('consents.signature.date')}
                      type="date"
                      value={data.consents.signatureDate}
                      onChange={(e) => updateConsents('signatureDate', e.target.value)}
                    />
                    <OnboardingSelect
                      label={t('consents.signature.person')}
                      value={data.consents.signingPersonId}
                      onValueChange={(value) => updateConsents('signingPersonId', value)}
                      options={authorizedPersonsOptions}
                      placeholder={t('consents.signature.personPlaceholder')}
                    />
                  </div>
                  <SignaturePad
                    value={data.consents.signatureUrl}
                    onSignatureChange={handleSignatureChange}
                    disabled={!data.consents.signingPersonId}
                  />
                </div>
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data.consents as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => updateConsents(field.field_key, value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};