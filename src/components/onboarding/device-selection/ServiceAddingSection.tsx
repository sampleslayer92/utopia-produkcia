
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ServiceAddingSectionProps {
  selectedSolutions: string[];
  onAddService: (serviceTemplate: any, category: string) => void;
}

const ServiceAddingSection = ({ selectedSolutions, onAddService }: ServiceAddingSectionProps) => {
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

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center gap-2">
          <span>Služby</span>
          <div className="w-full bg-slate-200 rounded-full h-2 ml-4">
            <div className="bg-blue-600 h-2 rounded-full w-3/4"></div>
          </div>
          <span className="text-sm text-slate-500 ml-2">Krok 3 z 4</span>
        </CardTitle>
        <CardDescription className="text-slate-600">
          Pridajte potrebné služby a softvér
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Softvérové licencie</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableServices.software.map((service) => (
              <Button
                key={service.id}
                variant="outline"
                onClick={() => onAddService(service, 'software')}
                className="h-auto p-3 flex flex-col items-start text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 w-full">
                  <Plus className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
                <span className="text-xs text-slate-600 mt-1">{service.description}</span>
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Príslušenstvo</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableServices.accessories.map((service) => (
              <Button
                key={service.id}
                variant="outline"
                onClick={() => onAddService(service, 'accessories')}
                className="h-auto p-3 flex flex-col items-start text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 w-full">
                  <Plus className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
                <span className="text-xs text-slate-600 mt-1">{service.description}</span>
              </Button>
            ))}
          </div>
        </div>

        {selectedSolutions.includes('gateway') && (
          <div>
            <h3 className="font-semibold mb-3">E-commerce služby</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableServices.ecommerce.map((service) => (
                <Button
                  key={service.id}
                  variant="outline"
                  onClick={() => onAddService(service, 'ecommerce')}
                  className="h-auto p-3 flex flex-col items-start text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 w-full">
                    <Plus className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium text-sm">{service.name}</span>
                  </div>
                  <span className="text-xs text-slate-600 mt-1">{service.description}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold mb-3">Technické služby</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableServices.technical.map((service) => (
              <Button
                key={service.id}
                variant="outline"
                onClick={() => onAddService(service, 'technical')}
                className="h-auto p-3 flex flex-col items-start text-left hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 w-full">
                  <Plus className="h-4 w-4 flex-shrink-0" />
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
                <span className="text-xs text-slate-600 mt-1">{service.description}</span>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceAddingSection;
