
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, CreditCard, Monitor, Globe, Smartphone, Zap } from "lucide-react";
import { OnboardingData, DeviceCard, ServiceCard } from "@/types/onboarding";
import SolutionSelectionCard from "./components/SolutionSelectionCard";
import DynamicDeviceCard from "./components/DynamicDeviceCard";
import DynamicServiceCard from "./components/DynamicServiceCard";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData }: DeviceSelectionStepProps) => {
  const [showDynamicSection, setShowDynamicSection] = useState(false);

  const solutionTypes = [
    {
      id: 'terminal',
      title: 'Platobný terminál',
      description: 'Klasické platobné terminály pre prijímanie kariet',
      icon: <CreditCard className="h-8 w-8 text-blue-600" />
    },
    {
      id: 'pos',
      title: 'Pokladničné riešenie',
      description: 'Komplexné POS systémy s tabletmi',
      icon: <Monitor className="h-8 w-8 text-green-600" />
    },
    {
      id: 'gateway',
      title: 'Platobná brána',
      description: 'Online platby pre e-commerce',
      icon: <Globe className="h-8 w-8 text-purple-600" />
    },
    {
      id: 'softpos',
      title: 'Terminál v mobile (SoftPOS)',
      description: 'Mobilné aplikácie pre platby',
      icon: <Smartphone className="h-8 w-8 text-orange-600" />
    },
    {
      id: 'charging',
      title: 'Nabíjacia stanica',
      description: 'Riešenia pre elektromobily',
      icon: <Zap className="h-8 w-8 text-yellow-600" />
    }
  ];

  const availableDevices = {
    terminal: [
      {
        id: 'pax-a920-pro',
        type: 'device' as const,
        category: 'terminal',
        name: 'PAX A920 PRO',
        description: 'Mobilný terminál',
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

  const availableServices = {
    software: [
      { id: 'vrp', name: 'VRP', description: 'Softvérové riešenie VRP' },
      { id: 'vrp-driver', name: 'VRP DRIVER', description: 'Driver pre VRP systém' },
      { id: 'easy-kasa', name: 'EASY KASA', description: 'Jednoduchý kasový systém' },
      { id: '3k-pos', name: '3K POS LICENCIA', description: 'Licencia pre 3K POS systém' },
      { id: 'chdu', name: 'CHDÚ', description: 'Centrálna hospodárska dátová úložba' },
      { id: 'other-software', name: 'Iný', description: 'Iné softvérové riešenie' }
    ],
    accessories: [
      { id: 'sim-card', name: 'SIM karta', description: 'SIM karta pre mobilné pripojenie' },
      { id: 'receipt-printer', name: 'Bonovacia tlačiareň', description: 'Tlačiareň pre účtenky' },
      { id: 'dock-charging', name: 'Dokovacia stanica (len nabíjanie)', description: 'Základná dokovacia stanica' },
      { id: 'dock-full', name: 'Dokovacia stanica + periférie', description: 'Kompletná dokovacia stanica' },
      { id: 'pax-cover', name: 'Kryt PAX', description: 'Ochranný kryt pre PAX terminál' },
      { id: 'router', name: 'Router ASUS', description: 'Sieťový router' },
      { id: 'cash-drawer-small', name: 'Peňažná zásuvka – malá', description: 'Malá peňažná zásuvka' },
      { id: 'cash-drawer-large', name: 'Peňažná zásuvka – veľká', description: 'Veľká peňažná zásuvka' },
      { id: 'portos-chdu', name: 'PORTOS CHDÚ', description: 'PORTOS centrálna hospodárska dátová úložba' },
      { id: 'portos-printer', name: 'PORTOS tlačiareň', description: 'PORTOS tlačiareň' }
    ],
    ecommerce: [
      { id: 'gp-webpay', name: 'GP WebPay', description: 'Online platobná brána GP WebPay' },
      { id: 'gp-tom', name: 'GP TOM', description: 'GP TOM riešenie' },
      { id: 'other-ecommerce', name: 'Iné', description: 'Iné e-commerce riešenie' }
    ],
    technical: [
      { id: 'install-remote', name: 'Inštalácia na diaľku', description: 'Vzdialená inštalácia systému' },
      { id: 'install-onsite', name: 'Inštalácia osobne', description: 'Osobná inštalácia na mieste' },
      { id: 'training-remote', name: 'Zaškolenie na diaľku', description: 'Vzdialené zaškolenie' },
      { id: 'training-onsite', name: 'Zaškolenie osobne', description: 'Osobné zaškolenie na mieste' },
      { id: 'import-plu', name: 'Import PLU', description: 'Import databázy produktov' },
      { id: 'software-integration', name: 'Prepojenie na software', description: 'Integrácia s existujúcim softvérom' },
      { id: 'phone-support', name: 'Telefónická podpora večer + víkendy', description: 'Rozšírená telefonická podpora' }
    ]
  };

  const toggleSolution = (solutionId: string) => {
    const newSelection = data.deviceSelection.selectedSolutions.includes(solutionId)
      ? data.deviceSelection.selectedSolutions.filter(id => id !== solutionId)
      : [...data.deviceSelection.selectedSolutions, solutionId];
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        selectedSolutions: newSelection
      }
    });
  };

  const addDevice = (deviceTemplate: any) => {
    const newDevice: DeviceCard = {
      ...deviceTemplate,
      id: `${deviceTemplate.id}-${Date.now()}`
    };
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: [...data.deviceSelection.dynamicCards, newDevice]
      }
    });
  };

  const addService = (serviceTemplate: any, category: string) => {
    const newService: ServiceCard = {
      id: `${serviceTemplate.id}-${Date.now()}`,
      type: 'service',
      category,
      name: serviceTemplate.name,
      description: serviceTemplate.description,
      count: 1,
      monthlyFee: 0,
      customValue: serviceTemplate.name === 'Iný' ? '' : undefined
    };
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: [...data.deviceSelection.dynamicCards, newService]
      }
    });
  };

  const updateCard = (cardId: string, updatedCard: DeviceCard | ServiceCard) => {
    const updatedCards = data.deviceSelection.dynamicCards.map(card =>
      card.id === cardId ? updatedCard : card
    );
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: updatedCards
      }
    });
  };

  const removeCard = (cardId: string) => {
    const updatedCards = data.deviceSelection.dynamicCards.filter(card => card.id !== cardId);
    
    updateData({
      deviceSelection: {
        ...data.deviceSelection,
        dynamicCards: updatedCards
      }
    });
  };

  const handleNextStep = () => {
    if (data.deviceSelection.selectedSolutions.length > 0) {
      setShowDynamicSection(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Krok 1 - Výber riešenia */}
      {!showDynamicSection && (
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">Výber riešenia</CardTitle>
            <CardDescription className="text-slate-600">
              Vyberte typy riešení, ktoré chcete používať vo vašom podnikaní
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {solutionTypes.map((solution) => (
                <SolutionSelectionCard
                  key={solution.id}
                  title={solution.title}
                  description={solution.description}
                  icon={solution.icon}
                  isSelected={data.deviceSelection.selectedSolutions.includes(solution.id)}
                  onClick={() => toggleSolution(solution.id)}
                />
              ))}
            </div>
            
            {data.deviceSelection.selectedSolutions.length > 0 && (
              <div className="text-center">
                <Button 
                  onClick={handleNextStep}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Ďalší krok - Výber zariadení a služieb
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Krok 2 - Dynamické pridávanie zariadení a služieb */}
      {showDynamicSection && (
        <>
          {/* Zariadenia */}
          {(data.deviceSelection.selectedSolutions.includes('terminal') || 
            data.deviceSelection.selectedSolutions.includes('pos')) && (
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Zariadenia</CardTitle>
                <CardDescription className="text-slate-600">
                  Pridajte potrebné zariadenia pre vaše riešenie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.deviceSelection.selectedSolutions.includes('terminal') && (
                  <div>
                    <h3 className="font-semibold mb-3">Platobné terminály</h3>
                    <div className="flex gap-2 mb-4">
                      {availableDevices.terminal.map((device) => (
                        <Button
                          key={device.id}
                          variant="outline"
                          onClick={() => addDevice(device)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          {device.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                {data.deviceSelection.selectedSolutions.includes('pos') && (
                  <div>
                    <h3 className="font-semibold mb-3">Tablety</h3>
                    <div className="flex gap-2 mb-4">
                      {availableDevices.pos.map((device) => (
                        <Button
                          key={device.id}
                          variant="outline"
                          onClick={() => addDevice(device)}
                          className="flex items-center gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          {device.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Služby */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Služby</CardTitle>
              <CardDescription className="text-slate-600">
                Pridajte potrebné služby a softvér
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Softvér */}
              <div>
                <h3 className="font-semibold mb-3">Softvérové licencie</h3>
                <div className="flex flex-wrap gap-2">
                  {availableServices.software.map((service) => (
                    <Button
                      key={service.id}
                      variant="outline"
                      onClick={() => addService(service, 'software')}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {service.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Príslušenstvo */}
              <div>
                <h3 className="font-semibold mb-3">Príslušenstvo</h3>
                <div className="flex flex-wrap gap-2">
                  {availableServices.accessories.map((service) => (
                    <Button
                      key={service.id}
                      variant="outline"
                      onClick={() => addService(service, 'accessories')}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {service.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* E-commerce */}
              {data.deviceSelection.selectedSolutions.includes('gateway') && (
                <div>
                  <h3 className="font-semibold mb-3">E-commerce služby</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableServices.ecommerce.map((service) => (
                      <Button
                        key={service.id}
                        variant="outline"
                        onClick={() => addService(service, 'ecommerce')}
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        {service.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Technické služby */}
              <div>
                <h3 className="font-semibold mb-3">Technické služby</h3>
                <div className="flex flex-wrap gap-2">
                  {availableServices.technical.map((service) => (
                    <Button
                      key={service.id}
                      variant="outline"
                      onClick={() => addService(service, 'technical')}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {service.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vybrané zariadenia a služby */}
          {data.deviceSelection.dynamicCards.length > 0 && (
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-slate-900">Vybrané zariadenia a služby</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.deviceSelection.dynamicCards.map((card) => (
                    <div key={card.id}>
                      {card.type === 'device' ? (
                        <DynamicDeviceCard
                          device={card}
                          onUpdate={(updatedCard) => updateCard(card.id, updatedCard)}
                          onRemove={() => removeCard(card.id)}
                        />
                      ) : (
                        <DynamicServiceCard
                          service={card}
                          onUpdate={(updatedCard) => updateCard(card.id, updatedCard)}
                          onRemove={() => removeCard(card.id)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Poznámka */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Poznámka</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="note">Dodatočné poznámky</Label>
                <Textarea
                  id="note"
                  placeholder="Dodatočné poznámky k výberu zariadení a služieb..."
                  value={data.deviceSelection.note}
                  onChange={(e) => updateData({
                    deviceSelection: {
                      ...data.deviceSelection,
                      note: e.target.value
                    }
                  })}
                  rows={3}
                  className="border-slate-300 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Návrat na výber riešenia */}
          <div className="text-center">
            <Button 
              variant="outline"
              onClick={() => setShowDynamicSection(false)}
            >
              Zmeniť výber riešenia
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceSelectionStep;
