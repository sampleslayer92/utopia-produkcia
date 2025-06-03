
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { DeviceCard } from "@/types/onboarding";

interface DeviceAddingSectionProps {
  selectedSolutions: string[];
  onAddDevice: (deviceTemplate: any) => void;
}

const DeviceAddingSection = ({ selectedSolutions, onAddDevice }: DeviceAddingSectionProps) => {
  const availableDevices = {
    terminal: [
      {
        id: 'pax-a920-pro',
        type: 'device' as const,
        category: 'terminal',
        name: 'PAX A920 PRO',
        description: 'Mobilný terminál',
        image: 'https://cdn.prod.website-files.com/66d5d36d3181175e6ea8e618/682e2fdceed81a55890e46aa_A920%20Pro%201-p-1080.png',
        specifications: [
          'Prepojenie s pokladňou: Podporované',
          'Zdroj energie: Batéria',
          'Pripojenie: SIM, WiFi, Ethernet (s dockom)',
          'Displej: Farebný dotykový',
          'Pinpad: Nie je možné pripojiť'
        ],
        count: 1,
        monthlyFee: 0,
        simCards: 0
      },
      {
        id: 'pax-a80',
        type: 'device' as const,
        category: 'terminal',
        name: 'PAX A80',
        description: 'Stacionárny terminál',
        image: 'https://cdn.prod.website-files.com/66d5d36d3181175e6ea8e618/682e303eed8f5d41b24c13ad_A80%201-p-1080.png',
        specifications: [
          'Napájanie z elektrickej siete',
          'Pripojenie: Ethernet',
          'Pinpad: Áno'
        ],
        count: 1,
        monthlyFee: 0
      }
    ],
    pos: [
      {
        id: 'tablet-10',
        type: 'device' as const,
        category: 'pos',
        name: 'Tablet 10"',
        description: 'Kompaktný tablet pre POS systém',
        specifications: [],
        count: 1,
        monthlyFee: 0
      },
      {
        id: 'tablet-15',
        type: 'device' as const,
        category: 'pos',
        name: 'Tablet 15"',
        description: 'Veľký tablet pre POS systém',
        specifications: [],
        count: 1,
        monthlyFee: 0
      },
      {
        id: 'tablet-pro-15',
        type: 'device' as const,
        category: 'pos',
        name: 'Tablet Pro 15"',
        description: 'Profesionálny tablet pre POS systém',
        specifications: [],
        count: 1,
        monthlyFee: 0
      }
    ]
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <span>Zariadenia</span>
          <div className="w-full bg-slate-200 rounded-full h-2 ml-4">
            <div className="bg-blue-600 h-2 rounded-full w-2/4"></div>
          </div>
          <span className="text-sm text-slate-500 ml-2">Krok 2 z 4</span>
        </CardTitle>
        <CardDescription className="text-slate-600">
          Pridajte potrebné zariadenia pre vaše riešenie
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {selectedSolutions.includes('terminal') && (
          <div>
            <h3 className="font-semibold mb-4 text-lg">Platobné terminály</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {availableDevices.terminal.map((device) => (
                <div key={device.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {device.image ? (
                        <img src={device.image} alt={device.name} className="w-16 h-16 object-contain" />
                      ) : (
                        <span className="text-xs text-slate-500 text-center">{device.name}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{device.name}</h4>
                      <p className="text-sm text-slate-600 mb-2">{device.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddDevice(device)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Pridať
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {selectedSolutions.includes('pos') && (
          <div>
            <h3 className="font-semibold mb-4 text-lg">Tablety</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {availableDevices.pos.map((device) => (
                <div key={device.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-slate-500 text-center">{device.name}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900">{device.name}</h4>
                      <p className="text-sm text-slate-600 mb-2">{device.description}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onAddDevice(device)}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Pridať
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceAddingSection;
