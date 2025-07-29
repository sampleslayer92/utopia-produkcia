import React from 'react';
import { useStepConfiguration } from '@/hooks/useOnboardingConfiguration';
import { DynamicFieldRenderer } from '../components/DynamicFieldRenderer';
import { OnboardingData } from '@/types/onboarding';
import EnhancedCompanyBasicInfoCard from '../company/EnhancedCompanyBasicInfoCard';
import CompanyAddressCard from '../company/CompanyAddressCard';
import CompanyContactAddressCard from '../company/CompanyContactAddressCard';
import CompanyContactPersonCard from '../company/CompanyContactPersonCard';
import { useState, useCallback } from 'react';

interface CompanyInfoFieldRendererProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  updateCompanyInfo: (field: string, value: any) => void;
  autoFilledFields: Set<string>;
  setAutoFilledFields: (fields: Set<string>) => void;
  hideContactPerson?: boolean;
}

export const CompanyInfoFieldRenderer: React.FC<CompanyInfoFieldRendererProps> = ({
  data,
  updateData,
  updateCompanyInfo,
  autoFilledFields,
  setAutoFilledFields,
  hideContactPerson = true
}) => {
  const { step, isStepEnabled, fields } = useStepConfiguration('company_info');

  // If configuration is available and step is disabled, render nothing
  if (step && !isStepEnabled) {
    return null;
  }

  // If no configuration available, render default company info components
  if (!step || fields.length === 0) {
    return (
      <div className="space-y-4">
        <EnhancedCompanyBasicInfoCard
          data={data}
          updateCompanyInfo={updateCompanyInfo}
          autoFilledFields={autoFilledFields}
          setAutoFilledFields={setAutoFilledFields}
        />
        
        <CompanyAddressCard
          data={data}
          updateCompanyInfo={updateCompanyInfo}
          autoFilledFields={autoFilledFields}
        />
        
        {!data.companyInfo.contactAddressSameAsMain && (
          <CompanyContactAddressCard
            data={data}
            updateCompanyInfo={updateCompanyInfo}
          />
        )}
        
        {!hideContactPerson && (
          <CompanyContactPersonCard
            data={data}
            updateCompanyInfo={updateCompanyInfo}
          />
        )}
      </div>
    );
  }

  // Render dynamic fields based on configuration
  return (
    <div className="space-y-6">
      {fields.map((field) => {
        // Handle special company forms
        if (field.field_key === 'company_basic_info') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <EnhancedCompanyBasicInfoCard
                  data={data}
                  updateCompanyInfo={updateCompanyInfo}
                  autoFilledFields={autoFilledFields}
                  setAutoFilledFields={setAutoFilledFields}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'company_address') {
          return (
            <div key={field.id}>
              {field.is_enabled && (
                <CompanyAddressCard
                  data={data}
                  updateCompanyInfo={updateCompanyInfo}
                  autoFilledFields={autoFilledFields}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'company_contact_address') {
          return (
            <div key={field.id}>
              {field.is_enabled && !data.companyInfo.contactAddressSameAsMain && (
                <CompanyContactAddressCard
                  data={data}
                  updateCompanyInfo={updateCompanyInfo}
                />
              )}
            </div>
          );
        }

        if (field.field_key === 'company_contact_person') {
          return (
            <div key={field.id}>
              {field.is_enabled && !hideContactPerson && (
                <CompanyContactPersonCard
                  data={data}
                  updateCompanyInfo={updateCompanyInfo}
                />
              )}
            </div>
          );
        }

        // Handle individual dynamic fields
        const fieldValue = (data.companyInfo as any)[field.field_key];
        
        return (
          <div key={field.id}>
            {field.is_enabled && (
              <DynamicFieldRenderer
                field={field}
                value={fieldValue}
                onChange={(value) => updateCompanyInfo(field.field_key, value)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};