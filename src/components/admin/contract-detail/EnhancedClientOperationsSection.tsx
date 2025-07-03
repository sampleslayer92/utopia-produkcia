
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, MapPin, Plus, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import EditableSection from "./EditableSection";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useBusinessLocationsCrud } from "@/hooks/useBusinessLocationsCrud";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface EnhancedClientOperationsSectionProps {
  onboardingData: any;
  isEditMode: boolean;
  onUpdate: (data: any) => Promise<void>;
  onLocalChanges: (hasChanges: boolean) => void;
}

const EnhancedClientOperationsSection = ({ 
  onboardingData, 
  isEditMode, 
  onUpdate, 
  onLocalChanges 
}: EnhancedClientOperationsSectionProps) => {
  const { t } = useTranslation('admin');
  const { id: contractId } = useParams<{ id: string }>();
  const { addLocation, deleteLocation, isDeleting, isAdding } = useBusinessLocationsCrud(contractId!);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<any>(null);
  const [addLocationModal, setAddLocationModal] = useState(false);
  const [localChanges, setLocalChanges] = useState<any>({});
  const [hasChanges, setHasChanges] = useState(false);
  
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
  const businessLocations = onboardingData.businessLocations || [];

  console.log('EnhancedClientOperationsSection - Business Locations:', businessLocations);
  console.log('EnhancedClientOperationsSection - Full onboarding data:', onboardingData);

  // Track changes and notify parent
  useEffect(() => {
    onLocalChanges(hasChanges);
  }, [hasChanges, onLocalChanges]);

  // Expose commit function globally for the save handler
  useEffect(() => {
    const commitChanges = async () => {
      if (!hasChanges) {
        console.log('No changes to commit');
        return null;
      }

      console.log('Committing changes:', localChanges);
      
      // Merge local changes with original data
      const updatedData = {
        companyInfo: { ...companyInfo, ...localChanges.companyInfo },
        contactInfo: { ...contactInfo, ...localChanges.contactInfo }
      };

      setHasChanges(false);
      setLocalChanges({});
      
      return updatedData;
    };

    (window as any).__commitClientOperationsChanges = commitChanges;
    console.log('Registered commit function globally');

    return () => {
      delete (window as any).__commitClientOperationsChanges;
    };
  }, [hasChanges, localChanges, companyInfo, contactInfo]);

  const handleFieldChange = (section: string, field: string, value: any) => {
    console.log(`Field changed: ${section}.${field} = ${value}`);
    
    setLocalChanges((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    
    setHasChanges(true);
  };

  const getFieldValue = (section: string, field: string) => {
    return localChanges[section]?.[field] ?? onboardingData[section]?.[field] ?? '';
  };

  const handleDeleteLocation = (location: any) => {
    console.log('Setting location to delete:', location);
    setLocationToDelete(location);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (locationToDelete) {
      try {
        console.log('Deleting location with ID:', locationToDelete.id);
        deleteLocation.mutate(locationToDelete.id, {
          onSuccess: () => {
            console.log('Location deleted successfully');
            setDeleteModalOpen(false);
            setLocationToDelete(null);
          },
          onError: (error) => {
            console.error('Error deleting location:', error);
          }
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
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            {t('contracts.detail.client.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Company Information */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <Building className="h-4 w-4 text-slate-600" />
                <h3 className="font-semibold text-slate-900">{t('contracts.detail.client.companyInfo')}</h3>
              </div>
              
              <EditableSection isEditMode={isEditMode}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.companyName')}</Label>
                    {isEditMode ? (
                      <Input 
                        value={getFieldValue('companyInfo', 'companyName')}
                        onChange={(e) => handleFieldChange('companyInfo', 'companyName', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo?.companyName || t('contracts.detail.client.notSpecified')}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.ico')}</Label>
                    {isEditMode ? (
                      <Input 
                        value={getFieldValue('companyInfo', 'ico')}
                        onChange={(e) => handleFieldChange('companyInfo', 'ico', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo?.ico || t('contracts.detail.client.notSpecified')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.dic')}</Label>
                    {isEditMode ? (
                      <Input 
                        value={getFieldValue('companyInfo', 'dic')}
                        onChange={(e) => handleFieldChange('companyInfo', 'dic', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo?.dic || t('contracts.detail.client.notSpecified')}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.vatNumber')}</Label>
                    {isEditMode ? (
                      <Input 
                        value={getFieldValue('companyInfo', 'vatNumber')}
                        onChange={(e) => handleFieldChange('companyInfo', 'vatNumber', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-slate-900 mt-1">{companyInfo?.vatNumber || t('contracts.detail.client.notVatPayer')}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.address')}</Label>
                  {isEditMode ? (
                    <div className="space-y-2 mt-1">
                      <Input 
                        value={getFieldValue('companyInfo', 'addressStreet')}
                        onChange={(e) => handleFieldChange('companyInfo', 'addressStreet', e.target.value)}
                        placeholder={t('contracts.detail.client.streetPlaceholder')}
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          value={getFieldValue('companyInfo', 'addressCity')}
                          onChange={(e) => handleFieldChange('companyInfo', 'addressCity', e.target.value)}
                          placeholder={t('contracts.detail.client.cityPlaceholder')}
                        />
                        <Input 
                          value={getFieldValue('companyInfo', 'addressZipCode')}
                          onChange={(e) => handleFieldChange('companyInfo', 'addressZipCode', e.target.value)}
                          placeholder={t('contracts.detail.client.zipPlaceholder')}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-900 mt-1">
                      {companyInfo?.addressStreet}, {companyInfo?.addressCity} {companyInfo?.addressZipCode}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-medium text-slate-900 mb-3">{t('contracts.detail.client.contactPerson')}</h4>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.firstName')}</Label>
                        {isEditMode ? (
                          <Input 
                            value={getFieldValue('contactInfo', 'firstName')}
                            onChange={(e) => handleFieldChange('contactInfo', 'firstName', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{contactInfo?.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.lastName')}</Label>
                        {isEditMode ? (
                          <Input 
                            value={getFieldValue('contactInfo', 'lastName')}
                            onChange={(e) => handleFieldChange('contactInfo', 'lastName', e.target.value)}
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{contactInfo?.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.email')}</Label>
                        {isEditMode ? (
                          <Input 
                            value={getFieldValue('contactInfo', 'email')}
                            onChange={(e) => handleFieldChange('contactInfo', 'email', e.target.value)}
                            type="email"
                            className="mt-1"
                          />
                        ) : (
                          <p className="text-slate-900 mt-1">{contactInfo?.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.phone')}</Label>
                        {isEditMode ? (
                          <Input 
                            value={getFieldValue('contactInfo', 'phone')}
                            onChange={(e) => handleFieldChange('contactInfo', 'phone', e.target.value)}
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
            </div>

            {/* Business Locations */}
            <div className="space-y-6 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">{t('contracts.detail.client.businessLocations')} ({businessLocations.length})</h3>
                </div>
                {isEditMode && (
                  <Button variant="outline" size="sm" onClick={addNewLocation} disabled={isAdding}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('contracts.detail.client.addLocation')}
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
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
                          <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.locationName')}</Label>
                          <p className="text-slate-900 mt-1 font-medium">{location.name}</p>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.locationAddress')}</Label>
                          <p className="text-slate-900 mt-1">
                            {location.addressStreet}, {location.addressCity} {location.addressZipCode}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.iban')}</Label>
                            <p className="text-slate-900 mt-1 font-mono text-sm">{location.iban}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.businessSector')}</Label>
                            <p className="text-slate-900 mt-1">{location.businessSector}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.estimatedTurnover')}</Label>
                            <p className="text-slate-900 mt-1">{location.estimatedTurnover}{t('contracts.detail.client.perMonth')}</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.averageTransaction')}</Label>
                            <p className="text-slate-900 mt-1">{location.averageTransaction}{t('contracts.detail.client.euroCurrency')}</p>
                          </div>
                        </div>

                        {location.contactPersonName && (
                          <div className="pt-3 border-t border-slate-200">
                            <Label className="text-sm font-medium text-slate-600">{t('contracts.detail.client.contactPersonAtLocation')}</Label>
                            <p className="text-slate-900 mt-1">{location.contactPersonName}</p>
                            {location.contactPersonEmail && (
                              <p className="text-slate-600 text-sm">{location.contactPersonEmail}</p>
                            )}
                            {location.contactPersonPhone && (
                              <p className="text-slate-600 text-sm">{location.contactPersonPhone}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </EditableSection>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <MapPin className="h-12 w-12 text-slate-300 mx-auto mb-4" />
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
              </div>
            </div>
          </div>
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
