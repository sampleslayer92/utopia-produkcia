
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, MapPin, Plus, Trash2, Clock, Users as UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import EditableSection from "./EditableSection";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useBusinessLocationsCrud } from "@/hooks/useBusinessLocationsCrud";
import { useParams } from "react-router-dom";
import { format } from "date-fns";

interface EnhancedClientOperationsSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const EnhancedClientOperationsSection = ({ onboardingData, isEditMode, onSave }: EnhancedClientOperationsSectionProps) => {
  const { id: contractId } = useParams<{ id: string }>();
  const { addLocation, deleteLocation, isDeleting, isAdding } = useBusinessLocationsCrud(contractId!);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<any>(null);
  const [addLocationModal, setAddLocationModal] = useState(false);
  const [newLocationData, setNewLocationData] = useState({
    name: '',
    addressStreet: '',
    addressCity: '',
    addressZipCode: '',
    iban: '',
    businessSector: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    hasPos: false,
    estimatedTurnover: 0,
    averageTransaction: 0,
    seasonality: 'year-round' as const,
    seasonalWeeks: null as number | null,
    openingHours: ''
  });

  const companyInfo = onboardingData.companyInfo;
  const contactInfo = onboardingData.contactInfo;
  const businessLocations = onboardingData.businessLocations;

  const handleDeleteLocation = (location: any) => {
    setLocationToDelete(location);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (locationToDelete) {
      try {
        deleteLocation.mutate(locationToDelete.id, {
          onSuccess: () => {
            setDeleteModalOpen(false);
            setLocationToDelete(null);
          },
        });
      } catch (error) {
        console.error('Error in confirmDelete:', error);
      }
    }
  };

  const addNewLocation = () => {
    setAddLocationModal(true);
  };

  const handleAddLocation = async () => {
    try {
      await addLocation.mutateAsync(newLocationData);
      setAddLocationModal(false);
      setNewLocationData({
        name: '',
        addressStreet: '',
        addressCity: '',
        addressZipCode: '',
        iban: '',
        businessSector: '',
        contactPersonName: '',
        contactPersonPhone: '',
        contactPersonEmail: '',
        hasPos: false,
        estimatedTurnover: 0,
        averageTransaction: 0,
        seasonality: 'year-round' as const,
        seasonalWeeks: null,
        openingHours: ''
      });
    } catch (error) {
      console.error('Error adding location:', error);
    }
  };

