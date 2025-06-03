
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BusinessLocation } from "@/types/onboarding";
import { Store, MapPin, Phone, CreditCard, Building, Clock, Save, X, Trash2 } from "lucide-react";
import OnboardingInput from "../ui/OnboardingInput";
import OnboardingSelect from "../ui/OnboardingSelect";
import OnboardingTextarea from "../ui/OnboardingTextarea";

interface BusinessLocationFormProps {
  location: BusinessLocation;
  isEditing: boolean;
  isNew: boolean;
  onSave: () => void;
  onCancel: () => void;
  onDelete: (locationId: string) => void;
  onFieldChange: (field: string, value: any) => void;
}

const BusinessLocationForm = ({
  location,
  isEditing,
  isNew,
  onSave,
  onCancel,
  onDelete,
  onFieldChange
}: BusinessLocationFormProps) => {
  const seasonalityOptions = [
    { value: "year-round", label: "Celoročne" },
    { value: "seasonal", label: "Sezónne" }
  ];

  if (!isEditing) return null;

  return (
    <div>
      <h4 className="text-md font-medium text-slate-900 mb-4">
        {isNew ? 'Nová prevádzka' : 'Upraviť prevádzku'}
      </h4>
      
      <div className="space-y-6 bg-slate-50 p-6 rounded-lg">
        <div className="grid md:grid-cols-2 gap-6">
          <OnboardingInput
            label="Názov obchodného miesta *"
            value={location.name}
            onChange={(e) => onFieldChange('name', e.target.value)}
            placeholder="Názov predajne/prevádzky"
            icon={<Store className="h-4 w-4" />}
          />
          
          <div className="flex items-end h-full pb-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`hasPOS-${location.id}`}
                checked={location.hasPOS}
                onCheckedChange={(checked) => onFieldChange('hasPOS', checked)}
              />
              <label htmlFor={`hasPOS-${location.id}`} className="text-sm text-slate-700">
                Je na prevádzke POS?
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-md font-medium text-slate-900 mb-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" /> 
            Adresa prevádzky
          </h4>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <OnboardingInput
                label="Ulica a číslo *"
                value={location.address.street}
                onChange={(e) => onFieldChange('address.street', e.target.value)}
                placeholder="Obchodná ulica 456"
              />
            </div>
            
            <OnboardingInput
              label="PSČ *"
              value={location.address.zipCode}
              onChange={(e) => onFieldChange('address.zipCode', e.target.value)}
              placeholder="01001"
            />
          </div>
          
          <OnboardingInput
            label="Mesto *"
            value={location.address.city}
            onChange={(e) => onFieldChange('address.city', e.target.value)}
            placeholder="Bratislava"
          />
        </div>

        <OnboardingInput
          label="IBAN *"
          value={location.iban}
          onChange={(e) => onFieldChange('iban', e.target.value)}
          placeholder="SK89 1200 0000 1987 4263 7541"
          icon={<CreditCard className="h-4 w-4" />}
        />

        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-md font-medium text-slate-900 mb-4 flex items-center gap-2">
            <Phone className="h-4 w-4 text-green-600" />
            Kontaktná osoba pre prevádzku
          </h4>
          
          <div className="grid md:grid-cols-3 gap-6">
            <OnboardingInput
              label="Meno a priezvisko *"
              value={location.contactPerson.name}
              onChange={(e) => onFieldChange('contactPerson.name', e.target.value)}
              placeholder="Mária Kováčová"
            />
            
            <OnboardingInput
              label="Email *"
              type="email"
              value={location.contactPerson.email}
              onChange={(e) => onFieldChange('contactPerson.email', e.target.value)}
              placeholder="maria.kovacova@prevadzka.sk"
            />
            
            <OnboardingInput
              label="Telefón *"
              value={location.contactPerson.phone}
              onChange={(e) => onFieldChange('contactPerson.phone', e.target.value)}
              placeholder="+421 987 654 321"
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-md font-medium text-slate-900 mb-4 flex items-center gap-2">
            <Building className="h-4 w-4 text-green-600" />
            Údaje o podnikaní
          </h4>
          
          <div className="grid md:grid-cols-2 gap-6">
            <OnboardingInput
              label="Odbor podnikania / MCC *"
              value={location.businessSector}
              onChange={(e) => onFieldChange('businessSector', e.target.value)}
              placeholder="Maloobchod, reštaurácie, služby..."
            />
            
            <OnboardingInput
              label="Odhadovaný obrat (EUR) *"
              type="number"
              value={location.estimatedTurnover || ''}
              onChange={(e) => onFieldChange('estimatedTurnover', Number(e.target.value))}
              placeholder="50000"
            />
          </div>

          <OnboardingInput
            label="Priemerná výška transakcie (EUR) *"
            type="number"
            value={location.averageTransaction || ''}
            onChange={(e) => onFieldChange('averageTransaction', Number(e.target.value))}
            placeholder="25"
          />
        </div>

        <div className="border-t border-slate-200 pt-6">
          <h4 className="text-md font-medium text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-600" />
            Prevádzkové informácie
          </h4>
          
          <OnboardingTextarea
            label="Otváracie hodiny *"
            value={location.openingHours}
            onChange={(e) => onFieldChange('openingHours', e.target.value)}
            placeholder="Po-Pia: 9:00-18:00, So: 9:00-14:00, Ne: zatvorené"
            rows={3}
          />

          <div className="mt-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <OnboardingSelect
                label="Sezónnosť *"
                value={location.seasonality}
                onValueChange={(value) => onFieldChange('seasonality', value)}
                options={seasonalityOptions}
              />
              
              {location.seasonality === 'seasonal' && (
                <OnboardingInput
                  label="Počet týždňov v sezóne"
                  type="number"
                  value={location.seasonalWeeks || ''}
                  onChange={(e) => onFieldChange('seasonalWeeks', Number(e.target.value))}
                  placeholder="20"
                  min="1"
                  max="52"
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-slate-200">
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Uložiť prevádzku
          </Button>
          <Button onClick={onCancel} variant="outline" className="flex items-center gap-2">
            <X className="h-4 w-4" />
            Zrušiť
          </Button>
          {!isNew && (
            <Button 
              onClick={() => onDelete(location.id)} 
              variant="outline" 
              className="text-red-600 hover:text-red-700 flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Zmazať
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessLocationForm;
