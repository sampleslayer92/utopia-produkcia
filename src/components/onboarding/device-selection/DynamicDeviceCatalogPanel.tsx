import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MinimalDeviceCatalogCard from "../components/MinimalDeviceCatalogCard";
import MinimalServiceCatalogGroup from "../components/MinimalServiceCatalogGroup";

import { BusinessLocation } from "@/types/business";
import { useTranslation } from "react-i18next";

import { useSolutionProducts } from "@/hooks/useSolutionItems";
import { useCategories } from "@/hooks/useCategories";
import { useItemTypes } from "@/hooks/useItemTypes";
import { useSolutions } from "@/hooks/useSolutions";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface DynamicDeviceCatalogPanelProps {
  selectedSolutions: string[];
  onAddDevice: (deviceTemplate: any) => void;
  onAddService: (serviceTemplate: any, category: string) => void;
  businessLocations: BusinessLocation[];
}

const DynamicDeviceCatalogPanel = ({ 
  selectedSolutions, 
  onAddDevice, 
  onAddService,
  businessLocations
}: DynamicDeviceCatalogPanelProps) => {
  const { t } = useTranslation('forms');
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  // Fetch dynamic data
  const { data: solutions, isLoading: solutionsLoading } = useSolutions(true);
  const { data: solutionProducts, isLoading: productsLoading } = useSolutionProducts(selectedSolutions);
  const { data: categories, isLoading: categoriesLoading } = useCategories(true);
  const { data: itemTypes, isLoading: typesLoading } = useItemTypes(true);

  const isLoading = solutionsLoading || productsLoading || categoriesLoading || typesLoading;


  // Get solution badges
  const getSolutionBadges = () => {
    if (!solutions) return [];
    return selectedSolutions.map(solutionId => {
      const solution = solutions.find(s => s.id === solutionId);
      return solution ? {
        id: solution.id,
        name: solution.name,
        color: solution.color || '#3B82F6'
      } : null;
    }).filter(Boolean);
  };

  // Group products by item type and category
  const getGroupedProducts = () => {
    if (!solutionProducts || !categories || !itemTypes) return {};
    
    const grouped: { [typeSlug: string]: { [categorySlug: string]: any[] } } = {};
    
    solutionProducts.forEach(item => {
      const warehouseItem = item.warehouse_item;
      if (!warehouseItem || !warehouseItem.is_active) return;
      
      const itemType = itemTypes.find(t => t.id === warehouseItem.item_type_id);
      const category = categories.find(c => c.id === warehouseItem.category_id);
      
      if (!itemType || !category) return;
      
      if (!grouped[itemType.slug]) {
        grouped[itemType.slug] = {};
      }
      if (!grouped[itemType.slug][category.slug]) {
        grouped[itemType.slug][category.slug] = [];
      }
      
      grouped[itemType.slug][category.slug].push({
        ...warehouseItem,
        is_featured: item.is_featured,
        type: itemType.slug === 'device' ? 'device' : 'service',
        category: category.slug
      });
    });
    
    return grouped;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const groupedProducts = getGroupedProducts();
  const solutionBadges = getSolutionBadges();

  return (
    <div className="h-full flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b p-4">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            {t('deviceSelection.catalog.title')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {solutionBadges.map((solution) => (
              <Badge 
                key={solution.id} 
                variant="secondary" 
                className="flex items-center gap-1"
                style={{ backgroundColor: `${solution.color}20`, color: solution.color }}
              >
                {solution.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {Object.keys(groupedProducts).length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Žiadne produkty</h3>
              <p className="text-muted-foreground">
                Pre vybrané riešenia nie sú dostupné žiadne produkty.
              </p>
            </div>
          ) : (
            <Tabs defaultValue={Object.keys(groupedProducts)[0]} className="w-full">
              <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${Object.keys(groupedProducts).length}, 1fr)` }}>
                {Object.keys(groupedProducts).map(typeSlug => {
                  const itemType = itemTypes?.find(t => t.slug === typeSlug);
                  return (
                    <TabsTrigger key={typeSlug} value={typeSlug}>
                      {itemType?.name || typeSlug}
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.entries(groupedProducts).map(([typeSlug, categoriesData]) => {
                const itemType = itemTypes?.find(t => t.slug === typeSlug);
                return (
                  <TabsContent key={typeSlug} value={typeSlug}>
                    <Accordion 
                      type="multiple" 
                      value={openGroups} 
                      onValueChange={setOpenGroups}
                      className="space-y-4"
                    >
                      {Object.entries(categoriesData).map(([categorySlug, products]) => {
                        const category = categories?.find(c => c.slug === categorySlug);
                        const isDevice = typeSlug === 'device';
                        
                        return (
                          <AccordionItem key={categorySlug} value={categorySlug} className="border rounded-lg">
                            <AccordionTrigger className="px-4 py-3 hover:no-underline">
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-5 h-5 rounded flex items-center justify-center text-white text-xs"
                                  style={{ backgroundColor: category?.color || '#3B82F6' }}
                                >
                                  {category?.icon_name?.charAt(0)?.toUpperCase() || 'P'}
                                </div>
                                <span className="font-semibold">{category?.name || categorySlug}</span>
                                <Badge variant="outline" className="ml-auto">
                                  {products.length} {isDevice ? 'zariadení' : 'služieb'}
                                </Badge>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4">
                              {isDevice ? (
                                <div className="space-y-2">
                                  {products.map((device) => (
                                    <MinimalDeviceCatalogCard
                                      key={device.id}
                                      device={device}
                                      onAdd={() => onAddDevice(device)}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <MinimalServiceCatalogGroup
                                  services={products}
                                  onAddService={(service) => onAddService(service, categorySlug)}
                                />
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </div>
  );
};

export default DynamicDeviceCatalogPanel;