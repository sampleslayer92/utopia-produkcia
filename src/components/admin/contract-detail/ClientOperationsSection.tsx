import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const { deleteLocation, isDeleting } = useBusinessLocationsCrud(contractId!);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<any>(null);

  const companyInfo = onboardingData.companyInfo;
  const contactInfo = onboardingData.contactInfo;
  const businessLocations = onboardingData.businessLocations;

  const handleDeleteLocation = (location: any) => {
    setLocationToDelete(location);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (locationToDelete) {
      await deleteLocation.mutateAsync(locationToDelete.id);
      setDeleteModalOpen(false);
      setLocationToDelete(null);
    }
  };

  const addNewLocation = () => {
    // This would open a modal or form to add a new location
    console.log('Add new location');
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
                <Button variant="outline" size="sm" onClick={addNewLocation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať prevádzku
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {businessLocations && businessLocations.length > 0 ? (
              businessLocations.map((location: any, index: number) => (
                <EditableSection key={index} isEditMode={isEditMode}>
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
              <p className="text-slate-600 text-center py-4">
                Žiadne prevádzky neboli zadané
              </p>
            )}
          </CardContent>
        </Card>
      </div>

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
