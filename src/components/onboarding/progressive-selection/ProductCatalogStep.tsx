import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, X, Save, Settings } from 'lucide-react';
import { icons } from 'lucide-react';
import { useSolutions } from '@/hooks/useSolutions';
import { useCategories } from '@/hooks/useCategories';
import { useSolutionCategories, useCreateSolutionCategory, useDeleteSolutionCategory } from '@/hooks/useSolutionCategories';
import { toast } from 'sonner';

interface ProductCatalogStepProps {
  selectedSolution: string | null;
  onNext: () => void;
  onPrev: () => void;
}

const ProductCatalogStep = ({ selectedSolution, onNext, onPrev }: ProductCatalogStepProps) => {
  const navigate = useNavigate();
  
  // Get categories assigned to the selected solution
  const { data: solutionCategories = [] } = useSolutionCategories(selectedSolution || undefined);
  
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Katalóg produktov</h2>
        <p className="text-muted-foreground text-lg">
          Prehľad všetkých dostupných produktov pre vybrané riešenie
        </p>
      </div>

      {solutionCategories.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                K tomuto riešeniu nie sú priradené žiadne kategórie produktov.
              </div>
              <Button
                onClick={() => navigate('/admin/warehouse/solutions/categories')}
                className="gap-2"
              >
                <Settings className="h-4 w-4" />
                Správa kategórií
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {solutionCategories.map((solutionCategory) => (
            <Card key={solutionCategory.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {renderIcon(
                    solutionCategory.category?.icon_name || null,
                    solutionCategory.category?.icon_url || null,
                    solutionCategory.category?.color || '#3B82F6'
                  )}
                  {solutionCategory.category?.name}
                  {solutionCategory.is_featured && (
                    <Badge variant="default">Odporúčané</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {solutionCategory.category?.description}
                </p>
                <div className="text-center py-8 text-muted-foreground">
                  Produkty pre túto kategóriu budú zobrazené v budúcej verzii
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Späť na systémy
        </Button>
        <Button 
          onClick={onNext} 
          className="flex items-center gap-2"
        >
          Dokončiť výber
          <Save className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductCatalogStep;