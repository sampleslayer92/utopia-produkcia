import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ExternalLink, 
  RefreshCw, 
  Eye, 
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';
import { useSolutions } from '@/hooks/useSolutions';
import { useSolutionItems } from '@/hooks/useSolutionItems';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const OnboardingPreview = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  
  const { data: solutions = [], refetch: refetchSolutions } = useSolutions();
  const activeSolutions = solutions.filter(s => s.is_active);

  const refreshPreview = async () => {
    setIsRefreshing(true);
    try {
      await refetchSolutions();
      setLastUpdate(new Date());
      toast.success('Náhľad onboardingu bol aktualizovaný');
    } catch (error) {
      toast.error('Chyba pri aktualizácii náhľadu');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh when solutions change
  useEffect(() => {
    setLastUpdate(new Date());
  }, [solutions]);

  const openOnboarding = () => {
    // Open in new tab to preserve admin context
    window.open('/onboarding', '_blank');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-primary" />
              <span>Náhľad Onboarding</span>
            </CardTitle>
            <CardDescription>
              Skontrolujte ako vyzerajú vaše riešenia v onboardingu
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={refreshPreview}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              Obnoviť
            </Button>
            <Button onClick={openOnboarding}>
              <ExternalLink className="h-4 w-4 mr-1" />
              Otvoriť onboarding
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Info */}
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="h-4 w-4 text-blue-500" />
            <span className="text-sm">
              Posledná aktualizácia: {lastUpdate.toLocaleTimeString('sk-SK')}
            </span>
          </div>
          <Badge variant="outline">
            {activeSolutions.length} aktívnych riešení
          </Badge>
        </div>

        {/* Solutions Preview */}
        <div className="space-y-3">
          <h4 className="font-medium">Riešenia v onboardingu:</h4>
          
          {activeSolutions.length > 0 ? (
            <div className="space-y-2">
              {activeSolutions
                .sort((a, b) => a.position - b.position)
                .map((solution) => (
                  <SolutionPreviewItem key={solution.id} solution={solution} />
                ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-muted/50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Žiadne aktívne riešenia pre onboarding
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => navigate('/admin/warehouse/solutions')}
              >
                Aktivovať riešenia
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Zmeny sa prejavia okamžite v onboardingu
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/admin/warehouse/solutions')}
            >
              Upraviť riešenia
            </Button>
            <Button 
              size="sm"
              onClick={openOnboarding}
            >
              Testovať teraz
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface SolutionPreviewItemProps {
  solution: any;
}

const SolutionPreviewItem = ({ solution }: SolutionPreviewItemProps) => {
  const { data: solutionItems = [] } = useSolutionItems(solution.id);
  const productCount = solutionItems.length;
  const featuredCount = solutionItems.filter(item => item.is_featured).length;

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: solution.color || '#3B82F6' }}
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">{solution.name}</span>
            <Badge variant="outline" className="text-xs">
              Pozícia {solution.position}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{solution.subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="text-right">
          <div className="text-xs text-muted-foreground">
            {productCount} produktov
          </div>
          {featuredCount > 0 && (
            <div className="text-xs text-amber-600">
              {featuredCount} odporúčaných
            </div>
          )}
        </div>
        
        {productCount > 0 ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-amber-500" />
        )}
      </div>
    </div>
  );
};