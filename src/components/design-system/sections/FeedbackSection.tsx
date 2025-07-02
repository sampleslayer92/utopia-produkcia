import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle, Info, X, Bell } from "lucide-react";

const FeedbackSection = () => {
  const { toast } = useToast();

  const showToast = (type: string) => {
    switch (type) {
      case 'success':
        toast({
          title: "Úspech!",
          description: "Operácia bola úspešne dokončená.",
        });
        break;
      case 'error':
        toast({
          title: "Chyba!",
          description: "Niečo sa pokazilo. Skúste to znova.",
          variant: "destructive",
        });
        break;
      case 'info':
        toast({
          title: "Informácia",
          description: "Toto je informatívna správa.",
        });
        break;
    }
  };

  const badges = [
    { variant: 'default', label: 'Default', description: 'Základný badge' },
    { variant: 'secondary', label: 'Secondary', description: 'Sekundárny badge' },
    { variant: 'destructive', label: 'Destructive', description: 'Chybový badge' },
    { variant: 'outline', label: 'Outline', description: 'Outline badge' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Feedback Components</h1>
        <p className="text-slate-600 mb-6">
          Komponenty pre poskytovanie spätnej väzby používateľom.
        </p>
      </div>

      {/* Toast Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 mb-4">
              Toast notifikácie pre rýchle informovanie používateľa o výsledku akcií.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => showToast('success')}
                className="bg-green-600 hover:bg-green-700"
              >
                Success Toast
              </Button>
              <Button 
                onClick={() => showToast('error')}
                variant="destructive"
              >
                Error Toast
              </Button>
              <Button 
                onClick={() => showToast('info')}
                variant="outline"
              >
                Info Toast
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Components */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Informácia</AlertTitle>
              <AlertDescription>
                Toto je základná informatívna správa pre používateľa.
              </AlertDescription>
            </Alert>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-800">Upozornenie</AlertTitle>
              <AlertDescription className="text-yellow-700">
                Táto akcia môže mať vplyv na vaše údaje. Pokračujte opatrne.
              </AlertDescription>
            </Alert>

            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Úspech</AlertTitle>
              <AlertDescription className="text-green-700">
                Vaša akcia bola úspešne dokončená.
              </AlertDescription>
            </Alert>

            <Alert variant="destructive">
              <X className="h-4 w-4" />
              <AlertTitle>Chyba</AlertTitle>
              <AlertDescription>
                Vyskytla sa chyba pri spracovaní vašej požiadavky.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Badge Components */}
      <Card>
        <CardHeader>
          <CardTitle>Badge Components</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div key={badge.variant} className="text-center space-y-2">
                  <Badge variant={badge.variant as any}>
                    {badge.label}
                  </Badge>
                  <p className="text-xs text-slate-600">{badge.description}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Status Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                  Aktívny
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                  Čakajúci
                </Badge>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                  Dokončený
                </Badge>
                <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
                  Zrušený
                </Badge>
                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                  Archivovaný
                </Badge>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-3">Count Badges</h4>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Bell className="h-6 w-6 text-slate-600" />
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    3
                  </Badge>
                </div>
                <div className="relative">
                  <Button variant="outline">
                    Správy
                    <Badge className="ml-2 bg-primary text-primary-foreground">
                      12
                    </Badge>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Príklady použitia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Toast použitie</h4>
              <pre className="text-xs text-slate-700 overflow-x-auto">
{`import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

toast({
  title: "Úspech!",
  description: "Údaje boli uložené.",
  variant: "default" // "destructive" pre chyby
});`}
              </pre>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Alert použitie</h4>
              <pre className="text-xs text-slate-700 overflow-x-auto">
{`<Alert variant="destructive">
  <AlertTriangle className="h-4 w-4" />
  <AlertTitle>Chyba</AlertTitle>
  <AlertDescription>
    Popis chyby
  </AlertDescription>
</Alert>`}
              </pre>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Badge použitie</h4>
              <pre className="text-xs text-slate-700 overflow-x-auto">
{`<Badge variant="secondary">
  Status
</Badge>

<Badge className="bg-green-100 text-green-800">
  Custom Badge
</Badge>`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSection;