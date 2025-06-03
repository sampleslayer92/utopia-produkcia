
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Monitor, Smartphone, Wifi } from "lucide-react";
import { OnboardingData, Device } from "@/types";

interface DevicesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DevicesStep = ({ data, updateData }: DevicesStepProps) => {
  const addDevice = () => {
    const newDevice: Partial<Device> = {
      serialNumber: '',
      model: '',
      type: 'terminal',
      status: 'active',
      locationId: '',
      installDate: new Date().toISOString().split('T')[0]
    };
    
    updateData({
      devices: [...data.devices, newDevice]
    });
  };

  const removeDevice = (index: number) => {
    const devices = data.devices.filter((_, i) => i !== index);
    updateData({ devices });
  };

  const updateDevice = (index: number, field: string, value: string) => {
    const devices = [...data.devices];
    devices[index] = { ...devices[index], [field]: value };
    updateData({ devices });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'terminal':
        return Monitor;
      case 'mobile':
        return Smartphone;
      case 'gateway':
        return Wifi;
      default:
        return Monitor;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <Monitor className="mr-2 h-5 w-5 text-blue-600" />
            Payment Devices
          </CardTitle>
          <CardDescription className="text-slate-600">
            Add the payment processing devices you'll be using
          </CardDescription>
        </CardHeader>
      </Card>

      {data.devices.length === 0 && (
        <Card className="border-slate-200/60 bg-blue-50/50">
          <CardContent className="p-8 text-center">
            <Monitor className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No devices added yet</h3>
            <p className="text-slate-600 mb-4">
              Add your first payment processing device to get started
            </p>
            <Button onClick={addDevice} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add First Device
            </Button>
          </CardContent>
        </Card>
      )}

      {data.devices.map((device, index) => {
        const DeviceIcon = getDeviceIcon(device.type || 'terminal');
        
        return (
          <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <DeviceIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-slate-900">
                      Device {index + 1}
                    </CardTitle>
                    <Badge variant="outline" className="border-green-200 text-green-700">
                      {device.status || 'Active'}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDevice(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`deviceType-${index}`}>Device Type *</Label>
                  <Select
                    value={device.type || ''}
                    onValueChange={(value) => updateDevice(index, 'type', value)}
                  >
                    <SelectTrigger className="border-slate-300 focus:border-blue-500">
                      <SelectValue placeholder="Select device type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="terminal">Payment Terminal</SelectItem>
                      <SelectItem value="mobile">Mobile Reader</SelectItem>
                      <SelectItem value="gateway">Payment Gateway</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`model-${index}`}>Model *</Label>
                  <Input
                    id={`model-${index}`}
                    value={device.model || ''}
                    onChange={(e) => updateDevice(index, 'model', e.target.value)}
                    placeholder="e.g., Verifone VX520"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`serialNumber-${index}`}>Serial Number *</Label>
                  <Input
                    id={`serialNumber-${index}`}
                    value={device.serialNumber || ''}
                    onChange={(e) => updateDevice(index, 'serialNumber', e.target.value)}
                    placeholder="Device serial number"
                    className="border-slate-300 focus:border-blue-500"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`location-${index}`}>Location *</Label>
                  <Select
                    value={device.locationId || ''}
                    onValueChange={(value) => updateDevice(index, 'locationId', value)}
                  >
                    <SelectTrigger className="border-slate-300 focus:border-blue-500">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      {data.locations.map((location, locIndex) => (
                        <SelectItem key={locIndex} value={locIndex.toString()}>
                          {location.name || `Location ${locIndex + 1}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`installDate-${index}`}>Planned Install Date</Label>
                <Input
                  id={`installDate-${index}`}
                  type="date"
                  value={device.installDate || ''}
                  onChange={(e) => updateDevice(index, 'installDate', e.target.value)}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        );
      })}

      {data.devices.length > 0 && (
        <Card className="border-dashed border-2 border-slate-300 bg-slate-50/50">
          <CardContent className="p-6">
            <Button
              onClick={addDevice}
              variant="outline"
              className="w-full border-slate-300 text-slate-700 hover:bg-slate-100"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Device
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DevicesStep;
