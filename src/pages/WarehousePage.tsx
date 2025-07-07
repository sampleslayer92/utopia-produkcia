import AdminLayout from "@/components/admin/AdminLayout";
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, Smartphone, Wrench, Plus, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DEVICE_CATALOG } from "@/components/onboarding/config/deviceCatalog";
import { SERVICE_CATALOG } from "@/components/onboarding/config/serviceCatalog";

const WarehousePage = () => {
  const { t } = useTranslation('admin');

  const allDevices = DEVICE_CATALOG.map(device => ({
    ...device,
    type: 'device'
  }));

  const allServices = Object.values(SERVICE_CATALOG).flatMap(categoryServices =>
    categoryServices.map(service => ({
      ...service,
      type: 'service'
    }))
  );

  const allItems = [...allDevices, ...allServices];

  return (
    <AdminLayout
      title={t('navigation.warehouse')}
      subtitle={t('warehouse.subtitle')}
    >
      <div className="space-y-6">
        {/* Header with stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('warehouse.totalItems')}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allItems.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('warehouse.devices')}</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allDevices.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t('warehouse.services')}</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allServices.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('warehouse.searchItems')}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="shrink-0">
            <Filter className="mr-2 h-4 w-4" />
            {t('common.filter')}
          </Button>
          <Button className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            {t('warehouse.addItem')}
          </Button>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">{t('warehouse.allItems')}</TabsTrigger>
            <TabsTrigger value="devices">{t('warehouse.devices')}</TabsTrigger>
            <TabsTrigger value="services">{t('warehouse.services')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allItems.map((item) => (
                <Card key={`${item.type}-${item.id}`} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant={item.type === 'device' ? 'default' : 'secondary'}>
                        {item.type === 'device' ? t('warehouse.device') : t('warehouse.service')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.monthlyFee}€/{t('common.month')}</span>
                      <Button size="sm" variant="outline">
                        {t('common.view')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allDevices.map((device) => (
                <Card key={device.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{device.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{device.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{device.monthlyFee}€/{t('common.month')}</span>
                      <Button size="sm" variant="outline">
                        {t('common.view')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="services" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allServices.map((service) => (
                <Card key={service.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{service.category}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{service.monthlyFee}€/{t('common.month')}</span>
                      <Button size="sm" variant="outline">
                        {t('common.view')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default WarehousePage;