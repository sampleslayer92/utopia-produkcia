import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import type { OnboardingStep, OnboardingField } from '@/pages/OnboardingConfigPage';

interface FieldsManagementProps {
  steps: OnboardingStep[];
  onUpdateStep: (stepId: string, updates: Partial<OnboardingStep>) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Telefón' },
  { value: 'textarea', label: 'Dlhý text' },
  { value: 'select', label: 'Výber' },
  { value: 'multiselect', label: 'Viacnásobný výber' },
  { value: 'checkbox', label: 'Zaškrtávacie pole' },
  { value: 'radio', label: 'Rádiové tlačidlá' },
  { value: 'date', label: 'Dátum' },
  { value: 'number', label: 'Číslo' }
];

const SortableFieldCard = ({ field, onUpdate, onDelete }: {
  field: OnboardingField;
  onUpdate: (updates: Partial<OnboardingField>) => void;
  onDelete: () => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedField, setEditedField] = useState(field);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id || field.fieldKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onUpdate(editedField);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedField(field);
    setIsEditing(false);
  };

  return (
    <Card ref={setNodeRef} style={style} className="transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-muted rounded"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            <CardTitle className="text-sm">{field.fieldLabel}</CardTitle>
            <Badge variant="outline" className="text-xs">
              {FIELD_TYPES.find(t => t.value === field.fieldType)?.label}
            </Badge>
            {field.isRequired && <Badge variant="destructive" className="text-xs">Povinné</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={field.isEnabled}
              onCheckedChange={(enabled) => onUpdate({ isEnabled: enabled })}
            />
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      {isEditing && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Názov poľa</Label>
              <Input
                value={editedField.fieldLabel}
                onChange={(e) => setEditedField(prev => ({ ...prev, fieldLabel: e.target.value }))}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Kľúč poľa</Label>
              <Input
                value={editedField.fieldKey}
                onChange={(e) => setEditedField(prev => ({ ...prev, fieldKey: e.target.value }))}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Typ poľa</Label>
              <Select 
                value={editedField.fieldType} 
                onValueChange={(value) => setEditedField(prev => ({ ...prev, fieldType: value as any }))}
              >
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
                checked={editedField.isRequired}
                onCheckedChange={(required) => setEditedField(prev => ({ ...prev, isRequired: required }))}
              />
              <Label className="text-xs">Povinné pole</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Placeholder text</Label>
            <Input
              value={editedField.fieldOptions?.placeholder || ''}
              onChange={(e) => setEditedField(prev => ({ 
                ...prev, 
                fieldOptions: { 
                  ...prev.fieldOptions, 
                  placeholder: e.target.value 
                }
              }))}
              className="h-8"
              placeholder="Zadajte placeholder text..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Pomocný text</Label>
            <Textarea
              value={editedField.fieldOptions?.helpText || ''}
              onChange={(e) => setEditedField(prev => ({ 
                ...prev, 
                fieldOptions: { 
                  ...prev.fieldOptions, 
                  helpText: e.target.value 
                }
              }))}
              className="min-h-[60px]"
              placeholder="Pomocný text pre používateľa..."
            />
          </div>

          {(editedField.fieldType === 'select' || editedField.fieldType === 'multiselect' || editedField.fieldType === 'radio') && (
            <div className="space-y-2">
              <Label className="text-xs">Možnosti (jedna na riadok)</Label>
              <Textarea
                value={editedField.fieldOptions?.options?.map(opt => `${opt.value}|${opt.label}`).join('\n') || ''}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(line => line.trim());
                  const options = lines.map(line => {
                    const [value, label] = line.split('|');
                    return { value: value?.trim() || '', label: label?.trim() || value?.trim() || '' };
                  });
                  setEditedField(prev => ({ 
                    ...prev, 
                    fieldOptions: { 
                      ...prev.fieldOptions, 
                      options 
                    }
                  }));
                }}
                className="min-h-[80px]"
                placeholder="hodnota1|Zobrazený text 1&#10;hodnota2|Zobrazený text 2"
              />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button size="sm" onClick={handleSave}>Uložiť</Button>
            <Button size="sm" variant="outline" onClick={handleCancel}>Zrušiť</Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

const FieldsManagement = ({ steps, onUpdateStep }: FieldsManagementProps) => {
  const [selectedStepId, setSelectedStepId] = useState<string>('');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const selectedStep = steps.find(step => step.id === selectedStepId);

  const handleFieldDragEnd = (event: any) => {
    if (!selectedStep) return;
    
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = selectedStep.fields.findIndex((field) => (field.id || field.fieldKey) === active.id);
      const newIndex = selectedStep.fields.findIndex((field) => (field.id || field.fieldKey) === over.id);
      
      const newFields = arrayMove(selectedStep.fields, oldIndex, newIndex).map((field, index) => ({
        ...field,
        position: index
      }));
      
      onUpdateStep(selectedStepId, { fields: newFields });
    }
  };

  const addField = () => {
    if (!selectedStep) return;
    
    const newField: OnboardingField = {
      id: `field_${Date.now()}`,
      fieldKey: `field_${selectedStep.fields.length + 1}`,
      fieldLabel: 'Nové pole',
      fieldType: 'text',
      isRequired: false,
      isEnabled: true,
      position: selectedStep.fields.length,
      fieldOptions: {
        placeholder: '',
        helpText: ''
      }
    };

    onUpdateStep(selectedStepId, { 
      fields: [...selectedStep.fields, newField] 
    });
  };

  const updateField = (fieldId: string, updates: Partial<OnboardingField>) => {
    if (!selectedStep) return;
    
    onUpdateStep(selectedStepId, {
      fields: selectedStep.fields.map(field =>
        (field.id || field.fieldKey) === fieldId ? { ...field, ...updates } : field
      )
    });
  };

  const deleteField = (fieldId: string) => {
    if (!selectedStep) return;
    
    onUpdateStep(selectedStepId, {
      fields: selectedStep.fields.filter(field => (field.id || field.fieldKey) !== fieldId)
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Správa polí formulárov</CardTitle>
              <p className="text-sm text-muted-foreground">
                Vyberte krok a upravujte jeho polia
              </p>
            </div>
            {selectedStep && (
              <Button onClick={addField}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať pole
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Vyberte krok na editáciu</Label>
              <Select value={selectedStepId} onValueChange={setSelectedStepId}>
                <SelectTrigger>
                  <SelectValue placeholder="Vyberte krok..." />
                </SelectTrigger>
                <SelectContent>
                  {steps.map((step) => (
                    <SelectItem key={step.id} value={step.id}>
                      {step.title} ({step.fields.length} polí)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedStep ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Polia pre krok: {selectedStep.title}
                  </h3>
                  <Badge variant="secondary">
                    {selectedStep.fields.length} polí
                  </Badge>
                </div>

                {selectedStep.fields.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleFieldDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext 
                      items={selectedStep.fields.map(f => f.id || f.fieldKey)} 
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-3">
                        {selectedStep.fields.map((field) => (
                          <SortableFieldCard
                            key={field.id || field.fieldKey}
                            field={field}
                            onUpdate={(updates) => updateField(field.id || field.fieldKey, updates)}
                            onDelete={() => deleteField(field.id || field.fieldKey)}
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
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Vyberte krok pre editáciu jeho polí
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FieldsManagement;