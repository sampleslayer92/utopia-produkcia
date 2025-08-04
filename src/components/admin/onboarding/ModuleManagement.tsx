import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Trash2, GripVertical } from "lucide-react";
import { moduleComponentRegistry, ModuleDefinition } from '../../../components/onboarding/dynamic/ModuleComponentRegistry';
import '../../../components/onboarding/dynamic/ModuleRegistration'; // Import to register modules
import { useOnboardingConfig } from '@/hooks/useOnboardingConfig';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepModule {
  id: string;
  moduleKey: string;
  moduleName: string;
  position: number;
  isEnabled: boolean;
  configuration: Record<string, any>;
}

interface ModuleManagementProps {
  stepId: string | null;
}

interface SortableModuleCardProps {
  module: StepModule;
  moduleDefinition: ModuleDefinition | undefined;
  onUpdate: (updates: Partial<StepModule>) => Promise<void>;
  onDelete: () => Promise<void>;
}

const SortableModuleCard = ({ module, moduleDefinition, onUpdate, onDelete }: SortableModuleCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [configValues, setConfigValues] = useState(module.configuration);

  if (!moduleDefinition) return null;

  const handleConfigSave = async () => {
    try {
      await onUpdate({ configuration: configValues });
      setIsConfigOpen(false);
    } catch (error) {
      console.error('Failed to save configuration:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'selection': return 'bg-blue-100 text-blue-800';
      case 'calculator': return 'bg-green-100 text-green-800';
      case 'catalog': return 'bg-purple-100 text-purple-800';
      case 'form': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className={`transition-all duration-200 ${!module.isEnabled ? 'opacity-50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <button
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="h-4 w-4" />
            </button>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium">{module.moduleName}</h4>
                <Badge className={getCategoryColor(moduleDefinition.category)}>
                  {moduleDefinition.category}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{moduleDefinition.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                checked={module.isEnabled}
                onCheckedChange={async (checked) => {
                  try {
                    await onUpdate({ isEnabled: !!checked });
                  } catch (error) {
                    console.error('Failed to update module:', error);
                  }
                }}
              />
              
              {moduleDefinition.configurationSchema && moduleDefinition.configurationSchema.length > 0 && (
                <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Konfigurácia modulu: {module.moduleName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {moduleDefinition.configurationSchema?.map((field) => (
                        <div key={field.field} className="space-y-2">
                          <Label>{field.label}</Label>
                          {field.type === 'boolean' ? (
                            <Checkbox
                              checked={configValues[field.field] || false}
                              onCheckedChange={(checked) => 
                                setConfigValues(prev => ({ ...prev, [field.field]: !!checked }))
                              }
                            />
                          ) : field.type === 'select' ? (
                            <Select
                              value={configValues[field.field] || ''}
                              onValueChange={(value) => 
                                setConfigValues(prev => ({ ...prev, [field.field]: value }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={field.type}
                              value={configValues[field.field] || ''}
                              onChange={(e) => 
                                setConfigValues(prev => ({ 
                                  ...prev, 
                                  [field.field]: field.type === 'number' ? Number(e.target.value) : e.target.value 
                                }))
                              }
                            />
                          )}
                        </div>
                      ))}
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
                          Zrušiť
                        </Button>
                        <Button onClick={handleConfigSave}>
                          Uložiť
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}

              <Button variant="ghost" size="sm" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ModuleManagement = ({ stepId }: ModuleManagementProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { 
    getStepModules, 
    addStepModule, 
    updateStepModule, 
    deleteStepModule, 
    reorderStepModules 
  } = useOnboardingConfig();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const availableModules = moduleComponentRegistry.getAllModules();
  const categories = ['all', 'selection', 'calculator', 'catalog', 'form', 'other'];
  const stepModules = stepId ? getStepModules(stepId) : [];

  const filteredModules = selectedCategory === 'all' 
    ? availableModules 
    : availableModules.filter(module => module.category === selectedCategory);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!stepId) return;
    
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = stepModules.findIndex(module => module.id === active.id);
      const newIndex = stepModules.findIndex(module => module.id === over?.id);
      
      const reorderedModules = arrayMove(stepModules, oldIndex, newIndex).map((module, index) => ({
        ...module,
        position: index
      }));
      
      try {
        await reorderStepModules(stepId, reorderedModules);
      } catch (error) {
        console.error('Failed to reorder modules:', error);
      }
    }
  };

  const handleAddModule = async (moduleKey: string) => {
    if (!stepId) return;
    
    const moduleDefinition = moduleComponentRegistry.getModule(moduleKey);
    if (!moduleDefinition) return;

    try {
      await addStepModule(stepId, moduleKey, moduleDefinition.name);
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to add module:', error);
    }
  };

  if (!stepId) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Vyberte krok na editáciu modulov</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Moduly v kroku</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Pridať modul
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pridať modul do kroku</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Kategória</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Všetky</SelectItem>
                    <SelectItem value="selection">Výber</SelectItem>
                    <SelectItem value="calculator">Kalkulačky</SelectItem>
                    <SelectItem value="catalog">Katalógy</SelectItem>
                    <SelectItem value="form">Formuláre</SelectItem>
                    <SelectItem value="other">Ostatné</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {filteredModules.map((module) => (
                  <Card 
                    key={module.key} 
                    className="cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => handleAddModule(module.key)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{module.name}</h4>
                          <p className="text-sm text-muted-foreground">{module.description}</p>
                        </div>
                        <Badge className={
                          module.category === 'selection' ? 'bg-blue-100 text-blue-800' :
                          module.category === 'calculator' ? 'bg-green-100 text-green-800' :
                          module.category === 'catalog' ? 'bg-purple-100 text-purple-800' :
                          module.category === 'form' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {module.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={stepModules.map(m => m.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {stepModules.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">V tomto kroku nie sú žiadne moduly</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Pridajte moduly pre rozšírenie funkcionality kroku
                  </p>
                </CardContent>
              </Card>
            ) : (
              stepModules.map((module) => {
                const moduleDefinition = moduleComponentRegistry.getModule(module.moduleKey);
                
                return (
                  <SortableModuleCard
                    key={module.id}
                    module={module}
                    moduleDefinition={moduleDefinition}
                    onUpdate={async (updates) => {
                      try {
                        await updateStepModule(stepId, module.id, updates);
                      } catch (error) {
                        console.error('Failed to update module:', error);
                      }
                    }}
                    onDelete={async () => {
                      try {
                        await deleteStepModule(stepId, module.id);
                      } catch (error) {
                        console.error('Failed to delete module:', error);
                      }
                    }}
                  />
                );
              })
            )}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default ModuleManagement;