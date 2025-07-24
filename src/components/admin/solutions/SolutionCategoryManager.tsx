import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Plus, X, Save } from 'lucide-react';
import { icons } from 'lucide-react';
import { useSolutions } from '@/hooks/useSolutions';
import { useCategories } from '@/hooks/useCategories';
import { useSolutionCategories, useCreateSolutionCategory, useDeleteSolutionCategory, useUpdateSolutionCategoriesOrder } from '@/hooks/useSolutionCategories';
import { toast } from 'sonner';

interface SolutionCategoryManagerProps {
  solutionId?: string;
}

const SolutionCategoryManager = ({ solutionId }: SolutionCategoryManagerProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedSolution, setSelectedSolution] = useState<string>(solutionId || '');
  
  const { data: solutions = [] } = useSolutions();
  const { data: categories = [] } = useCategories();
  const { data: solutionCategories = [] } = useSolutionCategories(selectedSolution);
  
  const createMutation = useCreateSolutionCategory();
  const deleteMutation = useDeleteSolutionCategory();

  // Helper function to render icons
  const renderIcon = (iconName: string | null, iconUrl: string | null, color: string) => {
    if (iconUrl) {
      return <img src={iconUrl} alt="Icon" className="h-4 w-4 object-contain" />;
    }
    if (iconName && icons[iconName as keyof typeof icons]) {
      const IconComponent = icons[iconName as keyof typeof icons];
      return <IconComponent className="h-4 w-4" style={{ color }} />;
    }
    return <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />;
  };

  const assignedCategoryIds = new Set(solutionCategories.map(sc => sc.category_id));
  
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(search.toLowerCase()) &&
    !assignedCategoryIds.has(category.id)
  );

  const handleAssignCategory = async (categoryId: string) => {
    if (!selectedSolution) {
      toast.error('Vyberte najprv riešenie');
      return;
    }

    try {
      await createMutation.mutateAsync({
        solution_id: selectedSolution,
        category_id: categoryId,
        position: solutionCategories.length,
        is_featured: false
      });
      toast.success('Kategória bola priradená k riešeniu');
    } catch (error) {
      console.error('Error assigning category:', error);
      toast.error('Chyba pri priraďovaní kategórie');
    }
  };

  const handleRemoveCategory = async (solutionCategoryId: string) => {
    try {
      await deleteMutation.mutateAsync(solutionCategoryId);
      toast.success('Kategória bola odstránená z riešenia');
    } catch (error) {
      console.error('Error removing category:', error);
      toast.error('Chyba pri odstraňovaní kategórie');
    }
  };

  const currentSolution = solutions.find(s => s.id === selectedSolution);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/admin/warehouse/solutions')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Späť na riešenia
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Správa kategórií v riešeniach</h1>
          <p className="text-muted-foreground">
            Priradenie kategórií k riešeniam pre progressive flow
          </p>
        </div>
      </div>

      {/* Solution Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Výber riešenia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {solutions.map((solution) => (
              <Card 
                key={solution.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedSolution === solution.id ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
                onClick={() => setSelectedSolution(solution.id)}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {renderIcon(solution.icon_name, solution.icon_url, solution.color || '#3B82F6')}
                    {solution.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{solution.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedSolution && currentSolution && (
        <>
          {/* Assigned Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {renderIcon(currentSolution.icon_name, currentSolution.icon_url, currentSolution.color || '#3B82F6')}
                Priradené kategórie pre "{currentSolution.name}"
              </CardTitle>
            </CardHeader>
            <CardContent>
              {solutionCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Žiadne kategórie nie sú priradené k tomuto riešeniu
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {solutionCategories.map((solutionCategory) => (
                    <Card key={solutionCategory.id} className="relative">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {renderIcon(
                              solutionCategory.category?.icon_name || null,
                              solutionCategory.category?.icon_url || null,
                              solutionCategory.category?.color || '#3B82F6'
                            )}
                            <CardTitle className="text-lg">
                              {solutionCategory.category?.name}
                            </CardTitle>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveCategory(solutionCategory.id)}
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">
                            {solutionCategory.category?.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant={solutionCategory.is_featured ? "default" : "secondary"}>
                              {solutionCategory.is_featured ? 'Odporúčané' : 'Štandardné'}
                            </Badge>
                            <Badge variant="outline">
                              Pozícia: {solutionCategory.position}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Available Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Dostupné kategórie</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Hľadať kategórie..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {search ? 'Žiadne kategórie neboli nájdené' : 'Všetky kategórie sú už priradené'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCategories.map((category) => (
                    <Card key={category.id} className="hover:shadow-md transition-all">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {renderIcon(category.icon_name, category.icon_url, category.color)}
                          {category.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <p className="text-sm text-muted-foreground">{category.description}</p>
                          <Button
                            onClick={() => handleAssignCategory(category.id)}
                            className="w-full gap-2"
                            size="sm"
                          >
                            <Plus className="h-4 w-4" />
                            Priradiť k riešeniu
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default SolutionCategoryManager;