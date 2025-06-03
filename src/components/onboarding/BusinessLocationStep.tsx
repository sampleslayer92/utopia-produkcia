
import { Card, CardContent } from "@/components/ui/card";
import { OnboardingData, BusinessLocation } from "@/types/onboarding";
import { useState } from "react";
import { Store } from "lucide-react";
import OnboardingSection from "./ui/OnboardingSection";
import BusinessLocationsList from "./business-location/BusinessLocationsList";

interface BusinessLocationStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BusinessLocationStep = ({ data, updateData }: BusinessLocationStepProps) => {
  const [editingLocation, setEditingLocation] = useState<BusinessLocation | null>(null);
  const [isNew, setIsNew] = useState(false);

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

  const updateLocationField = (field: string, value: any) => {
    if (!editingLocation) return;

    setEditingLocation(prev => {
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
    setEditingLocation(newLocation);
    setIsNew(true);
  };

  const saveLocation = () => {
    if (!editingLocation) return;

    const existingIndex = data.businessLocations.findIndex(loc => loc.id === editingLocation.id);
    let updatedLocations;

    if (existingIndex >= 0) {
      updatedLocations = data.businessLocations.map(loc => 
        loc.id === editingLocation.id ? editingLocation : loc
      );
    } else {
      updatedLocations = [...data.businessLocations, editingLocation];
    }

    updateData({ businessLocations: updatedLocations });
    setEditingLocation(null);
    setIsNew(false);
  };

  const startEditing = (location: BusinessLocation) => {
    setEditingLocation({ ...location });
    setIsNew(false);
  };

  const cancelEditing = () => {
    setEditingLocation(null);
    setIsNew(false);
  };

  const deleteLocation = (locationId: string) => {
    const updatedLocations = data.businessLocations.filter(location => location.id !== locationId);
    updateData({ businessLocations: updatedLocations });
    if (editingLocation?.id === locationId) {
      cancelEditing();
    }
  };

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
              <BusinessLocationsList
                locations={data.businessLocations}
                editingLocation={editingLocation}
                isNew={isNew}
                onAddNew={addNewLocation}
                onEdit={startEditing}
                onSave={saveLocation}
                onCancel={cancelEditing}
                onDelete={deleteLocation}
                onFieldChange={updateLocationField}
              />
            </OnboardingSection>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessLocationStep;
