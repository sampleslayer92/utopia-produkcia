import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useSolutions, useUpdateSolution, useDeleteSolution } from '@/hooks/useSolutions';
import SolutionEditor from '@/components/admin/solutions/SolutionEditor';
import LoadingSpinner from '@/components/ui/loading-spinner';

const SolutionsPage = () => {
  const { t } = useTranslation('admin');
  const [editingSolution, setEditingSolution] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: solutions, isLoading } = useSolutions();
  const updateSolution = useUpdateSolution();
  const deleteSolution = useDeleteSolution();

  const handleToggleActive = (id: string, isActive: boolean) => {
    updateSolution.mutate({ id, is_active: !isActive });
  };

  const handleDelete = (id: string) => {
    if (confirm('Naozaj chcete vymazať toto riešenie? Táto akcia je nezvratná.')) {
      deleteSolution.mutate(id);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingSolution(null);
  };

  const handleEdit = (id: string) => {
    setEditingSolution(id);
    setIsCreating(false);
  };

  const handleClose = () => {
    setEditingSolution(null);
    setIsCreating(false);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Riešenia" subtitle="Správa platobných riešení">
        <LoadingSpinner />
      </AdminLayout>
    );
  }

  if (isCreating || editingSolution) {
    return (
      <AdminLayout 
        title={isCreating ? "Nové riešenie" : "Upraviť riešenie"}
        subtitle={isCreating ? "Vytvorenie nového platobného riešenia" : "Úprava existujúceho riešenia"}
      >
        <SolutionEditor
          solutionId={editingSolution || undefined}
          onClose={handleClose}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Riešenia" 
      subtitle="Správa platobných riešení pre onboarding"
      actions={
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nové riešenie
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Solutions Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {solutions?.map((solution) => (
            <Card key={solution.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: solution.color }}
                    >
                      {solution.icon_name && (
                        <span className="text-lg">💳</span>
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{solution.name}</CardTitle>
                      {solution.subtitle && (
                        <CardDescription>{solution.subtitle}</CardDescription>
                      )}
                    </div>
                  </div>
                  <Badge variant={solution.is_active ? "default" : "secondary"}>
                    {solution.is_active ? "Aktívne" : "Neaktívne"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  {solution.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={solution.is_active}
                      onCheckedChange={() => handleToggleActive(solution.id, solution.is_active)}
                      disabled={updateSolution.isPending}
                    />
                    <span className="text-sm text-muted-foreground">
                      {solution.is_active ? 'Zobraziť' : 'Skryť'}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(solution.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(solution.id)}
                      disabled={deleteSolution.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!solutions || solutions.length === 0) && (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-muted-foreground">
                <p className="text-lg mb-2">Zatiaľ nemáte žiadne riešenia</p>
                <p className="text-sm">Vytvorte prvé riešenie pre onboarding proces</p>
                <Button className="mt-4" onClick={handleCreate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Vytvoriť riešenie
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default SolutionsPage;