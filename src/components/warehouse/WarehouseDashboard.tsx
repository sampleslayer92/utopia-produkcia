import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Target, 
  FolderOpen, 
  Tag, 
  Plus, 
  BarChart3,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWarehouseItems } from "@/hooks/useWarehouseItems";
import { useCategories } from "@/hooks/useCategories";
import { useSolutions } from "@/hooks/useSolutions";
import { OnboardingPreview } from "./OnboardingPreview";

export const WarehouseDashboard = () => {
  const navigate = useNavigate();
  const { data: items = [] } = useWarehouseItems();
  const { data: categories = [] } = useCategories();
  const { data: solutions = [] } = useSolutions();

  const stats = {
    totalItems: items.length,
    activeItems: items.filter(item => item.is_active).length,
    totalCategories: categories.length,
    activeSolutions: solutions.filter(s => s.is_active).length,
    lowStock: items.filter(item => item.current_stock && item.min_stock && item.current_stock <= item.min_stock).length
  };

  const quickActions = [
    {
      title: "Pridať položku",
      description: "Pridať novú položku do skladu",
      icon: Package,
      action: () => navigate("/admin/warehouse/add-item"),
      color: "bg-blue-500"
    },
    {
      title: "Nové riešenie", 
      description: "Vytvoriť nové riešenie",
      icon: Target,
      action: () => navigate("/admin/warehouse/solutions"),
      color: "bg-green-500"
    },
    {
      title: "Správa kategórií",
      description: "Editovať kategórie a typy",
      icon: FolderOpen,
      action: () => navigate("/admin/warehouse/categories"),
      color: "bg-purple-500"
    },
    {
      title: "Batch operácie",
      description: "Hromadné úpravy položiek",
      icon: Tag,
      action: () => navigate("/admin/warehouse/bulk"),
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">📦 Warehouse Dashboard</h1>
          <p className="text-muted-foreground">Centralizovaná správa všetkých skladových položiek</p>
        </div>
        <Button onClick={() => navigate("/admin/warehouse/add-item")} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          Pridať položku
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Celkové položky</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeItems} aktívnych
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Riešenia</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeSolutions}</div>
            <p className="text-xs text-muted-foreground">
              aktívnych riešení
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kategórie</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCategories}</div>
            <p className="text-xs text-muted-foreground">
              dostupných kategórií
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Príjem</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">€{items.reduce((sum, item) => sum + item.monthly_fee, 0).toFixed(0)}</div>
            <p className="text-xs text-muted-foreground">
              mesačný príjem
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nízke zásoby</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.lowStock}</div>
            <p className="text-xs text-muted-foreground">
              položiek pod limitom
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>🚀 Rýchle akcie</CardTitle>
          <CardDescription>Najčastejšie používané funkcie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${action.color} text-white`}>
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity and Onboarding Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📈 Posledná aktivita</CardTitle>
            <CardDescription>Nedávno pridané alebo upravené položky</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {items.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                  </div>
                  <Badge variant={item.is_active ? "default" : "secondary"}>
                    {item.is_active ? "Aktívne" : "Neaktívne"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>🎯 Top riešenia</CardTitle>
            <CardDescription>Najpoužívanejšie riešenia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {solutions.slice(0, 5).map((solution) => (
                <div key={solution.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Target className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">{solution.name}</p>
                      <p className="text-sm text-muted-foreground">{solution.subtitle}</p>
                    </div>
                  </div>
                  <Badge variant={solution.is_active ? "default" : "secondary"}>
                    {solution.is_active ? "Aktívne" : "Neaktívne"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Preview */}
      <OnboardingPreview />
    </div>
  );
};