import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Store, MapPin, Phone, CreditCard, Building, Clock } from "lucide-react";
import { OnboardingData, BusinessLocation } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingTextarea from "./ui/OnboardingTextarea";
import OnboardingSection from "./ui/OnboardingSection";
import { useState } from "react";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(null);

  const seasonalityOptions = [
    { value: "year-round", label: "Celoročne" },
    { value: "seasonal", label: "Sezónne" }
  ];

  const addBusinessLocation = () => {
    const newLocation: BusinessLocation = {
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
    };

    updateData({
      businessLocations: [...data.businessLocations, newLocation]
    });
    
    // Automatically expand the new location
    setExpandedLocationId(newLocation.id);
  };

  const removeBusinessLocation = (id: string) => {
    updateData({
      businessLocations: data.businessLocations.filter(location => location.id !== id)
    });
    if (expandedLocationId === id) {
      setExpandedLocationId(null);
    }
  };

  const updateBusinessLocation = (id: string, field: string, value: any) => {
    updateData({
      businessLocations: data.businessLocations.map(location => {
        if (location.id !== id) return location;
        
        if (field.includes('.')) {
          const [parent, child] = field.split('.');
          return {
            ...location,
            [parent]: {
              ...(location[parent as keyof BusinessLocation] as any),
              [child]: value
            }
          };
        } else {
          return {
            ...location,
            [field]: value
          };
        }
      })
    });
  };

  const toggleLocation = (id: string) => {
    setExpandedLocationId(expandedLocationId === id ? null : id);
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* Left sidebar */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Store className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-medium text-blue-900">Údaje o prevádzke</h3>
              </div>
              
              <p className="text-sm text-blue-800">
                Spravujte svoje prevádzkové lokality, kde budú platobné terminály umiestnené.
              </p>
              
              <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                <p className="font-medium mb-2">Môžete pridať viacero prevádzkových miest</p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Každá prevádzka môže mať vlastné kontaktné údaje</li>
                  <li>Osoby môžu byť priradené ku konkrétnym prevádzkam</li>
                  <li>Presné adresy pre inštaláciu terminálov</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <Button
                  onClick={addBusinessLocation}
                  variant="outline"
                  className="w-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 flex items-center justify-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Pridať prevádzku
                </Button>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <div className="col-span-1 md:col-span-2 p-6 md:p-8">
            <OnboardingSection>
              {data.businessLocations.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                  <Store className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-700 mb-2">Zatiaľ žiadne prevádzky</h3>
                  <p className="text-sm text-slate-500 mb-6">Pridajte svoju prvú prevádzkovou lokalitu</p>
                  <Button 
                    onClick={addBusinessLocation}
                    variant="outline" 
                    className="border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať prevádzku
                  </Button>
                </div>
              )}

              {data.businessLocations.map((location, index) => (
                <div key={location.id} className="mb-6 overflow-hidden border border-slate-200 rounded-lg shadow-sm bg-white">
                  <div 
                    onClick={() => toggleLocation(location.id)}
                    className={`flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 ${
                      expandedLocationId === location.id ? 'bg-slate-50 border-b border-slate-200' : ''
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
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBusinessLocation(location.id);
                        }}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-full transition-colors mr-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <div className="w-6 text-slate-400 transition-transform duration-200 transform">
                        {expandedLocationId === location.id ? '▲' : '▼'}
                      </div>
                    </div>
                  </div>

                  {expandedLocationId === location.id && (
                    <div className="p-4 animate-fade-in">
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Store className="h-4 w-4" />
                            Základné údaje
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label="Názov obchodného miesta *"
                              value={location.name}
                              onChange={(e) => updateBusinessLocation(location.id, 'name', e.target.value)}
                              placeholder="Názov predajne/prevádzky"
                            />
                            
                            <div className="flex items-end h-full pb-2">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id={`hasPOS-${location.id}`}
                                  checked={location.hasPOS}
                                  onCheckedChange={(checked) => updateBusinessLocation(location.id, 'hasPOS', checked)}
                                />
                                <label htmlFor={`hasPOS-${location.id}`} className="text-sm text-slate-700">
                                  Je na prevádzke POS?
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <MapPin className="h-4 w-4" />
                            Adresa prevádzky
                          </h4>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                              <OnboardingInput
                                label="Ulica a číslo *"
                                value={location.address.street}
                                onChange={(e) => updateBusinessLocation(location.id, 'address.street', e.target.value)}
                                placeholder="Obchodná ulica 456"
                              />
                            </div>
                            
                            <OnboardingInput
                              label="PSČ *"
                              value={location.address.zipCode}
                              onChange={(e) => updateBusinessLocation(location.id, 'address.zipCode', e.target.value)}
                              placeholder="01001"
                            />
                          </div>
                          
                          <OnboardingInput
                            label="Mesto *"
                            value={location.address.city}
                            onChange={(e) => updateBusinessLocation(location.id, 'address.city', e.target.value)}
                            placeholder="Bratislava"
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <CreditCard className="h-4 w-4" />
                            Bankové údaje
                          </h4>
                          
                          <OnboardingInput
                            label="IBAN *"
                            value={location.iban}
                            onChange={(e) => updateBusinessLocation(location.id, 'iban', e.target.value)}
                            placeholder="SK89 1200 0000 1987 4263 7541"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Phone className="h-4 w-4" />
                            Kontaktná osoba pre prevádzku
                          </h4>
                          
                          <div className="grid md:grid-cols-3 gap-4">
                            <OnboardingInput
                              label="Meno a priezvisko *"
                              value={location.contactPerson.name}
                              onChange={(e) => updateBusinessLocation(location.id, 'contactPerson.name', e.target.value)}
                              placeholder="Mária Kováčová"
                            />
                            
                            <OnboardingInput
                              label="Email *"
                              type="email"
                              value={location.contactPerson.email}
                              onChange={(e) => updateBusinessLocation(location.id, 'contactPerson.email', e.target.value)}
                              placeholder="maria.kovacova@prevadzka.sk"
                            />
                            
                            <OnboardingInput
                              label="Telefón *"
                              value={location.contactPerson.phone}
                              onChange={(e) => updateBusinessLocation(location.id, 'contactPerson.phone', e.target.value)}
                              placeholder="+421 987 654 321"
                            />
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Building className="h-4 w-4" />
                            Údaje o podnikaní
                          </h4>
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            <OnboardingInput
                              label="Odbor podnikania / MCC *"
                              value={location.businessSector}
                              onChange={(e) => updateBusinessLocation(location.id, 'businessSector', e.target.value)}
                              placeholder="Maloobchod, reštaurácie, služby..."
                            />
                            
                            <OnboardingInput
                              label="Odhadovaný obrat (EUR) *"
                              type="number"
                              value={location.estimatedTurnover || ''}
                              onChange={(e) => updateBusinessLocation(location.id, 'estimatedTurnover', Number(e.target.value))}
                              placeholder="50000"
                            />
                          </div>

                          <OnboardingInput
                            label="Priemerná výška transakcie (EUR) *"
                            type="number"
                            value={location.averageTransaction || ''}
                            onChange={(e) => updateBusinessLocation(location.id, 'averageTransaction', Number(e.target.value))}
                            placeholder="25"
                            className="mt-4"
                          />
                        </div>

                        <div className="border-t border-slate-100 pt-4">
                          <h4 className="text-sm font-medium text-blue-700 flex items-center gap-2 mb-4">
                            <Clock className="h-4 w-4" />
                            Prevádzkové informácie
                          </h4>
                          
                          <OnboardingTextarea
                            label="Otváracie hodiny *"
                            value={location.openingHours}
                            onChange={(e) => updateBusinessLocation(location.id, 'openingHours', e.target.value)}
                            placeholder="Po-Pia: 9:00-18:00, So: 9:00-14:00, Ne: zatvorené"
                            rows={3}
                          />

                          <div className="mt-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <OnboardingSelect
                                label="Sezónnosť *"
                                value={location.seasonality}
                                onValueChange={(value) => updateBusinessLocation(location.id, 'seasonality', value)}
                                options={seasonalityOptions}
                              />
                              
                              {location.seasonality === 'seasonal' && (
                                <OnboardingInput
                                  label="Počet týždňov v sezóne"
                                  type="number"
                                  value={location.seasonalWeeks || ''}
                                  onChange={(e) => updateBusinessLocation(location.id, 'seasonalWeeks', Number(e.target.value))}
                                  placeholder="20"
                                  min="1"
                                  max="52"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {data.businessLocations.length > 0 && (
                <Button
                  onClick={addBusinessLocation}
                  variant="outline"
                  className="w-full border-dashed border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať ďalšiu prevádzku
                </Button>
              )}
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessLocationStep;
