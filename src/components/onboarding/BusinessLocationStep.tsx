
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Store, MapPin, Clock } from "lucide-react";
import { OnboardingData, BusinessLocation, BankAccount, OpeningHours } from "@/types/onboarding";
import OnboardingInput from "./ui/OnboardingInput";
import OnboardingSelect from "./ui/OnboardingSelect";
import OnboardingSection from "./ui/OnboardingSection";
import BankAccountsSection from "./BusinessLocationStep/BankAccountsSection";
import BusinessDetailsSection from "./BusinessLocationStep/BusinessDetailsSection";
import ContactPersonSection from "./BusinessLocationStep/ContactPersonSection";
import OpeningHoursSummary from "./BusinessLocationStep/OpeningHoursSummary";
import OpeningHoursModal from "./BusinessLocationStep/OpeningHoursModal";
import { useState, useEffect } from "react";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const [expandedLocationId, setExpandedLocationId] = useState<string | null>(null);
  const [editingHoursLocationId, setEditingHoursLocationId] = useState<string | null>(null);

  const seasonalityOptions = [
    { value: "year-round", label: "Celoročne" },
    { value: "seasonal", label: "Sezónne" }
  ];

  // Check if user has "Kontaktná osoba na prevádzku" role or "Majiteľ" role
  const hasBusinessContactRole = data.contactInfo.userRoles?.includes('Kontaktná osoba na prevádzku') || 
                                data.contactInfo.userRoles?.includes('Majiteľ') || 
                                false;

  const addBusinessLocation = () => {
    const contactPersonData = hasBusinessContactRole ? {
      name: `${data.contactInfo.firstName} ${data.contactInfo.lastName}`,
      email: data.contactInfo.email,
      phone: data.contactInfo.phone
    } : {
      name: '',
      email: '',
      phone: ''
    };

    // Default bank account
    const defaultBankAccount: BankAccount = {
      id: Date.now().toString(),
      format: 'IBAN',
      iban: '',
      mena: 'EUR'
    };

    // Default opening hours (weekdays open, weekends closed)
    const defaultOpeningHours: OpeningHours[] = [
      { day: "Po", open: "09:00", close: "17:00", otvorene: true },
      { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
      { day: "St", open: "09:00", close: "17:00", otvorene: true },
      { day: "Št", open: "09:00", close: "17:00", otvorene: true },
      { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
      { day: "So", open: "09:00", close: "14:00", otvorene: false },
      { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
    ];

    const newLocation: BusinessLocation = {
      id: Date.now().toString(),
      name: '',
      hasPOS: false,
      address: { street: '', city: '', zipCode: '' },
      iban: '', // Keep for backward compatibility
      bankAccounts: [defaultBankAccount],
      contactPerson: contactPersonData,
      businessSector: '', // Keep for backward compatibility
      businessSubject: '',
      mccCode: '',
      estimatedTurnover: 0, // Keep for backward compatibility
      monthlyTurnover: 0,
      averageTransaction: 0,
      openingHours: '', // Keep for backward compatibility
      openingHoursDetailed: defaultOpeningHours,
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

  // Handle bank accounts update
  const updateBankAccounts = (locationId: string, bankAccounts: BankAccount[]) => {
    updateBusinessLocation(locationId, 'bankAccounts', bankAccounts);
    
    // Update backward compatibility IBAN field
    if (bankAccounts.length > 0) {
      const firstAccount = bankAccounts[0];
      if (firstAccount.format === 'IBAN' && firstAccount.iban) {
        updateBusinessLocation(locationId, 'iban', firstAccount.iban);
      } else if (firstAccount.format === 'CisloUctuKodBanky' && firstAccount.cisloUctu && firstAccount.kodBanky) {
        updateBusinessLocation(locationId, 'iban', `${firstAccount.cisloUctu}/${firstAccount.kodBanky}`);
      }
    }
  };

  // Handle business details update
  const updateBusinessDetails = (locationId: string, field: string, value: string | number) => {
    updateBusinessLocation(locationId, field, value);
    
    // Update backward compatibility fields
    if (field === 'businessSubject') {
      updateBusinessLocation(locationId, 'businessSector', value);
    } else if (field === 'monthlyTurnover') {
      updateBusinessLocation(locationId, 'estimatedTurnover', value);
    }
  };

  // Handle opening hours update via modal
  const updateOpeningHours = (locationId: string, openingHours: OpeningHours[]) => {
    updateBusinessLocation(locationId, 'openingHoursDetailed', openingHours);
    
    // Update backward compatibility openingHours field
    const hoursText = openingHours
      .filter(h => h.otvorene)
      .map(h => `${h.day}: ${h.open}-${h.close}`)
      .join(', ');
    updateBusinessLocation(locationId, 'openingHours', hoursText || 'Nie sú zadané');
  };

  // Handle contact person update
  const updateContactPerson = (locationId: string, field: string, value: string) => {
    updateBusinessLocation(locationId, `contactPerson.${field}`, value);
  };

  const toggleLocation = (id: string) => {
    setExpandedLocationId(expandedLocationId === id ? null : id);
  };

  // Migrate existing locations to have bankAccounts and openingHoursDetailed
  useEffect(() => {
    const locationsNeedMigration = data.businessLocations.some(location => 
      !location.bankAccounts || !location.openingHoursDetailed || 
      !location.businessSubject || !location.monthlyTurnover
    );

    if (locationsNeedMigration) {
      const migratedLocations = data.businessLocations.map(location => {
        const migrated = { ...location };
        
        // Migrate bank accounts
        if (!migrated.bankAccounts) {
          migrated.bankAccounts = [{
            id: Date.now().toString(),
            format: 'IBAN' as const,
            iban: location.iban || '',
            mena: 'EUR' as const
          }];
        }
        
        // Migrate opening hours
        if (!migrated.openingHoursDetailed) {
          migrated.openingHoursDetailed = [
            { day: "Po", open: "09:00", close: "17:00", otvorene: true },
            { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
            { day: "St", open: "09:00", close: "17:00", otvorene: true },
            { day: "Št", open: "09:00", close: "17:00", otvorene: true },
            { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
            { day: "So", open: "09:00", close: "14:00", otvorene: false },
            { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
          ];
        }
        
        // Migrate business details
        if (!migrated.businessSubject) {
          migrated.businessSubject = location.businessSector || '';
        }
        if (!migrated.monthlyTurnover) {
          migrated.monthlyTurnover = location.estimatedTurnover || 0;
        }
        if (!migrated.mccCode) {
          migrated.mccCode = '';
        }
        
        return migrated;
      });
      
      updateData({ businessLocations: migratedLocations });
    }
  }, []);

  return (
    <>
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
                  Spravujte svoje prevádzkové lokality s detailnými údajmi o bankových účtoch, podnikaní a otváracích hodinách.
                </p>
                
                <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
                  <p className="font-medium mb-2">Nové funkcie v tejto verzii</p>
                  <ul className="space-y-2 list-disc list-inside">
                    <li>Správa viacerých bankových účtov</li>
                    <li>Detailné MCC kódy a predmet podnikania</li>
                    <li>Interaktívne otváracie hodiny s rýchlymi akciami</li>
                    <li>Podpora rôznych mien (EUR, CZK, USD)</li>
                  </ul>
                </div>

                {hasBusinessContactRole && (
                  <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
                    <p className="font-medium mb-2">Automatické predvyplnenie</p>
                    <p>Vaše kontaktné údaje sa automaticky predvyplnia pre nové prevádzky na základe vašej roly "{data.contactInfo.userRoles?.includes('Kontaktná osoba na prevádzku') ? 'Kontaktná osoba na prevádzku' : 'Majiteľ'}".</p>
                  </div>
                )}
                
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
                        <div className="space-y-8">
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

                          <div className="border-t border-slate-100 pt-6">
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

                          <div className="border-t border-slate-100 pt-6">
                            <BankAccountsSection
                              bankAccounts={location.bankAccounts || []}
                              onUpdateBankAccounts={(accounts) => updateBankAccounts(location.id, accounts)}
                            />
                          </div>

                          <div className="border-t border-slate-100 pt-6">
                            <BusinessDetailsSection
                              businessSubject={location.businessSubject || ''}
                              mccCode={location.mccCode || ''}
                              monthlyTurnover={location.monthlyTurnover || 0}
                              onUpdate={(field, value) => updateBusinessDetails(location.id, field, value)}
                            />
                          </div>

                          <div className="border-t border-slate-100 pt-6">
                            <div className="grid md:grid-cols-2 gap-4">
                              <OnboardingInput
                                label="Priemerná výška transakcie (EUR) *"
                                type="number"
                                value={location.averageTransaction || ''}
                                onChange={(e) => updateBusinessLocation(location.id, 'averageTransaction', Number(e.target.value))}
                                placeholder="25"
                              />
                              
                              <OnboardingSelect
                                label="Sezónnosť *"
                                value={location.seasonality}
                                onValueChange={(value) => updateBusinessLocation(location.id, 'seasonality', value)}
                                options={seasonalityOptions}
                              />
                            </div>
                            
                            {location.seasonality === 'seasonal' && (
                              <OnboardingInput
                                label="Počet týždňov v sezóne"
                                type="number"
                                value={location.seasonalWeeks || ''}
                                onChange={(e) => updateBusinessLocation(location.id, 'seasonalWeeks', Number(e.target.value))}
                                placeholder="20"
                                min="1"
                                max="52"
                                className="mt-4"
                              />
                            )}
                          </div>

                          {/* Opening Hours Summary - now using modal */}
                          <div className="border-t border-slate-100 pt-6">
                            <OpeningHoursSummary
                              openingHours={location.openingHoursDetailed || []}
                              onEdit={() => setEditingHoursLocationId(location.id)}
                            />
                          </div>

                          {/* Contact Person Section */}
                          <div className="border-t border-slate-100 pt-6">
                            <ContactPersonSection
                              contactPerson={location.contactPerson}
                              onUpdate={(field, value) => updateContactPerson(location.id, field, value)}
                            />
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

      {/* Opening Hours Modal */}
      {editingHoursLocationId && (
        <OpeningHoursModal
          isOpen={true}
          onClose={() => setEditingHoursLocationId(null)}
          openingHours={data.businessLocations.find(loc => loc.id === editingHoursLocationId)?.openingHoursDetailed || []}
          onSave={(hours) => {
            updateOpeningHours(editingHoursLocationId, hours);
            setEditingHoursLocationId(null);
          }}
        />
      )}
    </>
  );
};

export default BusinessLocationStep;
