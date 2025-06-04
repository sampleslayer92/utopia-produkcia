
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Wifi, ShoppingCart, Wrench } from "lucide-react";
import DeviceCatalogCard from "@/components/onboarding/components/DeviceCatalogCard";
import ServiceCatalogGroup from "@/components/onboarding/components/ServiceCatalogGroup";
import { DEVICE_CATALOG } from "@/components/onboarding/config/deviceCatalog";
import { SERVICE_CATALOG } from "@/components/onboarding/config/serviceCatalog";
import { DynamicCard } from "@/types/onboarding";

interface AddDeviceServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: DynamicCard) => void;
}

const AddDeviceServiceModal = ({ isOpen, onClose, onAddItem }: AddDeviceServiceModalProps) => {
  const [selectedTab, setSelectedTab] = useState("devices");

  const handleAddDevice = (device: any) => {
    const dynamicCard: DynamicCard = {
      id: `device-${Date.now()}`,
      type: 'device',
      category: device.category,
      name: device.name,
      description: device.description,
      monthlyFee: device.monthlyFee,
      companyCost: device.companyCost || 0,
      count: 1,
      addons: []
    };
    onAddItem(dynamicCard);
    onClose();
  };

  const handleAddService = (service: any) => {
    const dynamicCard: DynamicCard = {
      id: `service-${Date.now()}`,
      type: 'service',
      category: service.category,
      name: service.name,
      description: service.description,
      monthlyFee: service.monthlyFee,
      companyCost: service.companyCost || 0,
      count: 1,
      addons: []
    };
    onAddItem(dynamicCard);
    onClose();
  };

  const getTabIcon = (category: string) => {
    switch (category) {
      case 'devices': return Monitor;
      case 'software': return Wifi;
      case 'ecommerce': return ShoppingCart;
      case 'technical': return Wrench;
      default: return Monitor;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pridať zariadenie alebo službu</DialogTitle>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices" className="flex items-center space-x-2">
              <Monitor className="h-4 w-4" />
              <span>Zariadenia</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center space-x-2">
              <Wifi className="h-4 w-4" />
              <span>Služby</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="devices" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEVICE_CATALOG.map((device) => (
                <DeviceCatalogCard
                  key={device.id}
                  device={device}
                  onSelect={() => handleAddDevice(device)}
                  isSelected={false}
                  showAddButton={true}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {Object.entries(SERVICE_CATALOG).map(([category, services]) => {
              const IconComponent = getTabIcon(category);
              return (
                <ServiceCatalogGroup
                  key={category}
                  title={category === 'software' ? 'Softvérové riešenia' : 
                         category === 'ecommerce' ? 'E-commerce riešenia' : 
                         'Technické služby'}
                  icon={IconComponent}
                  services={services}
                  selectedServices={[]}
                  onServiceToggle={(service) => handleAddService(service)}
                  showAddButton={true}
                />
              );
            })}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Zrušiť
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddDeviceServiceModal;
