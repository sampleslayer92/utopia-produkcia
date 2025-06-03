
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Zap, CreditCard, Monitor, Globe, Smartphone } from "lucide-react";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import DeviceCatalogCard from "../components/DeviceCatalogCard";

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

  const availableServices = {
    software: [
      { id: 'pos-software', name: 'POS Software', description: 'Komplexný pokladničný systém' },
      { id: 'inventory', name: 'Správa skladu', description: 'Sledovanie zásob a produktov' },
      { id: 'reporting', name: 'Reporting a analytika', description: 'Detailné reporty a štatistiky' }
    ],
    technical: [
      { id: 'installation', name: 'Inštalácia a nastavenie', description: 'Profesionálna inštalácia' },
      { id: 'training', name: 'Školenie personálu', description: 'Komplexné zaškolenie' },
      { id: 'support', name: '24/7 Technická podpora', description: 'Nepretržitá podpora' }
    ],
    accessories: [
      { id: 'receipt-printer', name: 'Tlačiareň účteniek', description: 'Termálna tlačiareň 80mm' },
      { id: 'cash-drawer', name: 'Pokladničná zásuvka', description: 'Bezpečná kovová zásuvka' },
      { id: 'barcode-scanner', name: 'Čítačka čiarových kódov', description: '2D/1D skener' }
    ]
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Solution Types Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 pb-4 border-b">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Katalóg zariadení a služieb</h3>
          <div className="flex flex-wrap gap-2">
            {selectedSolutions.map((solution) => (
              <Badge key={solution} variant="secondary" className="flex items-center gap-1">
                {solutionIcons[solution as keyof typeof solutionIcons]}
                {solution === 'terminal' && 'Platobné terminály'}
                {solution === 'pos' && 'POS systémy'}
                {solution === 'gateway' && 'Platobná brána'}
                {solution === 'softpos' && 'SoftPOS'}
                {solution === 'charging' && 'Nabíjacie stanice'}
              </Badge>
            ))}
          </div>
        </div>

        {/* Devices Section */}
        {selectedSolutions.includes('terminal') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Platobné terminály
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDevices.terminal.map((device) => (
                <DeviceCatalogCard
                  key={device.id}
                  device={device}
                  onAdd={() => onAddDevice(device)}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {selectedSolutions.includes('pos') && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-green-600" />
                POS Tablety
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {availableDevices.pos.map((device) => (
                <DeviceCatalogCard
                  key={device.id}
                  device={device}
                  onAdd={() => onAddDevice(device)}
                />
              ))}
            </CardContent>
          </Card>
        )}

        {/* Services Section */}
        <Card>
          <CardHeader>
            <CardTitle>Softvérové riešenia</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {availableServices.software.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddService(service, 'software')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technické služby</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {availableServices.technical.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddService(service, 'technical')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Príslušenstvo</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-3">
            {availableServices.accessories.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-slate-600">{service.description}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAddService(service, 'accessories')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeviceCatalogPanel;
