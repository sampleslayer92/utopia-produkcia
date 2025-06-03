
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Zap, CreditCard, Monitor, Globe, Smartphone } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MinimalDeviceCatalogCard from "../components/MinimalDeviceCatalogCard";
import MinimalServiceCatalogGroup from "../components/MinimalServiceCatalogGroup";

interface DeviceCatalogPanelProps {
  selectedSolutions: string[];
  onAddDevice: (deviceTemplate: any) => void;
  onAddService: (serviceTemplate: any, category: string) => void;
}

const DeviceCatalogPanel = ({ 
  selectedSolutions, 
  onAddDevice, 
  onAddService 
}: DeviceCatalogPanelProps) => {
  const [openGroups, setOpenGroups] = useState<string[]>(['terminals', 'pos', 'software']);

  const solutionIcons = {
    terminal: <CreditCard className="h-4 w-4" />,
    pos: <Monitor className="h-4 w-4" />,
    gateway: <Globe className="h-4 w-4" />,
    softpos: <Smartphone className="h-4 w-4" />,
    charging: <Zap className="h-4 w-4" />
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
        rentalPrice: 25
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
        rentalPrice: 20
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
        rentalPrice: 35
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
        rentalPrice: 45
      }
    ]
  };

  const serviceGroups = {
    software: {
      title: 'Softvérové riešenia',
      icon: <Monitor className="h-5 w-5 text-green-600" />,
      items: [
        { id: 'pos-software', name: 'POS Software', description: 'Komplexný pokladničný systém' },
        { id: 'inventory', name: 'Správa skladu', description: 'Sledovanie zásob a produktov' },
        { id: 'reporting', name: 'Reporting a analytika', description: 'Detailné reporty a štatistiky' }
      ]
    },
    technical: {
      title: 'Technické služby',
      icon: <Zap className="h-5 w-5 text-orange-600" />,
      items: [
        { id: 'installation', name: 'Inštalácia a nastavenie', description: 'Profesionálna inštalácia' },
        { id: 'training', name: 'Školenie personálu', description: 'Komplexné zaškolenie' },
        { id: 'support', name: '24/7 Technická podpora', description: 'Nepretržitá podpora' }
      ]
    },
    accessories: {
      title: 'Príslušenstvo',
      icon: <CreditCard className="h-5 w-5 text-purple-600" />,
      items: [
        { id: 'receipt-printer', name: 'Tlačiareň účteniek', description: 'Termálna tlačiareň 80mm' },
        { id: 'cash-drawer', name: 'Pokladničná zásuvka', description: 'Bezpečná kovová zásuvka' },
        { id: 'barcode-scanner', name: 'Čítačka čiarových kódov', description: '2D/1D skener' }
      ]
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b p-4">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Katalóg zariadení a služieb</h3>
        <div className="flex flex-wrap gap-2">
          {selectedSolutions.map((solution) => (
            <Badge key={solution} variant="secondary" className="flex items-center gap-1">
              {solutionIcons[solution as keyof typeof solutionIcons]}
              {solution === 'terminal' && 'Platobné terminály'}
              {solution === 'pos' && 'POS systémy'}
              {solution === 'gateway' && 'Platobná brána'}
              {solution === 'softpos' && 'SoftPOS'}
              {solution === 'charging' && 'Nabíjanie'}
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
                  <span className="font-semibold">Platobné terminály</span>
                  <Badge variant="outline" className="ml-auto">
                    {availableDevices.terminal.length} zariadení
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {availableDevices.terminal.map((device) => (
                    <MinimalDeviceCatalogCard
                      key={device.id}
                      device={device}
                      onAdd={() => onAddDevice(device)}
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
                  <span className="font-semibold">POS Tablety</span>
                  <Badge variant="outline" className="ml-auto">
                    {availableDevices.pos.length} zariadení
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  {availableDevices.pos.map((device) => (
                    <MinimalDeviceCatalogCard
                      key={device.id}
                      device={device}
                      onAdd={() => onAddDevice(device)}
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
                    {group.items.length} služieb
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <MinimalServiceCatalogGroup
                  services={group.items}
                  onAddService={(service) => onAddService(service, key)}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default DeviceCatalogPanel;
