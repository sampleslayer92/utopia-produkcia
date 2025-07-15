import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Package, 
  ArrowRight, 
  Eye, 
  Edit,
  Plus,
  Settings,
  ExternalLink
} from 'lucide-react';
import { useSolutions } from '@/hooks/useSolutions';
import { useSolutionItems } from '@/hooks/useSolutionItems';
import { useNavigate } from 'react-router-dom';
import SolutionProductManager from '@/components/admin/solutions/SolutionProductManager';

interface SolutionWorkflowProps {
  showCreateForm?: boolean;
}

export const SolutionWorkflow = ({ showCreateForm }: SolutionWorkflowProps) => {
  const navigate = useNavigate();
  const [selectedSolution, setSelectedSolution] = useState<string>('');
  const [showProductManager, setShowProductManager] = useState(false);
  
  const { data: solutions = [] } = useSolutions();
  const { data: solutionItems = [] } = useSolutionItems(selectedSolution);

  const selectedSolutionData = solutions.find(s => s.id === selectedSolution);

  if (showCreateForm) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🎯 Vytvoriť nové riešenie</CardTitle>
          <CardDescription>
            Vytvorte nové riešenie a priraďte k nemu produkty
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Formulár na vytvorenie riešenia bude implementovaný v ďalšej verzii.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (showProductManager && selectedSolution) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">🎯 Správa produktov riešenia</h2>
            <p className="text-muted-foreground">
              {selectedSolutionData?.name} - priraďovanie produktov
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowProductManager(false)}
          >
            Späť na prehľad
          </Button>
        </div>
        <SolutionProductManager solutionId={selectedSolution} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">🎯 Správa riešení</h2>
          <p className="text-muted-foreground">
            Spravujte riešenia a priraďujte k nim produkty z skladu
          </p>
        </div>
        <Button onClick={() => navigate('/admin/solutions')}>
          <Plus className="h-4 w-4 mr-2" />
          Nové riešenie
        </Button>
      </div>

      {/* Solutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {solutions.map((solution) => {
          const itemCount = solutionItems.filter(item => item.solution_id === solution.id).length;
          
          return (
            <Card 
              key={solution.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedSolution === solution.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedSolution(solution.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: solution.color || '#3B82F6' }}
                    />
                    <CardTitle className="text-lg">{solution.name}</CardTitle>
                  </div>
                  <Badge variant={solution.is_active ? "default" : "secondary"}>
                    {solution.is_active ? 'Aktívne' : 'Neaktívne'}
                  </Badge>
                </div>
                <CardDescription>{solution.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {solution.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span>{itemCount} produktov</span>
                    </div>
                    <span className="text-muted-foreground">
                      Pozícia: {solution.position}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/onboarding');
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Náhľad
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSolution(solution.id);
                        setShowProductManager(true);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Produkty
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Solution Details */}
      {selectedSolution && selectedSolutionData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>Detail riešenia: {selectedSolutionData.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Solution Info */}
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Základné informácie</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Názov:</span>
                      <span>{selectedSolutionData.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Podtitul:</span>
                      <span>{selectedSolutionData.subtitle}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant={selectedSolutionData.is_active ? "default" : "secondary"}>
                        {selectedSolutionData.is_active ? 'Aktívne' : 'Neaktívne'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Pozícia:</span>
                      <span>{selectedSolutionData.position}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Popis</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedSolutionData.description || 'Bez popisu'}
                  </p>
                </div>
              </div>

              {/* Assigned Products */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Priradené produkty ({solutionItems.length})</h4>
                  <Button 
                    size="sm"
                    onClick={() => setShowProductManager(true)}
                  >
                    <Settings className="h-4 w-4 mr-1" />
                    Spravovať
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {solutionItems.length > 0 ? (
                    solutionItems.map((item) => (
                      <div 
                        key={item.id} 
                        className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.warehouse_item?.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.is_featured && (
                            <Badge variant="outline" className="text-xs">
                              Odporúčané
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Pozícia: {item.position}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Žiadne produkty nie sú priradené
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/onboarding')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Otestovať v onboardingu
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/admin/solutions')}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editovať riešenie
                </Button>
                <Button onClick={() => setShowProductManager(true)}>
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Spravovať produkty
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};