  return (
    <>
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Company Information - rozšírené */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Informácie o spoločnosti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <EditableSection isEditMode={isEditMode}>
              {/* Základné údaje */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">
                  Základné údaje
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Názov spoločnosti</Label>
                    {isEditMode ? (
                      <Input defaultValue={companyInfo?.companyName || ''} className="mt-1" />
                    ) : (
                      <p className="text-slate-900 mt-1 font-medium">{companyInfo?.companyName || 'Neuvedené'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Typ registra</Label>
                    {isEditMode ? (
                      <Input defaultValue={companyInfo?.registryType || ''} className="mt-1" />
                    ) : (
                      <div className="mt-1">
                        <Badge variant="outline">{companyInfo?.registryType || 'Neuvedené'}</Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">IČO</Label>
                    {isEditMode ? (
                      <Input defaultValue={companyInfo?.ico || ''} className="mt-1" />
                    ) : (
                      <p className="text-slate-900 mt-1 font-mono">{companyInfo?.ico || 'Neuvedené'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">DIČ</Label>
                    {isEditMode ? (
                      <Input defaultValue={companyInfo?.dic || ''} className="mt-1" />
                    ) : (
                      <p className="text-slate-900 mt-1 font-mono">{companyInfo?.dic || 'Neuvedené'}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">IČ DPH</Label>
                    {isEditMode ? (
                      <Input defaultValue={companyInfo?.vatNumber || ''} className="mt-1" />
                    ) : (
                      <p className="text-slate-900 mt-1 font-mono">
                        {companyInfo?.vatNumber || (companyInfo?.isVatPayer ? 'Platca DPH' : 'Nie je platca DPH')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Obchodný register */}
              {(companyInfo?.court || companyInfo?.section || companyInfo?.insertNumber) && (
                <div className="space-y-4">
                  <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">
                    Obchodný register
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Súd</Label>
                      {isEditMode ? (
                        <Input defaultValue={companyInfo?.court || ''} className="mt-1" />
                      ) : (
                        <p className="text-slate-900 mt-1">{companyInfo?.court || 'Neuvedené'}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Oddiel</Label>
                      {isEditMode ? (
                        <Input defaultValue={companyInfo?.section || ''} className="mt-1" />
                      ) : (
                        <p className="text-slate-900 mt-1">{companyInfo?.section || 'Neuvedené'}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Vložka</Label>
                      {isEditMode ? (
                        <Input defaultValue={companyInfo?.insertNumber || ''} className="mt-1" />
                      ) : (
                        <p className="text-slate-900 mt-1">{companyInfo?.insertNumber || 'Neuvedené'}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Adresy */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">
                  Adresy
                </h4>
                
                <div>
                  <Label className="text-sm font-medium text-slate-600">Adresa sídla</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={`${companyInfo?.address?.street || ''}, ${companyInfo?.address?.city || ''} ${companyInfo?.address?.zipCode || ''}`} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">
                      {companyInfo?.address?.street}, {companyInfo?.address?.city} {companyInfo?.address?.zipCode}
                    </p>
                  )}
                </div>

                {!companyInfo?.contactAddressSameAsMain && companyInfo?.contactAddress && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Korešpondenčná adresa</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={`${companyInfo?.contactAddress?.street || ''}, ${companyInfo?.contactAddress?.city || ''} ${companyInfo?.contactAddress?.zipCode || ''}`} 
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">
                        {companyInfo?.contactAddress?.street}, {companyInfo?.contactAddress?.city} {companyInfo?.contactAddress?.zipCode}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Kontaktná osoba */}
              <div className="space-y-4">
                <h4 className="font-medium text-slate-900 border-b border-slate-200 pb-2">
                  Kontaktná osoba
                </h4>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Meno a priezvisko</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={`${companyInfo?.contactPerson?.firstName || ''} ${companyInfo?.contactPerson?.lastName || ''}`} 
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1 font-medium">
                        {companyInfo?.contactPerson?.firstName} {companyInfo?.contactPerson?.lastName}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Technická osoba</Label>
                    <div className="mt-2">
                      <Badge className={companyInfo?.contactPerson?.isTechnicalPerson ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}>
                        {companyInfo?.contactPerson?.isTechnicalPerson ? "Áno" : "Nie"}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Email</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={companyInfo?.contactPerson?.email || ''} 
                        type="email"
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo?.contactPerson?.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Telefón</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={companyInfo?.contactPerson?.phone || ''} 
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo?.contactPerson?.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            </EditableSection>
          </CardContent>
        </Card>

        {/* Primárny kontakt */}
        <Card className="border-emerald-200/60 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <UsersIcon className="h-5 w-5 mr-2 text-emerald-600" />
              Primárny kontakt
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableSection isEditMode={isEditMode}>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Meno a priezvisko</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={`${contactInfo?.firstName || ''} ${contactInfo?.lastName || ''}`} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1 font-medium">
                      {contactInfo?.salutation && `${contactInfo.salutation} `}
                      {contactInfo?.firstName} {contactInfo?.lastName}
                    </p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-600">Email</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={contactInfo?.email || ''} 
                      type="email"
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">{contactInfo?.email}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-600">Telefón</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={`${contactInfo?.phonePrefix || ''} ${contactInfo?.phone || ''}`} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">
                      {contactInfo?.phonePrefix} {contactInfo?.phone}
                    </p>
                  )}
                </div>

                {contactInfo?.userRole && (
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Pozícia</Label>
                    <div className="mt-1">
                      <Badge variant="outline">{contactInfo.userRole}</Badge>
                    </div>
                  </div>
                )}
              </div>
            </EditableSection>
          </CardContent>
        </Card>
      </div>

      {/* Business Locations - rozšírené */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-slate-900">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
              Prevádzky ({businessLocations?.length || 0})
            </div>
            {isEditMode && (
              <Button variant="outline" size="sm" onClick={addNewLocation} disabled={isAdding}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať prevádzku
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {businessLocations && businessLocations.length > 0 ? (
            businessLocations.map((location: any, index: number) => (
              <EditableSection key={location.id || index} isEditMode={isEditMode}>
                <div className="p-6 bg-slate-50/50 rounded-lg space-y-6 relative border border-slate-200">
                  {isEditMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLocation(location)}
                      className="absolute top-4 right-4 text-red-600 hover:text-red-700"
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                  
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Základné údaje prevádzky */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900 border-b border-slate-300 pb-2">
                        Základné údaje
                      </h4>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Názov prevádzky</Label>
                        {isEditMode ? (
                          <Input defaultValue={location.name || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1 font-medium">{location.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Adresa</Label>
                        {isEditMode ? (
                          <Input 
                            defaultValue={`${location.address?.street || ''}, ${location.address?.city || ''} ${location.address?.zipCode || ''}`} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">
                            {location.address?.street}, {location.address?.city} {location.address?.zipCode}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">POS systém</Label>
                        <div className="mt-1">
                          <Badge className={location.hasPOS ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                            {location.hasPOS ? "Áno" : "Nie"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Obchodné údaje */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900 border-b border-slate-300 pb-2">
                        Obchodné údaje
                      </h4>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">MCC sektor</Label>
                        {isEditMode ? (
                          <Input defaultValue={location.businessSubject || location.businessSector || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1">{location.businessSubject || location.businessSector}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Mesačný obrat</Label>
                          {isEditMode ? (
                            <Input 
                              type="number" 
                              defaultValue={location.monthlyTurnover || location.estimatedTurnover || 0} 
                              className="mt-1" 
                            />
                          ) : (
                            <p className="text-slate-900 mt-1 font-medium">
                              {(location.monthlyTurnover || location.estimatedTurnover || 0).toLocaleString()} €
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Priemerná transakcia</Label>
                          {isEditMode ? (
                            <Input 
                              type="number" 
                              defaultValue={location.averageTransaction || 0} 
                              className="mt-1" 
                            />
                          ) : (
                            <p className="text-slate-900 mt-1 font-medium">
                              {(location.averageTransaction || 0).toLocaleString()} €
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">Sezónnosť</Label>
                        <div className="mt-1 flex items-center space-x-2">
                          <Badge variant={location.seasonality === 'year-round' ? "default" : "secondary"}>
                            {location.seasonality === 'year-round' ? 'Celoročne' : 'Sezónne'}
                          </Badge>
                          {location.seasonality === 'seasonal' && location.seasonalWeeks && (
                            <span className="text-sm text-slate-600">
                              ({location.seasonalWeeks} týždňov)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Kontakt a IBAN */}
                    <div className="space-y-4">
                      <h4 className="font-medium text-slate-900 border-b border-slate-300 pb-2">
                        Kontakt a platby
                      </h4>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">IBAN</Label>
                        {isEditMode ? (
                          <Input defaultValue={location.iban || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1 font-mono text-sm break-all">{location.iban}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">Kontaktná osoba</Label>
                        {isEditMode ? (
                          <Input defaultValue={location.contactPerson?.name || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1 font-medium">{location.contactPerson?.name}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">Telefón</Label>
                        {isEditMode ? (
                          <Input defaultValue={location.contactPerson?.phone || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1">{location.contactPerson?.phone}</p>
                        )}
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-slate-600">Email</Label>
                        {isEditMode ? (
                          <Input defaultValue={location.contactPerson?.email || ''} className="mt-1" />
                        ) : (
                          <p className="text-slate-900 mt-1">{location.contactPerson?.email}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Otváracie hodiny */}
                  {location.openingHours && (
                    <div className="pt-4 border-t border-slate-300">
                      <h4 className="font-medium text-slate-900 mb-3 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Otváracie hodiny
                      </h4>
                      {location.openingHoursDetailed && location.openingHoursDetailed.length > 0 ? (
                        <div className="grid grid-cols-7 gap-2">
                          {location.openingHoursDetailed.map((hours: any, idx: number) => (
                            <div key={idx} className="text-center p-2 bg-white rounded border">
                              <div className="text-xs font-medium text-slate-600">{hours.day}</div>
                              <div className="text-xs text-slate-900">
                                {hours.otvorene ? `${hours.open}-${hours.close}` : 'Zatvorené'}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-900 text-sm">{location.openingHours}</p>
                      )}
                    </div>
                  )}
                </div>
              </EditableSection>
            ))
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">Žiadne prevádzky neboli zadané</p>
              {isEditMode && (
                <Button 
                  variant="outline"
                  onClick={addNewLocation}
                  disabled={isAdding}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať prvú prevádzku
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Location Modal */}
      <Dialog open={addLocationModal} onOpenChange={setAddLocationModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Pridať novú prevádzku</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div>
              <Label htmlFor="locationName">Názov prevádzky</Label>
              <Input
                id="locationName"
                value={newLocationData.name}
                onChange={(e) => setNewLocationData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Názov prevádzky"
              />
            </div>
            <div>
              <Label htmlFor="locationAddress">Adresa</Label>
              <Input
                id="locationAddress"
                value={newLocationData.addressStreet}
                onChange={(e) => setNewLocationData(prev => ({ ...prev, addressStreet: e.target.value }))}
                placeholder="Ulica a číslo"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="locationCity">Mesto</Label>
                <Input
                  id="locationCity"
                  value={newLocationData.addressCity}
                  onChange={(e) => setNewLocationData(prev => ({ ...prev, addressCity: e.target.value }))}
                  placeholder="Mesto"
                />
              </div>
              <div>
                <Label htmlFor="locationZip">PSČ</Label>
                <Input
                  id="locationZip"
                  value={newLocationData.addressZipCode}
                  onChange={(e) => setNewLocationData(prev => ({ ...prev, addressZipCode: e.target.value }))}
                  placeholder="PSČ"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="locationIban">IBAN</Label>
              <Input
                id="locationIban"
                value={newLocationData.iban}
                onChange={(e) => setNewLocationData(prev => ({ ...prev, iban: e.target.value }))}
                placeholder="IBAN účtu"
              />
            </div>
            <div>
              <Label htmlFor="locationSector">MCC sektor</Label>
              <Input
                id="locationSector"
                value={newLocationData.businessSector}
                onChange={(e) => setNewLocationData(prev => ({ ...prev, businessSector: e.target.value }))}
                placeholder="Obchodný sektor"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAddLocationModal(false)} disabled={isAdding}>
              Zrušiť
            </Button>
            <Button onClick={handleAddLocation} disabled={isAdding || !newLocationData.name.trim()}>
              {isAdding ? 'Pridáva sa...' : 'Pridať prevádzku'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title={locationToDelete?.name || 'túto prevádzku'}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default EnhancedClientOperationsSection;
