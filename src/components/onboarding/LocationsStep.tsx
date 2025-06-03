
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, MapPin } from "lucide-react";
import { OnboardingData, Location } from "@/types";

interface LocationsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const LocationsStep = ({ data, updateData }: LocationsStepProps) => {
  const addLocation = () => {
    const newLocation: Partial<Location> = {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      isHeadquarters: false
    };
    
    updateData({
      locations: [...data.locations, newLocation]
    });
  };

  const removeLocation = (index: number) => {
    const locations = data.locations.filter((_, i) => i !== index);
    updateData({ locations });
  };

  const updateLocation = (index: number, field: string, value: string | boolean) => {
    const locations = [...data.locations];
    locations[index] = { ...locations[index], [field]: value };
    updateData({ locations });
  };

  const toggleHeadquarters = (index: number) => {
    const locations = data.locations.map((location, i) => ({
      ...location,
      isHeadquarters: i === index
    }));
    updateData({ locations });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <MapPin className="mr-2 h-5 w-5 text-blue-600" />
            Business Locations
          </CardTitle>
          <CardDescription className="text-slate-600">
            Add all locations where you'll be processing payments
          </CardDescription>
        </CardHeader>
      </Card>

      {data.locations.map((location, index) => (
        <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CardTitle className="text-lg text-slate-900">
                  Location {index + 1}
                </CardTitle>
                {location.isHeadquarters && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    Headquarters
                  </Badge>
                )}
              </div>
              {data.locations.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeLocation(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor={`locationName-${index}`}>Location Name *</Label>
              <Input
                id={`locationName-${index}`}
                value={location.name || ''}
                onChange={(e) => updateLocation(index, 'name', e.target.value)}
                placeholder="Main Store, Branch Office, etc."
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`address-${index}`}>Street Address *</Label>
              <Input
                id={`address-${index}`}
                value={location.address || ''}
                onChange={(e) => updateLocation(index, 'address', e.target.value)}
                placeholder="123 Main Street"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`city-${index}`}>City *</Label>
                <Input
                  id={`city-${index}`}
                  value={location.city || ''}
                  onChange={(e) => updateLocation(index, 'city', e.target.value)}
                  placeholder="City"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`state-${index}`}>State *</Label>
                <Input
                  id={`state-${index}`}
                  value={location.state || ''}
                  onChange={(e) => updateLocation(index, 'state', e.target.value)}
                  placeholder="State"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`zipCode-${index}`}>ZIP Code *</Label>
                <Input
                  id={`zipCode-${index}`}
                  value={location.zipCode || ''}
                  onChange={(e) => updateLocation(index, 'zipCode', e.target.value)}
                  placeholder="12345"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
              <Input
                id={`phone-${index}`}
                value={location.phone || ''}
                onChange={(e) => updateLocation(index, 'phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`headquarters-${index}`}
                checked={location.isHeadquarters || false}
                onCheckedChange={() => toggleHeadquarters(index)}
              />
              <Label htmlFor={`headquarters-${index}`} className="text-sm">
                This is the company headquarters
              </Label>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
        <CardContent className="p-6">
          <Button
            onClick={addLocation}
            variant="outline"
            className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Another Location
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationsStep;
