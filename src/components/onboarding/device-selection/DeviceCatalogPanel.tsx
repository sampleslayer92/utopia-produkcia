import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Zap, CreditCard, Monitor, Globe, Smartphone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MinimalDeviceCatalogCard from "../components/MinimalDeviceCatalogCard";
import MinimalServiceCatalogGroup from "../components/MinimalServiceCatalogGroup";
import UnifiedProductModal from "../components/UnifiedProductModal";
import { BusinessLocation } from "@/types/business";
import { useTranslation } from "react-i18next";
import { DynamicCard } from "@/types/onboarding";

interface DeviceCatalogPanelProps {
  selectedSolutions: string[];
  onAddDevice: (deviceTemplate: any) => void;
  onAddService: (serviceTemplate: any, category: string) => void;
  businessLocations: BusinessLocation[];
}

const DeviceCatalogPanel = ({ 
  selectedSolutions, 
  onAddDevice, 
  onAddService,
  businessLocations
}: DeviceCatalogPanelProps) => {
  const { t } = useTranslation('forms');
  const [openGroups, setOpenGroups] = useState<string[]>(['terminals', 'pos', 'software']);
  const [showcaseModal, setShowcaseModal] = useState<{
    isOpen: boolean;
    product: any;
    type: 'device' | 'service';
    originalCallback?: (item: any, category?: string) => void;
  }>({
    isOpen: false,
    product: null,
    type: 'device'
  });

  const handleDeviceShowcase = (device: any) => {
    setShowcaseModal({
      isOpen: true,
      product: device,
      type: 'device',
      originalCallback: onAddDevice
    });
  };

  const handleServiceShowcase = (service: any, category: string) => {
    setShowcaseModal({
      isOpen: true,
      product: { ...service, category },
      type: 'service',
      originalCallback: (item: any) => onAddService(item, category)
    });
  };

  const handleShowcaseClose = () => {
    setShowcaseModal({
      isOpen: false,
      product: null,
      type: 'device'
    });
  };

  const handleShowcaseAdd = (item: DynamicCard) => {
    if (showcaseModal.originalCallback) {
      showcaseModal.originalCallback(item);
    }
    handleShowcaseClose();
  };

  const solutionIcons = {
    terminal: <CreditCard className="h-4 w-4" />,
    pos: <Monitor className="h-4 w-4" />,
    gateway: <Globe className="h-4 w-4" />,
    softpos: <Smartphone className="h-4 w-4" />,
    charging: <Zap className="h-4 w-4" />
  };

  const solutionBadgeNames = {
    terminal: t('deviceSelection.solutionSelection.solutionBadges.terminal'),
    pos: t('deviceSelection.solutionSelection.solutionBadges.pos'),
    gateway: t('deviceSelection.solutionSelection.solutionBadges.gateway'),
    softpos: t('deviceSelection.solutionSelection.solutionBadges.softpos'),
    charging: t('deviceSelection.solutionSelection.solutionBadges.charging')
  };

  const availableDevices = {
    terminal: [
      {
        id: 'pax-a920-pro',
        type: 'device' as const,
        category: 'terminal',
        name: 'PAX A920 PRO',
        description: 'Mobilný terminál s vysokým výkonom',
        image: 'https://cdn.prod.website-files.com/66d5d36d3181175e6ea8e618/682e2fdceed81a55890e46aa_A920%20Pro%201-p-1080.png',
        specifications: [
          'Prepojenie s pokladňou: Podporované',
          'Zdroj energie: Batéria (8 hodín)',
          'Pripojenie: SIM, WiFi, Ethernet (s dockom)',
          'Displej: 5" farebný dotykový',
          'Pinpad: Nie je možné pripojiť',
          'Platby: Kontaktné, bezkontaktné, Google/Apple Pay'
        ],
        count: 1,
        monthlyFee: 25,
        simCards: 1,
        purchasePrice: 450,
        rentalPrice: 25,
        companyCost: 17.5
      },
      {
        id: 'pax-a80',
        type: 'device' as const,
        category: 'terminal',
        name: 'PAX A80',
        description: 'Stacionárny terminál pre vysoký objem transakcií',
        image: 'https://cdn.prod.website-files.com/66d5d36d3181175e6ea8e618/682e303eed8f5d41b24c13ad_A80%201-p-1080.png',
        specifications: [
          'Napájanie: Elektrická sieť 230V',
          'Pripojenie: Ethernet, WiFi (voliteľne)',
          'Displej: 2.8" farebný',
          'Pinpad: Áno (externý)',
          'Rýchlosť: Vysokorýchlostné spracovanie',
          'Platby: Všetky typy kariet + NFC'
        ],
        count: 1,
        monthlyFee: 20,
        purchasePrice: 320,
        rentalPrice: 20,
        companyCost: 14
      }
    ],
    pos: [
      {
        id: 'tablet-10',
        type: 'device' as const,
        category: 'pos',
        name: 'Tablet 10"',
        description: 'Kompaktný tablet pre menšie prevádzky',
        specifications: [
          'Displej: 10" Full HD dotykový',
          'OS: Android 12',
          'RAM: 4GB, Storage: 64GB',
          'Batéria: 12 hodín prevádzky',
          'Pripojenie: WiFi, Bluetooth, 4G (voliteľne)'
        ],
        count: 1,
        monthlyFee: 35,
        purchasePrice: 280,
        rentalPrice: 35,
        companyCost: 24.5
      },
      {
        id: 'tablet-15',
        type: 'device' as const,
        category: 'pos',
        name: 'Tablet 15"',
        description: 'Veľký tablet pre reštaurácie a obchody',
        specifications: [
          'Displej: 15.6" Full HD dotykový',
          'OS: Android 12',
          'RAM: 6GB, Storage: 128GB',
          'Batéria: 10 hodín prevádzky',
          'Pripojenie: WiFi, Bluetooth, Ethernet'
        ],
        count: 1,
        monthlyFee: 45,
        purchasePrice: 420,
        rentalPrice: 45,
        companyCost: 31.5
      }
    ]
  };

  const serviceGroups = {
    software: {
      title: t('deviceSelection.catalog.serviceGroups.software'),
      icon: <Monitor className="h-5 w-5 text-green-600" />,
      items: [
        { 
          id: 'pos-software', 
          name: t('deviceSelection.catalog.products.posService'), 
          description: 'Komplexný pokladničný systém',
          monthlyFee: 15,
          companyCost: 8
        },
        { 
          id: 'inventory', 
          name: t('deviceSelection.catalog.products.inventory'), 
          description: 'Sledovanie zásob a produktov',
          monthlyFee: 10,
          companyCost: 5
        },
        { 
          id: 'reporting', 
          name: t('deviceSelection.catalog.products.reporting'), 
          description: 'Detailné reporty a štatistiky',
          monthlyFee: 8,
          companyCost: 4
        }
      ]
    },
    technical: {
      title: t('deviceSelection.catalog.serviceGroups.technical'),
      icon: <Zap className="h-5 w-5 text-orange-600" />,
      items: [
        { 
          id: 'installation', 
          name: t('deviceSelection.catalog.products.installation'), 
          description: 'Profesionálna inštalácia',
          monthlyFee: 0,
          companyCost: 50
        },
        { 
          id: 'training', 
          name: t('deviceSelection.catalog.products.training'), 
          description: 'Komplexné zaškolenie',
          monthlyFee: 0,
          companyCost: 30
        },
        { 
          id: 'support', 
          name: t('deviceSelection.catalog.products.support'), 
          description: 'Nepretržitá podpora',
          monthlyFee: 12,
          companyCost: 6
        }
      ]
    },
    accessories: {
      title: t('deviceSelection.catalog.serviceGroups.accessories'),
      icon: <CreditCard className="h-5 w-5 text-purple-600" />,
      items: [
        { 
          id: 'receipt-printer', 
          name: t('deviceSelection.catalog.products.receiptPrinter'), 
          description: 'Termálna tlačiareň 80mm',
          monthlyFee: 8,
          companyCost: 5
        },
        { 
          id: 'cash-drawer', 
          name: t('deviceSelection.catalog.products.cashDrawer'), 
          description: 'Bezpečná kovová zásuvka',
          monthlyFee: 5,
          companyCost: 3
        },
        { 
          id: 'barcode-scanner', 
          name: t('deviceSelection.catalog.products.barcodeScanner'), 
          description: '2D/1D skener',
          monthlyFee: 6,
          companyCost: 4
        }
      ]
    }
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            {t('deviceSelection.catalog.title')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedSolutions.map((solution) => (
              <Badge key={solution} variant="secondary" className="flex items-center gap-1">
                {solutionIcons[solution as keyof typeof solutionIcons]}
                {solutionBadgeNames[solution as keyof typeof solutionBadgeNames]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <Accordion 
            type="multiple" 
            value={openGroups} 
            onValueChange={setOpenGroups}
            className="space-y-4"
          >
            {/* Hardware Groups */}
            {selectedSolutions.includes('terminal') && (
              <AccordionItem value="terminals" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold">{t('deviceSelection.catalog.deviceGroups.terminals')}</span>
                    <Badge variant="outline" className="ml-auto">
                      {availableDevices.terminal.length} {t('deviceSelection.catalog.deviceCount')}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {availableDevices.terminal.map((device) => (
                      <MinimalDeviceCatalogCard
                        key={device.id}
                        device={device}
                        onAdd={() => handleDeviceShowcase(device)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {selectedSolutions.includes('pos') && (
              <AccordionItem value="pos" className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-green-600" />
                    <span className="font-semibold">{t('deviceSelection.catalog.deviceGroups.pos')}</span>
                    <Badge variant="outline" className="ml-auto">
                      {availableDevices.pos.length} {t('deviceSelection.catalog.deviceCount')}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-2">
                    {availableDevices.pos.map((device) => (
                      <MinimalDeviceCatalogCard
                        key={device.id}
                        device={device}
                        onAdd={() => handleDeviceShowcase(device)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Service Groups */}
            {Object.entries(serviceGroups).map(([key, group]) => (
              <AccordionItem key={key} value={key} className="border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    {group.icon}
                    <span className="font-semibold">{group.title}</span>
                    <Badge variant="outline" className="ml-auto">
                      {group.items.length} {t('deviceSelection.catalog.serviceCount')}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <MinimalServiceCatalogGroup
                    services={group.items}
                    onAddService={(service) => handleServiceShowcase(service, key)}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Unified Product Modal */}
      <UnifiedProductModal
        isOpen={showcaseModal.isOpen}
        onClose={handleShowcaseClose}
        mode="add"
        productType={showcaseModal.type}
        product={showcaseModal.product}
        onSave={handleShowcaseAdd}
        businessLocations={businessLocations}
      />
    </>
  );
};

export default DeviceCatalogPanel;
