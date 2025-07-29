import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GripVertical, Settings, Plus, Eye } from 'lucide-react';
import StepFieldEditor from './StepFieldEditor';
import OnboardingPreview from './OnboardingPreview';

interface OnboardingStep {
  id: string;
  step_key: string;
  title: string;
  description: string;
  position: number;
  is_enabled: boolean;
  configuration_id: string;
  field_count?: number;
}

interface OnboardingConfiguration {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  is_default: boolean;
}

const OnboardingEditor = () => {
  const [configurations, setConfigurations] = useState<OnboardingConfiguration[]>([]);
  const [selectedConfigId, setSelectedConfigId] = useState<string>('');
  const [steps, setSteps] = useState<OnboardingStep[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('steps');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadConfigurations();
  }, []);

  useEffect(() => {
    if (selectedConfigId) {
      loadSteps();
    }
  }, [selectedConfigId]);

  const loadConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_configurations')
        .select('*')
        .order('is_default', { ascending: false });

      if (error) throw error;

      setConfigurations(data);
      if (data.length > 0) {
        const defaultConfig = data.find(c => c.is_default) || data[0];
        setSelectedConfigId(defaultConfig.id);
      }
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa načítať konfigurácie",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSteps = async () => {
    try {
      const { data: stepsData, error: stepsError } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('configuration_id', selectedConfigId)
        .order('position');

      if (stepsError) throw stepsError;

      // Load field counts for each step
      const stepsWithCounts = await Promise.all(
        stepsData.map(async (step) => {
          const { count } = await supabase
            .from('onboarding_fields')
            .select('*', { count: 'exact', head: true })
            .eq('step_id', step.id);
          
          return { ...step, field_count: count || 0 };
        })
      );

      setSteps(stepsWithCounts);
    } catch (error) {
      console.error('Error loading steps:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa načítať kroky",
        variant: "destructive"
      });
    }
  };

  const toggleStepEnabled = async (stepId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('onboarding_steps')
        .update({ is_enabled: enabled })
        .eq('id', stepId);

      if (error) throw error;

      setSteps(steps.map(step => 
        step.id === stepId ? { ...step, is_enabled: enabled } : step
      ));

      toast({
        title: "Úspech",
        description: `Krok ${enabled ? 'zapnutý' : 'vypnutý'}`,
      });
    } catch (error) {
      console.error('Error updating step:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať krok",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(steps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setSteps(updatedItems);

    try {
      // Update positions in database
      const updates = updatedItems.map(item => 
        supabase
          .from('onboarding_steps')
          .update({ position: item.position })
          .eq('id', item.id)
      );

      await Promise.all(updates);

      toast({
        title: "Úspech",
        description: "Poradie krokov aktualizované",
      });
    } catch (error) {
      console.error('Error updating step order:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať poradie",
        variant: "destructive"
      });
      // Revert on error
      loadSteps();
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Načítava sa...</div>;
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="steps">Kroky</TabsTrigger>
          <TabsTrigger value="fields" disabled={!selectedStepId}>Polia</TabsTrigger>
          <TabsTrigger value="preview">Náhľad</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Onboarding kroky
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať krok
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="steps">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {steps.map((step, index) => (
                        <Draggable key={step.id} draggableId={step.id} index={index}>
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`transition-shadow ${
                                snapshot.isDragging ? 'shadow-lg' : ''
                              } ${selectedStepId === step.id ? 'ring-2 ring-primary' : ''}`}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div {...provided.dragHandleProps}>
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2">
                                        <h3 className="font-medium">{step.title}</h3>
                                        <Badge variant="secondary">
                                          {step.field_count} polí
                                        </Badge>
                                        {!step.is_enabled && (
                                          <Badge variant="outline">Vypnuté</Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-muted-foreground">
                                        {step.description}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch
                                      checked={step.is_enabled}
                                      onCheckedChange={(checked) => 
                                        toggleStepEnabled(step.id, checked)
                                      }
                                    />
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedStepId(step.id);
                                        setActiveTab('fields');
                                      }}
                                    >
                                      <Settings className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fields">
          {selectedStepId ? (
            <StepFieldEditor 
              stepId={selectedStepId} 
              onBack={() => setActiveTab('steps')}
            />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">Vyberte krok pre editáciu polí</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="preview">
          <OnboardingPreview configurationId={selectedConfigId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OnboardingEditor;