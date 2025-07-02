import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { NavigationMenu, NavigationMenuContent, NavigationMenuIndicator, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Settings, User, FileText, ChevronRight } from "lucide-react";

const NavigationSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Navigation Components</h1>
        <p className="text-slate-600 mb-6">
          Navigačné komponenty pre orientáciu v aplikácii.
        </p>
      </div>

      {/* Breadcrumbs */}
      <Card>
        <CardHeader>
          <CardTitle>Breadcrumbs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Contracts</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-2">Overview Content</h3>
                <p className="text-sm text-slate-600">Dashboard overview content here.</p>
              </div>
            </TabsContent>
            <TabsContent value="analytics" className="mt-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h3 className="font-semibold mb-2">Analytics Content</h3>
                <p className="text-sm text-slate-600">Analytics and metrics content here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Sidebar Navigation */}
      <Card>
        <CardHeader>
          <CardTitle>Sidebar Navigation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex bg-slate-50 rounded-lg p-4 min-h-[300px]">
            <nav className="w-64 space-y-2">
              {[
                { icon: Home, label: 'Dashboard', active: true },
                { icon: User, label: 'Profile', active: false },
                { icon: FileText, label: 'Documents', active: false },
                { icon: Settings, label: 'Settings', active: false },
              ].map((item) => (
                <Button
                  key={item.label}
                  variant={item.active ? "default" : "ghost"}
                  className="w-full justify-start"
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </nav>
            <div className="flex-1 ml-6 p-4 bg-white rounded border">
              <h3 className="font-semibold mb-2">Main Content</h3>
              <p className="text-sm text-slate-600">Content area for selected navigation item.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NavigationSection;