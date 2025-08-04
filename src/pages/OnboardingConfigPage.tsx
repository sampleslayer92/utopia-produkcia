import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  Plus, 
  Eye, 
  GripVertical,
  Edit,
  Trash2,
  Copy,
  Save,
  RotateCcw,
  ExternalLink
} from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import OnboardingStepEditor from '@/components/admin/onboarding/OnboardingStepEditor';
import OnboardingStepCard from '@/components/admin/onboarding/OnboardingStepCard';
import OnboardingPreview from '@/components/admin/onboarding/OnboardingPreview';
import FieldsManagement from '@/components/admin/onboarding/FieldsManagement';
import ConfigurationManagement from '@/components/admin/onboarding/ConfigurationManagement';
import ModuleManagement from '@/components/admin/onboarding/ModuleManagement';
import TestingLinks from '@/components/admin/onboarding/TestingLinks';
import { useOnboardingConfig } from '@/hooks/useOnboardingConfig';
import { toast } from 'sonner';

export interface OnboardingStep {
  id: string;
  stepKey: string;
  title: string;
  description: string;
  position: number;
  isEnabled: boolean;
  isRequired: boolean;
  fields: OnboardingField[];
}

export interface OnboardingField {
  id?: string;
  fieldKey: string;
  fieldLabel: string;
  fieldType: 'text' | 'email' | 'phone' | 'tel' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'number';
  isRequired: boolean;
  isEnabled: boolean;
  position?: number;
  fieldOptions?: {
    placeholder?: string;
    helpText?: string;
    options?: Array<{ label: string; value: string }>;
    validation?: {
      minLength?: number;
      maxLength?: number;
      pattern?: string;
    };
  };
}

const OnboardingConfigPage = () => {
  const { t } = useTranslation(['admin', 'common']);
  const [activeTab, setActiveTab] = useState('steps');
  const [editingStep, setEditingStep] = useState<OnboardingStep | null>(null);
  const [selectedStepForModules, setSelectedStepForModules] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  
  const {
    steps,
    loading,
    saving,
    updateStepOrder,
    updateStep,
    addStep,
    deleteStep,
    duplicateStep,
    saveConfiguration,
    resetToDefault,
    loadConfiguration
  } = useOnboardingConfig();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = steps.findIndex((step) => step.id === active.id);
      const newIndex = steps.findIndex((step) => step.id === over.id);
      
      const newSteps = arrayMove(steps, oldIndex, newIndex);
      updateStepOrder(newSteps);
    }
  };

  const handleAddStep = () => {
    const newStep: Partial<OnboardingStep> = {
      stepKey: `custom_step_${Date.now()}`,
      title: 'Nový krok',
      description: 'Popis nového kroku',
      position: steps.length,
      isEnabled: true,
      isRequired: false,
      fields: []
    };
    
    addStep(newStep);
  };

  const handleSaveConfiguration = async () => {
    try {
      await saveConfiguration();
      toast.success('Konfigurácia bola úspešne uložená');
    } catch (error) {
      toast.error('Chyba pri ukladaní konfigurácie');
    }
  };

  const handleResetToDefault = async () => {
    try {
      await resetToDefault();
      toast.success('Konfigurácia bola obnovená na predvolené nastavenia');
    } catch (error) {
      toast.error('Chyba pri obnovovaní konfigurácie');
    }
  };

  const actions = (
    <div className="flex gap-2">
      <Button 
        variant="outline" 
        onClick={() => window.open('/dynamic-onboarding', '_blank')}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Testovať dynamický
      </Button>
      <Button variant="outline" onClick={() => setIsPreviewMode(!isPreviewMode)}>
        <Eye className="h-4 w-4 mr-2" />
        {isPreviewMode ? 'Ukončiť náhľad' : 'Náhľad'}
      </Button>
      <Button variant="outline" onClick={handleResetToDefault} disabled={saving}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Obnoviť predvolené
      </Button>
      <Button onClick={handleSaveConfiguration} disabled={saving}>
        <Save className="h-4 w-4 mr-2" />
        {saving ? 'Ukladá sa...' : 'Uložiť zmeny'}
      </Button>
    </div>
  );

  if (isPreviewMode) {
    return (
      <AdminLayout 
        title="Náhľad onboardingu" 
        subtitle="Náhľad konfigurácie onboarding procesu"
        actions={actions}
      >
        <OnboardingPreview steps={steps} onClose={() => setIsPreviewMode(false)} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Správa onboardingu" 
      subtitle="Konfigurácia krokov a polí onboarding procesu"
      actions={actions}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="steps">Kroky formulárov</TabsTrigger>
            <TabsTrigger value="fields">Polia formulárov</TabsTrigger>
            <TabsTrigger value="modules">Moduly formulárov</TabsTrigger>
            <TabsTrigger value="testing">Testovanie</TabsTrigger>
            <TabsTrigger value="settings">Konfigurácie</TabsTrigger>
          </TabsList>

          <TabsContent value="steps" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Konfigurácia krokov</CardTitle>
                    <CardDescription>
                      Spravujte poradie, názvy a dostupnosť krokov onboarding procesu
                    </CardDescription>
                  </div>
                  <Button onClick={handleAddStep}>
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať krok
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    modifiers={[restrictToVerticalAxis]}
                  >
                    <SortableContext items={steps.map(s => s.id)} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {steps.map((step, index) => (
                          <OnboardingStepCard
                            key={step.id}
                            step={step}
                            index={index}
                            onEdit={setEditingStep}
                            onDelete={deleteStep}
                            onDuplicate={duplicateStep}
                            onToggleEnabled={(id, enabled) => updateStep(id, { isEnabled: enabled })}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fields" className="space-y-4">
            <FieldsManagement />
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Výber kroku pre editáciu modulov</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {steps.map((step) => (
                  <Card 
                    key={step.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedStepForModules === step.id ? 'border-primary bg-primary/5' : 'hover:bg-accent'
                    }`}
                    onClick={() => setSelectedStepForModules(step.id)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={step.isEnabled ? "default" : "secondary"}>
                          {step.isEnabled ? "Aktívny" : "Neaktívny"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <ModuleManagement stepId={selectedStepForModules} />
          </TabsContent>

          <TabsContent value="testing" className="space-y-4">
            <TestingLinks 
              configurationId="default" // TODO: Get actual configuration ID
              isActive={true}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <ConfigurationManagement 
              currentSteps={steps}
              onLoadConfiguration={loadConfiguration}
              onSaveConfiguration={saveConfiguration}
            />
          </TabsContent>
        </Tabs>

        {/* Step Editor Modal */}
        {editingStep && (
          <OnboardingStepEditor
            step={editingStep}
            onSave={(updatedStep) => {
              updateStep(editingStep.id, updatedStep);
              setEditingStep(null);
            }}
            onCancel={() => setEditingStep(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default OnboardingConfigPage;