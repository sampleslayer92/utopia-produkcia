
import { useState } from "react";
import { Store, Trash2, MapPin } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { BusinessLocation, OnboardingData } from "@/types/onboarding";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import AddressForm from "../ui/AddressForm";
import BankAccountsSection from "./BankAccountsSection";
import BusinessDetailsSection from "./BusinessDetailsSection";
import OpeningHoursSummary from "./OpeningHoursSummary";

interface BusinessLocationCardProps {
  location: BusinessLocation;
  index: number;
  data: OnboardingData;
  isExpanded: boolean;
  onToggle: () => void;
  onRemove: () => void;
  onUpdate: (field: string, value: any) => void;
  onBankAccountsUpdate: (accounts: any[]) => void;
  onBusinessDetailsUpdate: (field: string, value: string | number) => void;
  onOpeningHoursEdit: () => void;
}

const BusinessLocationCard = ({
  location,
  index,
  data,
  isExpanded,
  onToggle,
  onRemove,
  onUpdate,
  onBankAccountsUpdate,
  onBusinessDetailsUpdate,
  onOpeningHoursEdit
}: BusinessLocationCardProps) => {
  const seasonalityOptions = [
    { value: "year-round", label: "Celoročne" },
    { value: "seasonal", label: "Sezónne" }
  ];

  const updateContactPerson = (field: string, value: any) => {
    onUpdate(`contactPerson.${field}`, value);
  };

  // Check if address should be hidden (head office equals operating address)
  const shouldHideAddress = data.companyInfo.headOfficeEqualsOperatingAddress;

  return (
    <div className="mb-6 overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
      <div 
        onClick={onToggle}
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
          isExpanded ? 'bg-slate-50 border-b border-slate-200' : ''
        }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
            location.name ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'
          }`}>
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-slate-900">
              {location.name || `Prevádzka ${index + 1}`}
            </h3>
            {location.address.street && (
              <p className="text-xs text-slate-500">{location.address.street}, {location.address.city}</p>
            )}
            {shouldHideAddress && (
              <p className="text-xs text-green-600">
                <MapPin className="h-3 w-3 inline mr-1" />
                Používa adresu sídla spoločnosti
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors mr-2"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="w-6 text-slate-400 transition-transform duration-200 transform">
            {isExpanded ? '▲' : '▼'}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 animate-fade-in">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                <Store className="h-4 w-4" />
                Základné údaje
              </h4>
              
              <div className="grid md:grid-cols-2 gap-4">
                <OnboardingInput
                  label="Názov obchodného miesta *"
                  value={location.name}
                  onChange={(e) => onUpdate('name', e.target.value)}
                  placeholder="Názov predajne/prevádzky"
                />
                
                <div className="flex items-end h-full pb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`hasPOS-${location.id}`}
                      checked={location.hasPOS}
                      onCheckedChange={(checked) => onUpdate('hasPOS', checked)}
                    />
                    <label htmlFor={`hasPOS-${location.id}`} className="text-sm text-slate-700">
                      Je na prevádzke POS?
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Address - only show if not using head office address */}
            {!shouldHideAddress && (
              <div className="border-t border-slate-100 pt-6">
                <AddressForm
                  title="Adresa prevádzky"
                  data={location.address}
                  onUpdate={(field, value) => onUpdate(`address.${field}`, value)}
                />
              </div>
            )}

            {/* Info message when using head office address */}
            {shouldHideAddress && (
              <div className="border-t border-slate-100 pt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Adresa prevádzky</p>
                      <p className="text-sm text-blue-800 mt-1">
                        Táto prevádzka používa adresu sídla spoločnosti. Adresa sa automaticky synchronizuje s hlavnou adresou.
                      </p>
                      <div className="mt-2 text-sm text-blue-700">
                        <p className="font-medium">Aktuálna adresa:</p>
                        <p>{location.address.street}</p>
                        <p>{location.address.zipCode} {location.address.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bank Accounts */}
            <div className="border-t border-slate-100 pt-6">
              <BankAccountsSection
                bankAccounts={location.bankAccounts || []}
                onUpdateBankAccounts={onBankAccountsUpdate}
              />
            </div>

            {/* Business Details */}
            <div className="border-t border-slate-100 pt-6">
              <BusinessDetailsSection
                businessSubject={location.businessSubject || ''}
                mccCode={location.mccCode || ''}
                monthlyTurnover={location.monthlyTurnover || 0}
                onUpdate={onBusinessDetailsUpdate}
              />
            </div>

            {/* Additional Business Information */}
            <div className="border-t border-slate-100 pt-6">
              <div className="grid md:grid-cols-2 gap-4">
                <OnboardingInput
                  label="Priemerná výška transakcie (EUR) *"
                  type="number"
                  value={location.averageTransaction || ''}
                  onChange={(e) => onUpdate('averageTransaction', Number(e.target.value))}
                  placeholder="25"
                />
                
                <OnboardingSelect
                  label="Sezónnosť *"
                  value={location.seasonality}
                  onValueChange={(value) => onUpdate('seasonality', value)}
                  options={seasonalityOptions}
                />
              </div>
              
              {location.seasonality === 'seasonal' && (
                <OnboardingInput
                  label="Počet týždňov v sezóne"
                  type="number"
                  value={location.seasonalWeeks || ''}
                  onChange={(e) => onUpdate('seasonalWeeks', Number(e.target.value))}
                  placeholder="20"
                  min="1"
                  max="52"
                  className="mt-4"
                />
              )}
            </div>

            {/* Opening Hours */}
            <div className="border-t border-slate-100 pt-6">
              <OpeningHoursSummary
                openingHours={location.openingHoursDetailed || []}
                onEdit={onOpeningHoursEdit}
              />
            </div>

            {/* Contact Person - HIDDEN but still saving data in background */}
            {/* This section is intentionally commented out to hide it from the user */}
            {/* The data is still being saved via the updateContactPerson function */}
            {false && (
              <div className="border-t border-slate-100 pt-6">
                <CompanyContactPersonCard
                  data={{
                    ...data,
                    companyInfo: {
                      ...data.companyInfo,
                      contactPerson: {
                        firstName: location.contactPerson.name.split(' ')[0] || '',
                        lastName: location.contactPerson.name.split(' ').slice(1).join(' ') || '',
                        email: location.contactPerson.email,
                        phone: location.contactPerson.phone,
                        isTechnicalPerson: false
                      }
                    }
                  }}
                  updateCompanyInfo={updateContactPerson}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLocationCard;
