
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, User, Shield } from "lucide-react";
import { OnboardingData, Owner } from "@/types";

interface OwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const OwnersStep = ({ data, updateData }: OwnersStepProps) => {
  const addOwner = () => {
    const newOwner: Partial<Owner> = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      ssn: '',
      dateOfBirth: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      ownershipPercentage: 0,
      title: ''
    };
    
    updateData({
      owners: [...data.owners, newOwner]
    });
  };

  const removeOwner = (index: number) => {
    if (data.owners.length > 1) {
      const owners = data.owners.filter((_, i) => i !== index);
      updateData({ owners });
    }
  };

  const updateOwner = (index: number, field: string, value: string | number) => {
    const owners = [...data.owners];
    owners[index] = { ...owners[index], [field]: value };
    updateData({ owners });
  };

  const getTotalOwnership = () => {
    return data.owners.reduce((total, owner) => {
      return total + (Number(owner.ownershipPercentage) || 0);
    }, 0);
  };

  const totalOwnership = getTotalOwnership();

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <User className="mr-2 h-5 w-5 text-blue-600" />
            Business Owners & Officers
          </CardTitle>
          <CardDescription className="text-slate-600">
            Provide information for all owners with 25% or more ownership and key officers
          </CardDescription>
          
          <div className="flex items-center space-x-2 mt-4">
            <Shield className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-amber-700">
              This information is required for compliance and verification purposes
            </span>
          </div>
        </CardHeader>
      </Card>

      {data.owners.map((owner, index) => (
        <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-lg text-slate-900">
                  Owner/Officer {index + 1}
                </CardTitle>
              </div>
              {data.owners.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeOwner(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${index}`}>First Name *</Label>
                <Input
                  id={`firstName-${index}`}
                  value={owner.firstName || ''}
                  onChange={(e) => updateOwner(index, 'firstName', e.target.value)}
                  placeholder="First name"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`lastName-${index}`}>Last Name *</Label>
                <Input
                  id={`lastName-${index}`}
                  value={owner.lastName || ''}
                  onChange={(e) => updateOwner(index, 'lastName', e.target.value)}
                  placeholder="Last name"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`email-${index}`}>Email Address *</Label>
                <Input
                  id={`email-${index}`}
                  type="email"
                  value={owner.email || ''}
                  onChange={(e) => updateOwner(index, 'email', e.target.value)}
                  placeholder="email@example.com"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                <Input
                  id={`phone-${index}`}
                  value={owner.phone || ''}
                  onChange={(e) => updateOwner(index, 'phone', e.target.value)}
                  placeholder="(555) 123-4567"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`title-${index}`}>Title/Position *</Label>
                <Input
                  id={`title-${index}`}
                  value={owner.title || ''}
                  onChange={(e) => updateOwner(index, 'title', e.target.value)}
                  placeholder="CEO, President, etc."
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`ownership-${index}`}>Ownership Percentage *</Label>
                <Input
                  id={`ownership-${index}`}
                  type="number"
                  value={owner.ownershipPercentage || ''}
                  onChange={(e) => updateOwner(index, 'ownershipPercentage', Number(e.target.value))}
                  placeholder="25"
                  min="0"
                  max="100"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor={`dateOfBirth-${index}`}>Date of Birth *</Label>
                <Input
                  id={`dateOfBirth-${index}`}
                  type="date"
                  value={owner.dateOfBirth || ''}
                  onChange={(e) => updateOwner(index, 'dateOfBirth', e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`ssn-${index}`}>SSN *</Label>
                <Input
                  id={`ssn-${index}`}
                  value={owner.ssn || ''}
                  onChange={(e) => updateOwner(index, 'ssn', e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`address-${index}`}>Address *</Label>
              <Input
                id={`address-${index}`}
                value={owner.address || ''}
                onChange={(e) => updateOwner(index, 'address', e.target.value)}
                placeholder="123 Main Street"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`city-${index}`}>City *</Label>
                <Input
                  id={`city-${index}`}
                  value={owner.city || ''}
                  onChange={(e) => updateOwner(index, 'city', e.target.value)}
                  placeholder="City"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`state-${index}`}>State *</Label>
                <Input
                  id={`state-${index}`}
                  value={owner.state || ''}
                  onChange={(e) => updateOwner(index, 'state', e.target.value)}
                  placeholder="State"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`zipCode-${index}`}>ZIP Code *</Label>
                <Input
                  id={`zipCode-${index}`}
                  value={owner.zipCode || ''}
                  onChange={(e) => updateOwner(index, 'zipCode', e.target.value)}
                  placeholder="12345"
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
          <CardContent className="p-6">
            <Button
              onClick={addOwner}
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Owner
            </Button>
          </CardContent>
        </Card>

        <Card className={`border ${
          totalOwnership === 100 
            ? 'border-green-200 bg-green-50/50' 
            : 'border-amber-200 bg-amber-50/50'
        }`}>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2">
                <span className={totalOwnership === 100 ? 'text-green-700' : 'text-amber-700'}>
                  {totalOwnership}%
                </span>
              </div>
              <div className="text-sm">
                <span className={totalOwnership === 100 ? 'text-green-600' : 'text-amber-600'}>
                  Total Ownership
                </span>
              </div>
              {totalOwnership !== 100 && (
                <div className="text-xs text-amber-600 mt-2">
                  Should equal 100%
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnersStep;
