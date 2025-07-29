import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { GripVertical, ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface OnboardingField {
  id: string;
  step_id: string;
  field_key: string;
  field_label: string;
  field_type: string;
  is_required: boolean;
  is_enabled: boolean;
  position: number;
  field_options?: any;
}

interface StepFieldEditorProps {
  stepId: string;
  onBack: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'tel', label: 'Telefón' },
  { value: 'textarea', label: 'Textová oblasť' },
  { value: 'select', label: 'Výber' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'date', label: 'Dátum' },
  { value: 'number', label: 'Číslo' }
];

const StepFieldEditor = ({ stepId, onBack }: StepFieldEditorProps) => {
  const [fields, setFields] = useState<OnboardingField[]>([]);
  const [stepInfo, setStepInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddField, setShowAddField] = useState(false);
  const [newField, setNewField] = useState({
    field_key: '',
    field_label: '',
    field_type: 'text',
    is_required: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadStepInfo();
    loadFields();
  }, [stepId]);

  const loadStepInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_steps')
        .select('*')
        .eq('id', stepId)
        .single();

      if (error) throw error;
      setStepInfo(data);
    } catch (error) {
      console.error('Error loading step info:', error);
    }
  };

  const loadFields = async () => {
    try {
      const { data, error } = await supabase
        .from('onboarding_fields')
        .select('*')
        .eq('step_id', stepId)
        .order('position');

      if (error) throw error;
      setFields(data);
    } catch (error) {
      console.error('Error loading fields:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa načítať polia",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleFieldEnabled = async (fieldId: string, enabled: boolean) => {
    try {
      const { error } = await supabase
        .from('onboarding_fields')
        .update({ is_enabled: enabled })
        .eq('id', fieldId);

      if (error) throw error;

      setFields(fields.map(field => 
        field.id === fieldId ? { ...field, is_enabled: enabled } : field
      ));

      toast({
        title: "Úspech",
        description: `Pole ${enabled ? 'zapnuté' : 'vypnuté'}`,
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať pole",
        variant: "destructive"
      });
    }
  };

  const toggleFieldRequired = async (fieldId: string, required: boolean) => {
    try {
      const { error } = await supabase
        .from('onboarding_fields')
        .update({ is_required: required })
        .eq('id', fieldId);

      if (error) throw error;

      setFields(fields.map(field => 
        field.id === fieldId ? { ...field, is_required: required } : field
      ));

      toast({
        title: "Úspech",
        description: `Pole ${required ? 'povinné' : 'nepovinné'}`,
      });
    } catch (error) {
      console.error('Error updating field:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať pole",
        variant: "destructive"
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      position: index
    }));

    setFields(updatedItems);

    try {
      const updates = updatedItems.map(item => 
        supabase
          .from('onboarding_fields')
          .update({ position: item.position })
          .eq('id', item.id)
      );

      await Promise.all(updates);

      toast({
        title: "Úspech",
        description: "Poradie polí aktualizované",
      });
    } catch (error) {
      console.error('Error updating field order:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa aktualizovať poradie",
        variant: "destructive"
      });
      loadFields();
    }
  };

  const addNewField = async () => {
    if (!newField.field_key || !newField.field_label) {
      toast({
        title: "Chyba",
        description: "Vyplňte všetky povinné polia",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('onboarding_fields')
        .insert({
          step_id: stepId,
          field_key: newField.field_key,
          field_label: newField.field_label,
          field_type: newField.field_type,
          is_required: newField.is_required,
          position: fields.length
        });

      if (error) throw error;

      setNewField({
        field_key: '',
        field_label: '',
        field_type: 'text',
        is_required: false
      });
      setShowAddField(false);
      loadFields();

      toast({
        title: "Úspech",
        description: "Pole pridané",
      });
    } catch (error) {
      console.error('Error adding field:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa pridať pole",
        variant: "destructive"
      });
    }
  };

  const deleteField = async (fieldId: string) => {
    try {
      const { error } = await supabase
        .from('onboarding_fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;

      loadFields();
      toast({
        title: "Úspech",
        description: "Pole odstránené",
      });
    } catch (error) {
      console.error('Error deleting field:', error);
      toast({
        title: "Chyba",
        description: "Nepodarilo sa odstrániť pole",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Načítava sa...</div>;
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span>Polia - {stepInfo?.title}</span>
            </div>
            <Button 
              size="sm" 
              onClick={() => setShowAddField(!showAddField)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Pridať pole
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddField && (
            <Card className="border-dashed">
              <CardContent className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="field_key">Kľúč poľa</Label>
                    <Input
                      id="field_key"
                      value={newField.field_key}
                      onChange={(e) => setNewField({ ...newField, field_key: e.target.value })}
                      placeholder="firstName"
                    />
                  </div>
                  <div>
                    <Label htmlFor="field_label">Názov poľa</Label>
                    <Input
                      id="field_label"
                      value={newField.field_label}
                      onChange={(e) => setNewField({ ...newField, field_label: e.target.value })}
                      placeholder="Meno"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="field_type">Typ poľa</Label>
                    <Select value={newField.field_type} onValueChange={(value) => setNewField({ ...newField, field_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      checked={newField.is_required}
                      onCheckedChange={(checked) => setNewField({ ...newField, is_required: checked })}
                    />
                    <Label>Povinné</Label>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" onClick={addNewField}>
                    Pridať
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setShowAddField(false)}>
                    Zrušiť
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`transition-shadow ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div {...provided.dragHandleProps}>
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium">{field.field_label}</h4>
                                    <Badge variant="outline">{field.field_type}</Badge>
                                    {field.is_required && (
                                      <Badge variant="destructive" className="text-xs">Povinné</Badge>
                                    )}
                                    {!field.is_enabled && (
                                      <Badge variant="outline">Vypnuté</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {field.field_key}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs">Povinné</Label>
                                  <Switch
                                    checked={field.is_required}
                                    onCheckedChange={(checked) => 
                                      toggleFieldRequired(field.id, checked)
                                    }
                                  />
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Label className="text-xs">Zapnuté</Label>
                                  <Switch
                                    checked={field.is_enabled}
                                    onCheckedChange={(checked) => 
                                      toggleFieldEnabled(field.id, checked)
                                    }
                                  />
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteField(field.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
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

          {fields.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Žiadne polia. Pridajte prvé pole.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFieldEditor;