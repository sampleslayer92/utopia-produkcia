
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Wifi, ShoppingCart, Wrench } from "lucide-react";
import DeviceCatalogCard from "@/components/onboarding/components/DeviceCatalogCard";
import MinimalServiceCatalogGroup from "@/components/onboarding/components/MinimalServiceCatalogGroup";
import UnifiedProductModal from "@/components/onboarding/components/UnifiedProductModal";
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
  const [showcaseModal, setShowcaseModal] = useState<{
    isOpen: boolean;
    product: any;
    type: 'device' | 'service';
  }>({
    isOpen: false,
    product: null,
    type: 'device'
  });

  const handleDeviceClick = (device: any) => {
    setShowcaseModal({
      isOpen: true,
      product: device,
      type: 'device'
    });
  };

  const handleServiceClick = (service: any) => {
    setShowcaseModal({
      isOpen: true,
      product: service,
      type: 'service'
    });
  };

  const handleShowcaseClose = () => {
    setShowcaseModal({
      isOpen: false,
      product: null,
      type: 'device'
    });
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
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0 pb-4">
            <DialogTitle>Pridať zariadenie alebo službu</DialogTitle>
          </DialogHeader>

          <div className="flex-1 min-h-0 flex flex-col">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 mb-6 flex-shrink-0">
                <TabsTrigger value="devices" className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4" />
                  <span>Zariadenia</span>
                </TabsTrigger>
                <TabsTrigger value="services" className="flex items-center space-x-2">
                  <Wifi className="h-4 w-4" />
                  <span>Služby</span>
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 min-h-0 overflow-y-auto">
                <TabsContent value="devices" className="mt-0 h-full">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
                    {DEVICE_CATALOG.map((device) => (
                      <DeviceCatalogCard
                        key={device.id}
                        device={device}
                        onAdd={() => handleDeviceClick(device)}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="services" className="mt-0 h-full">
                  <div className="space-y-8 pb-6">
                    {Object.entries(SERVICE_CATALOG).map(([category, services]) => (
                      <div key={category} className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 sticky top-0 bg-white py-3 border-b border-slate-200">
                          {React.createElement(getTabIcon(category), { className: "h-5 w-5" })}
                          {category === 'software' ? 'Softvérové riešenia' : 
                           category === 'ecommerce' ? 'E-commerce riešenia' : 
                           'Technické služby'}
                        </h3>
                        <MinimalServiceCatalogGroup
                          services={services}
                          onAddService={(service) => handleServiceClick(service)}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-200 flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Zrušiť
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Unified Product Modal */}
      <UnifiedProductModal
        isOpen={showcaseModal.isOpen}
        onClose={handleShowcaseClose}
        mode="add"
        productType={showcaseModal.type}
        product={showcaseModal.product}
        onSave={onAddItem}
        businessLocations={[]}
      />
    </>
  );
};

export default AddDeviceServiceModal;
