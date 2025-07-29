import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { OnboardingStep, OnboardingField } from '@/pages/OnboardingConfigPage';

interface OnboardingStepEditorProps {
  step: OnboardingStep;
  onSave: (step: OnboardingStep) => void;
  onCancel: () => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefón' },
  { value: 'textarea', label: 'Dlhý text' },
  { value: 'select', label: 'Výber' },
  { value: 'checkbox', label: 'Zaškrtávacie pole' },
  { value: 'radio', label: 'Rádiové tlačidlá' },
  { value: 'date', label: 'Dátum' },
  { value: 'number', label: 'Číslo' }
];

const FieldCard = ({ field, onUpdate, onDelete }: {
  field: OnboardingField;
  onUpdate: (updates: Partial<OnboardingField>) => void;
  onDelete: () => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card ref={setNodeRef} style={style} className="transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-slate-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-slate-400" />
            </button>
            <CardTitle className="text-sm">{field.fieldLabel}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {FIELD_TYPES.find(t => t.value === field.fieldType)?.label}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={field.isEnabled}
              onCheckedChange={(enabled) => onUpdate({ isEnabled: enabled })}
            />
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Názov poľa</Label>
            <Input
              value={field.fieldLabel}
              onChange={(e) => onUpdate({ fieldLabel: e.target.value })}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Kľúč poľa</Label>
            <Input
              value={field.fieldKey}
              onChange={(e) => onUpdate({ fieldKey: e.target.value })}
              className="h-8"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Typ poľa</Label>
            <Select value={field.fieldType} onValueChange={(value) => onUpdate({ fieldType: value as any })}>
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {FIELD_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2 pt-4">
            <Switch
              checked={field.isRequired}
              onCheckedChange={(required) => onUpdate({ isRequired: required })}
            />
            <Label className="text-xs">Povinné pole</Label>
          </div>
        </div>

        {field.fieldOptions && (
          <div className="space-y-2">
            <Label className="text-xs">Placeholder</Label>
            <Input
              value={field.fieldOptions.placeholder || ''}
              onChange={(e) => onUpdate({ 
                fieldOptions: { 
                  ...field.fieldOptions, 
                  placeholder: e.target.value 
                }
              })}
              className="h-8"
              placeholder="Zadajte placeholder text..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const OnboardingStepEditor = ({ step, onSave, onCancel }: OnboardingStepEditorProps) => {
  const [editedStep, setEditedStep] = useState<OnboardingStep>(step);
  const [activeTab, setActiveTab] = useState('basic');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setEditedStep(step);
  }, [step]);

  const updateStep = (updates: Partial<OnboardingStep>) => {
    setEditedStep(prev => ({ ...prev, ...updates }));
  };

  const addField = () => {
    const newField: OnboardingField = {
      id: `field_${Date.now()}`,
      fieldKey: `field_${editedStep.fields.length + 1}`,
      fieldLabel: 'Nové pole',
      fieldType: 'text',
      isRequired: false,
      isEnabled: true,
      position: editedStep.fields.length,
      fieldOptions: {
        placeholder: '',
        helpText: ''
      }
    };

    updateStep({ 
      fields: [...editedStep.fields, newField] 
    });
  };

  const updateField = (fieldId: string, updates: Partial<OnboardingField>) => {
    updateStep({
      fields: editedStep.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    });
  };

  const deleteField = (fieldId: string) => {
    updateStep({
      fields: editedStep.fields.filter(field => field.id !== fieldId)
    });
  };

  const handleFieldDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = editedStep.fields.findIndex((field) => field.id === active.id);
      const newIndex = editedStep.fields.findIndex((field) => field.id === over.id);
      
      const newFields = arrayMove(editedStep.fields, oldIndex, newIndex).map((field, index) => ({
        ...field,
        position: index
      }));
      
      updateStep({ fields: newFields });
    }
  };

  const handleSave = () => {
    onSave(editedStep);
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Upraviť krok: {step.title}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Základné nastavenia</TabsTrigger>
            <TabsTrigger value="fields">Polia formulára</TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-auto max-h-[60vh]">
            <TabsContent value="basic" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label>Názov kroku</Label>
                  <Input
                    value={editedStep.title}
                    onChange={(e) => updateStep({ title: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Popis kroku</Label>
                  <Textarea
                    value={editedStep.description}
                    onChange={(e) => updateStep({ description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Kľúč kroku</Label>
                  <Input
                    value={editedStep.stepKey}
                    onChange={(e) => updateStep({ stepKey: e.target.value })}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editedStep.isEnabled}
                    onCheckedChange={(enabled) => updateStep({ isEnabled: enabled })}
                  />
                  <Label>Krok je aktívny</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editedStep.isRequired}
                    onCheckedChange={(required) => updateStep({ isRequired: required })}
                  />
                  <Label>Krok je povinný</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fields" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Polia formulára</h3>
                <Button onClick={addField}>
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať pole
                </Button>
              </div>

              {editedStep.fields.length > 0 ? (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleFieldDragEnd}
                  modifiers={[restrictToVerticalAxis]}
                >
                  <SortableContext items={editedStep.fields.map(f => f.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                      {editedStep.fields.map((field) => (
                        <FieldCard
                          key={field.id}
                          field={field}
                          onUpdate={(updates) => updateField(field.id, updates)}
                          onDelete={() => deleteField(field.id)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Žiadne polia nie sú nakonfigurované. Kliknite na "Pridať pole" pre začiatok.
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Zrušiť
          </Button>
          <Button onClick={handleSave}>
            Uložiť zmeny
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingStepEditor;