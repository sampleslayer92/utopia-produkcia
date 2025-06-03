import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingData, BusinessLocation } from "@/types/onboarding";
import { useState } from "react";
import { Store, MapPin, Phone, CreditCard, Building, Clock, Calendar, Plus, Edit, Trash2, Save, X } from "lucide-react";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingTextarea from "./ui/OnboardingTextarea";
import OnboardingSection from "./ui/OnboardingSection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [tempLocation, setTempLocation] = useState<BusinessLocation | null>(null);

  const createNewLocation = (): BusinessLocation => ({
    id: Date.now().toString(),
    name: '',
    hasPOS: false,
    address: { street: '', city: '', zipCode: '' },
    iban: '',
    contactPerson: { name: '', email: '', phone: '' },
    businessSector: '',
    estimatedTurnover: 0,
    averageTransaction: 0,
    openingHours: '',
    seasonality: 'year-round',
    assignedPersons: []
  });

  const updateTempLocation = (field: string, value: any) => {
    if (!tempLocation) return;

    setTempLocation(prev => {
      if (!prev) return null;
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prev,
          [parent]: {
            ...(prev[parent as keyof BusinessLocation] as any),
            [child]: value
          }
        };
      } else {
        return {
          ...prev,
          [field]: value
        };
      }
    });
  };

  const addNewLocation = () => {
    const newLocation = createNewLocation();
    setTempLocation(newLocation);
    setEditingLocationId(newLocation.id);
  };

  const saveLocation = () => {
    if (!tempLocation) return;

    const existingIndex = data.businessLocations.findIndex(loc => loc.id === tempLocation.id);
    let updatedLocations;

    if (existingIndex >= 0) {
      // Update existing location
      updatedLocations = data.businessLocations.map(loc => 
        loc.id === tempLocation.id ? tempLocation : loc
      );
    } else {
      // Add new location
      updatedLocations = [...data.businessLocations, tempLocation];
    }

    updateData({ businessLocations: updatedLocations });
    setEditingLocationId(null);
    setTempLocation(null);
  };

  const startEditing = (location: BusinessLocation) => {
    setTempLocation({ ...location });
    setEditingLocationId(location.id);
  };

  const cancelEditing = () => {
    setEditingLocationId(null);
    setTempLocation(null);
  };

  const deleteLocation = (locationId: string) => {
    const updatedLocations = data.businessLocations.filter(location => location.id !== locationId);
    updateData({ businessLocations: updatedLocations });
    if (editingLocationId === locationId) {
      cancelEditing();
    }
  };

  const seasonalityOptions = [
    { value: "year-round", label: "Celoročne" },
    { value: "seasonal", label: "Sezónne" }
  ];

  const renderLocationForm = (location: BusinessLocation) => (
    <div className="space-y-6 bg-slate-50 p-6 rounded-lg">
      <div className="grid md:grid-cols-2 gap-6">
        <OnboardingInput
          label="Názov obchodného miesta *"
          value={location.name}
          onChange={(e) => updateTempLocation('name', e.target.value)}
          placeholder="Názov predajne/prevádzky"
          icon={<Store className="h-4 w-4" />}
        />
        
        <div className="flex items-end h-full pb-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`hasPOS-${location.id}`}
              checked={location.hasPOS}
              onCheckedChange={(checked) => updateTempLocation('hasPOS', checked)}
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
              onChange={(e) => updateTempLocation('address.street', e.target.value)}
              placeholder="Obchodná ulica 456"
            />
          </div>
          
          <OnboardingInput
            label="PSČ *"
            value={location.address.zipCode}
            onChange={(e) => updateTempLocation('address.zipCode', e.target.value)}
            placeholder="01001"
          />
        </div>
        
        <OnboardingInput
          label="Mesto *"
          value={location.address.city}
          onChange={(e) => updateTempLocation('address.city', e.target.value)}
          placeholder="Bratislava"
        />
      </div>

      <OnboardingInput
        label="IBAN *"
        value={location.iban}
        onChange={(e) => updateTempLocation('iban', e.target.value)}
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
            onChange={(e) => updateTempLocation('contactPerson.name', e.target.value)}
            placeholder="Mária Kováčová"
          />
          
          <OnboardingInput
            label="Email *"
            type="email"
            value={location.contactPerson.email}
            onChange={(e) => updateTempLocation('contactPerson.email', e.target.value)}
            placeholder="maria.kovacova@prevadzka.sk"
          />
          
          <OnboardingInput
            label="Telefón *"
            value={location.contactPerson.phone}
            onChange={(e) => updateTempLocation('contactPerson.phone', e.target.value)}
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
            onChange={(e) => updateTempLocation('businessSector', e.target.value)}
            placeholder="Maloobchod, reštaurácie, služby..."
          />
          
          <OnboardingInput
            label="Odhadovaný obrat (EUR) *"
            type="number"
            value={location.estimatedTurnover || ''}
            onChange={(e) => updateTempLocation('estimatedTurnover', Number(e.target.value))}
            placeholder="50000"
          />
        </div>

        <OnboardingInput
          label="Priemerná výška transakcie (EUR) *"
          type="number"
          value={location.averageTransaction || ''}
          onChange={(e) => updateTempLocation('averageTransaction', Number(e.target.value))}
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
          onChange={(e) => updateTempLocation('openingHours', e.target.value)}
          placeholder="Po-Pia: 9:00-18:00, So: 9:00-14:00, Ne: zatvorené"
          rows={3}
        />

        <div className="mt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <OnboardingSelect
              label="Sezónnosť *"
              value={location.seasonality}
              onValueChange={(value) => updateTempLocation('seasonality', value)}
              options={seasonalityOptions}
            />
            
            {location.seasonality === 'seasonal' && (
              <OnboardingInput
                label="Počet týždňov v sezóne"
                type="number"
                value={location.seasonalWeeks || ''}
                onChange={(e) => updateTempLocation('seasonalWeeks', Number(e.target.value))}
                placeholder="20"
                min="1"
                max="52"
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <Button onClick={saveLocation} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Uložiť prevádzku
        </Button>
        <Button onClick={cancelEditing} variant="outline" className="flex items-center gap-2">
          <X className="h-4 w-4" />
          Zrušiť
        </Button>
        {data.businessLocations.some(loc => loc.id === location.id) && (
          <Button 
            onClick={() => deleteLocation(location.id)} 
            variant="outline" 
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Zmazať
          </Button>
        )}
      </div>
    </div>
  );

  const renderLocationSummary = (location: BusinessLocation) => (
    <div className="p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-slate-900 flex items-center gap-2">
          <Store className="h-4 w-4 text-green-600" />
          {location.name}
        </h4>
        <Button
          onClick={() => startEditing(location)}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <Edit className="h-3 w-3" />
          Upraviť
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Adresa:</span> {location.address.street}, {location.address.city}
        </div>
        <div>
          <span className="font-medium">Kontakt:</span> {location.contactPerson.name}
        </div>
        <div>
          <span className="font-medium">Sektor:</span> {location.businessSector}
        </div>
        <div>
          <span className="font-medium">POS:</span> {location.hasPOS ? 'Áno' : 'Nie'}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Store className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-medium text-green-900">Údaje o prevádzke</h3>
              </div>
              
              <p className="text-sm text-green-800">
                Spravujte svoje prevádzkové lokality, kde budú platobné terminály umiestnené.
              </p>
              
              <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                <p className="font-medium mb-2">Môžete pridať viacero prevádzkových miest</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Každá prevádzka môže mať vlastné kontaktné údaje</li>
                  <li>Osoby môžu byť priradené ku konkrétnym prevádzkam</li>
                  <li>Presné adresy pre inštaláciu terminálov</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main form content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-slate-900">
                    Prevádzkové lokality ({data.businessLocations.length})
                  </h3>
                  <Button 
                    onClick={addNewLocation} 
                    className="flex items-center gap-2"
                    disabled={editingLocationId !== null}
                  >
                    <Plus className="h-4 w-4" />
                    Pridať prevádzku
                  </Button>
                </div>

                {/* Editing Form */}
                {editingLocationId && tempLocation && (
                  <div>
                    <h4 className="text-md font-medium text-slate-900 mb-4">
                      {data.businessLocations.some(loc => loc.id === tempLocation.id) ? 'Upraviť prevádzku' : 'Nová prevádzka'}
                    </h4>
                    {renderLocationForm(tempLocation)}
                  </div>
                )}

                {/* Existing Locations */}
                {data.businessLocations.length > 0 && !editingLocationId && (
                  <div className="space-y-4">
                    {data.businessLocations.map((location) => (
                      <div key={location.id}>
                        {renderLocationSummary(location)}
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {data.businessLocations.length === 0 && !editingLocationId && (
                  <div className="text-center py-12">
                    <Store className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">Žiadne prevádzky</h3>
                    <p className="text-slate-600 mb-6">Pridajte svoju prvú prevádzkovou lokalitu</p>
                    <Button onClick={addNewLocation} className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Pridať prevádzku
                    </Button>
                  </div>
                )}
              </div>
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessLocationStep;
