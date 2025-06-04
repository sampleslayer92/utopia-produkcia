import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import EditableSection from "./EditableSection";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useBusinessLocationsCrud } from "@/hooks/useBusinessLocationsCrud";
import { useParams } from "react-router-dom";

interface ClientOperationsSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const ClientOperationsSection = ({ onboardingData, isEditMode, onSave }: ClientOperationsSectionProps) => {
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
        await deleteLocation.mutateAsync(locationToDelete.id);
        setDeleteModalOpen(false);
        setLocationToDelete(null);
      } catch (error) {
        console.error('Error deleting location:', error);
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
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company Information */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900">
              <Building className="h-5 w-5 mr-2 text-blue-600" />
              Informácie o spoločnosti
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableSection isEditMode={isEditMode}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">Názov spoločnosti</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={companyInfo?.companyName || ''} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">{companyInfo?.companyName || 'Neuvedené'}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-600">IČO</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={companyInfo?.ico || ''} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">{companyInfo?.ico || 'Neuvedené'}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-600">DIČ</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={companyInfo?.dic || ''} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">{companyInfo?.dic || 'Neuvedené'}</p>
                  )}
                </div>
                
                <div>
                  <Label className="text-sm font-medium text-slate-600">IČ DPH</Label>
                  {isEditMode ? (
                    <Input 
                      defaultValue={companyInfo?.vatNumber || ''} 
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-slate-900 mt-1">{companyInfo?.vatNumber || 'Nie je platca DPH'}</p>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-slate-600">Adresa sídla</Label>
                {isEditMode ? (
                  <Input 
                    defaultValue={`${companyInfo?.addressStreet || ''}, ${companyInfo?.addressCity || ''} ${companyInfo?.addressZipCode || ''}`} 
                    className="mt-1"
                  />
                ) : (
                  <p className="text-slate-900 mt-1">
                    {companyInfo?.addressStreet}, {companyInfo?.addressCity} {companyInfo?.addressZipCode}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200">
                <h4 className="font-medium text-slate-900 mb-3">Kontaktná osoba</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Meno</Label>
                    {isEditMode ? (
                      <Input 
                        defaultValue={`${contactInfo?.firstName || ''} ${contactInfo?.lastName || ''}`} 
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">
                        {contactInfo?.firstName} {contactInfo?.lastName}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                </div>
              </div>
            </EditableSection>
          </CardContent>
        </Card>

        {/* Business Locations */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-slate-900">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                Prevádzky
              </div>
              {isEditMode && (
                <Button variant="outline" size="sm" onClick={addNewLocation} disabled={isAdding}>
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať prevádzku
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessLocations && businessLocations.length > 0 ? (
              businessLocations.map((location: any, index: number) => (
                <EditableSection key={location.id || index} isEditMode={isEditMode}>
                  <div className="p-4 bg-slate-50/50 rounded-lg space-y-3 relative">
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteLocation(location)}
                        className="absolute top-2 right-2 text-red-600 hover:text-red-700"
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Názov prevádzky</Label>
                      {isEditMode ? (
                        <Input 
                          defaultValue={location.name || ''} 
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-slate-900 mt-1 font-medium">{location.name}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-slate-600">Adresa</Label>
                      {isEditMode ? (
                        <Input 
                          defaultValue={`${location.addressStreet || ''}, ${location.addressCity || ''} ${location.addressZipCode || ''}`} 
                          className="mt-1"
                        />
                      ) : (
                        <p className="text-slate-900 mt-1">
                          {location.addressStreet}, {location.addressCity} {location.addressZipCode}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">IBAN</Label>
                        {isEditMode ? (
                          <Input 
                            defaultValue={location.iban || ''} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1 font-mono text-sm">{location.iban}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">MCC sektor</Label>
                        {isEditMode ? (
                          <Input 
                            defaultValue={location.businessSector || ''} 
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{location.businessSector}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </EditableSection>
              ))
            ) : (
              <div className="text-center py-8">
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
      </div>

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

export default ClientOperationsSection;
