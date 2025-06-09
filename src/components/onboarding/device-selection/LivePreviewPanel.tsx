
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calculator, ShoppingCart, Package, Wrench, Edit } from "lucide-react";
import { DeviceCard, ServiceCard } from "@/types/onboarding";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

interface LivePreviewPanelProps {
  dynamicCards: Array<DeviceCard | ServiceCard>;
  onUpdateCard: (cardId: string, updatedCard: DeviceCard | ServiceCard) => void;
  onRemoveCard: (cardId: string) => void;
  onClearAll: () => void;
  onEditCard: (card: DeviceCard | ServiceCard) => void;
}

const LivePreviewPanel = ({ 
  dynamicCards, 
  onUpdateCard, 
  onRemoveCard,
  onClearAll,
  onEditCard
}: LivePreviewPanelProps) => {
  const { t } = useTranslation('forms');
  const deviceCards = dynamicCards.filter(card => card.type === 'device') as DeviceCard[];
  const serviceCards = dynamicCards.filter(card => card.type === 'service') as ServiceCard[];
  
  // Group services by category
  const servicesByCategory = serviceCards.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, ServiceCard[]>);

  const totalDevices = deviceCards.reduce((sum, card) => sum + card.count, 0);
  const totalServices = serviceCards.reduce((sum, card) => sum + card.count, 0);
  const totalMonthlyFee = dynamicCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0);
  const totalYearlyFee = totalMonthlyFee * 12;

  const categoryIcons = {
    software: <Package className="h-4 w-4" />,
    technical: <Wrench className="h-4 w-4" />,
    accessories: <ShoppingCart className="h-4 w-4" />
  };

  const formatCurrencyWithColor = (amount: number) => {
    const formatted = `${amount.toFixed(2)} €`;
    if (amount === 0) return { value: formatted, className: 'text-slate-500' };
    if (amount > 0) return { value: formatted, className: 'text-green-600' };
    return { value: formatted, className: 'text-red-600' };
  };

  if (dynamicCards.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-sm">
          <ShoppingCart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-600 mb-2">
            {t('deviceSelection.preview.emptyTitle')}
          </h3>
          <p className="text-slate-500 text-sm">
            {t('deviceSelection.preview.emptyDescription')}
          </p>
        </div>
      </div>
    );
  }

  const renderDeviceCard = (card: DeviceCard) => (
    <Card key={card.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {card.image ? (
              <img 
                src={card.image} 
                alt={card.name} 
                className="w-10 h-10 object-contain" 
              />
            ) : (
              <Package className="h-6 w-6 text-slate-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-slate-900 text-sm">{card.name}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{card.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {t('deviceSelection.cards.count', { count: card.count })}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-blue-600 border-blue-300">
                    {t('deviceSelection.cards.monthlyFee', { amount: (card.count * card.monthlyFee).toFixed(2) })}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCard(card)}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCard(card.id)}
                  className="h-6 w-6 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderServiceCard = (card: ServiceCard) => (
    <Card key={card.id} className="border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center shrink-0">
            <Wrench className="h-6 w-6 text-green-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-medium text-slate-900 text-sm">{card.name}</h4>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{card.description}</p>
                {card.customValue && (
                  <p className="text-xs text-slate-500 mt-1 italic">"{card.customValue}"</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    {t('deviceSelection.cards.count', { count: card.count })}
                  </Badge>
                  <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                    {t('deviceSelection.cards.monthlyFee', { amount: (card.count * card.monthlyFee).toFixed(2) })}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditCard(card)}
                  className="h-6 w-6 p-0 hover:bg-blue-50"
                >
                  <Edit className="h-3 w-3 text-blue-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCard(card.id)}
                  className="h-6 w-6 p-0 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3 text-red-500" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Header with Summary */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {t('deviceSelection.preview.title')}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            {t('deviceSelection.preview.clearAll')}
          </Button>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalDevices}</div>
            <div className="text-xs text-slate-500">{t('deviceSelection.preview.stats.devices')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalServices}</div>
            <div className="text-xs text-slate-500">{t('deviceSelection.preview.stats.services')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{dynamicCards.length}</div>
            <div className="text-xs text-slate-500">{t('deviceSelection.preview.stats.totalItems')}</div>
          </div>
        </div>

        {/* Cost Summary */}
        <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-800">
                  {t('deviceSelection.preview.costSummary.title')}
                </span>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {t('deviceSelection.preview.costSummary.monthly', { amount: totalMonthlyFee.toFixed(2) })}
                </div>
                <div className="text-sm text-emerald-700">
                  {t('deviceSelection.preview.costSummary.yearly', { amount: totalYearlyFee.toFixed(2) })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <Accordion type="multiple" defaultValue={["devices", "software", "technical", "accessories"]} className="space-y-4">
          {/* Devices Section */}
          {deviceCards.length > 0 && (
            <AccordionItem value="devices" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <h4 className="font-semibold text-slate-900">{t('deviceSelection.preview.sections.devices')}</h4>
                  <Badge variant="secondary">{deviceCards.length} {t('deviceSelection.preview.types')}</Badge>
                  <Badge variant="outline" className="text-blue-600 border-blue-300 ml-auto">
                    {deviceCards.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €{t('deviceSelection.cards.perMonth')}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 mt-4">
                  {deviceCards.map(renderDeviceCard)}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Service Categories */}
          {Object.entries(servicesByCategory).map(([category, services]) => (
            <AccordionItem key={category} value={category} className="border rounded-lg">
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex items-center gap-2">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                  <h4 className="font-semibold text-slate-900">
                    {t(`deviceSelection.preview.categoryNames.${category}`)}
                  </h4>
                  <Badge variant="secondary">{services.length} {t('deviceSelection.preview.types')}</Badge>
                  <Badge variant="outline" className="text-green-600 border-green-300 ml-auto">
                    {services.reduce((sum, card) => sum + (card.count * card.monthlyFee), 0).toFixed(2)} €{t('deviceSelection.cards.perMonth')}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3 mt-4">
                  {services.map(renderServiceCard)}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default LivePreviewPanel;
