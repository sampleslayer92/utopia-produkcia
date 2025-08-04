import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Copy, Download, Upload, Check, Settings } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { OnboardingStep } from '@/pages/OnboardingConfigPage';

interface Configuration {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  version?: number;
}

interface ConfigurationManagementProps {
  currentSteps: OnboardingStep[];
  onLoadConfiguration: (configId: string) => Promise<void>;
  onSaveConfiguration: () => Promise<void>;
}

const ConfigurationManagement = ({ 
  currentSteps, 
  onLoadConfiguration, 
  onSaveConfiguration 
}: ConfigurationManagementProps) => {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(null);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigDescription, setNewConfigDescription] = useState('');

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('onboarding_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigurations(data || []);
    } catch (error) {
      console.error('Error loading configurations:', error);
      toast.error('Chyba pri načítavaní konfigurácií');
    } finally {
      setLoading(false);
    }
  };

  const createConfiguration = async () => {
    try {
      if (!newConfigName.trim()) {
        toast.error('Názov konfigurácie je povinný');
        return;
      }

      const { data, error } = await supabase
        .from('onboarding_configurations')
        .insert({
          name: newConfigName.trim(),
          description: newConfigDescription.trim() || null,
          is_active: false
        })
        .select()
        .single();

      if (error) throw error;

      setConfigurations(prev => [data, ...prev]);
      setShowCreateDialog(false);
      setNewConfigName('');
      setNewConfigDescription('');
      toast.success('Konfigurácia bola vytvorená');
    } catch (error) {
      console.error('Error creating configuration:', error);
      toast.error('Chyba pri vytváraní konfigurácie');
    }
  };

  const updateConfiguration = async (config: Configuration) => {
    try {
      const { error } = await supabase
        .from('onboarding_configurations')
        .update({
          name: config.name,
          description: config.description,
          updated_at: new Date().toISOString()
        })
        .eq('id', config.id);

      if (error) throw error;

      setConfigurations(prev => 
        prev.map(c => c.id === config.id ? { ...c, ...config } : c)
      );
      setShowEditDialog(false);
      setSelectedConfig(null);
      toast.success('Konfigurácia bola aktualizovaná');
    } catch (error) {
      console.error('Error updating configuration:', error);
      toast.error('Chyba pri aktualizácii konfigurácie');
    }
  };

  const deleteConfiguration = async (configId: string) => {
    try {
      // Delete related steps and fields first
      const { error: stepsError } = await supabase
        .from('onboarding_steps')
        .delete()
        .eq('configuration_id', configId);

      if (stepsError) throw stepsError;

      // Delete the configuration
      const { error } = await supabase
        .from('onboarding_configurations')
        .delete()
        .eq('id', configId);

      if (error) throw error;

      setConfigurations(prev => prev.filter(c => c.id !== configId));
      setShowDeleteDialog(false);
      setSelectedConfig(null);
      toast.success('Konfigurácia bola odstránená');
    } catch (error) {
      console.error('Error deleting configuration:', error);
      toast.error('Chyba pri odstraňovaní konfigurácie');
    }
  };

  const setActiveConfiguration = async (configId: string) => {
    try {
      // Deactivate all configurations
      await supabase
        .from('onboarding_configurations')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all

      // Activate selected configuration
      const { error } = await supabase
        .from('onboarding_configurations')
        .update({ is_active: true })
        .eq('id', configId);

      if (error) throw error;

      setConfigurations(prev => 
        prev.map(c => ({ ...c, is_active: c.id === configId }))
      );
      
      // Load the configuration
      await onLoadConfiguration(configId);
      toast.success('Aktívna konfigurácia bola zmenená');
    } catch (error) {
      console.error('Error setting active configuration:', error);
      toast.error('Chyba pri nastavovaní aktívnej konfigurácie');
    }
  };

  const duplicateConfiguration = async (originalConfig: Configuration) => {
    try {
      // Create new configuration
      const { data: newConfig, error: configError } = await supabase
        .from('onboarding_configurations')
        .insert({
          name: `${originalConfig.name} (kópia)`,
          description: originalConfig.description,
          is_active: false
        })
        .select()
        .single();

      if (configError) throw configError;

      // Copy steps and fields
      const { data: steps, error: stepsError } = await supabase
        .from('onboarding_steps')
        .select(`
          *, 
          onboarding_fields(*)
        `)
        .eq('configuration_id', originalConfig.id);

      if (stepsError) throw stepsError;

      // Insert copied steps
      for (const step of steps) {
        const { data: newStep, error: stepError } = await supabase
          .from('onboarding_steps')
          .insert({
            configuration_id: newConfig.id,
            step_key: step.step_key,
            title: step.title,
            description: step.description,
            position: step.position,
            is_enabled: step.is_enabled
          })
          .select()
          .single();

        if (stepError) throw stepError;

        // Insert copied fields
        if (step.onboarding_fields && step.onboarding_fields.length > 0) {
          const fieldsToInsert = step.onboarding_fields.map((field: any) => ({
            step_id: newStep.id,
            field_key: field.field_key,
            field_label: field.field_label,
            field_type: field.field_type,
            is_required: field.is_required,
            is_enabled: field.is_enabled,
            position: field.position,
            field_options: field.field_options
          }));

          const { error: fieldsError } = await supabase
            .from('onboarding_fields')
            .insert(fieldsToInsert);

          if (fieldsError) throw fieldsError;
        }
      }

      setConfigurations(prev => [newConfig, ...prev]);
      toast.success('Konfigurácia bola skopírovaná');
    } catch (error) {
      console.error('Error duplicating configuration:', error);
      toast.error('Chyba pri kopírovaní konfigurácie');
    }
  };

  const exportConfiguration = async (config: Configuration) => {
    try {
      const { data: steps, error } = await supabase
        .from('onboarding_steps')
        .select(`
          *, 
          onboarding_fields(*)
        `)
        .eq('configuration_id', config.id)
        .order('position');

      if (error) throw error;

      const exportData = {
        configuration: {
          name: config.name,
          description: config.description,
          version: config.version || 1,
          exported_at: new Date().toISOString()
        },
        steps: steps.map(step => ({
          step_key: step.step_key,
          title: step.title,
          description: step.description,
          position: step.position,
          is_enabled: step.is_enabled,
          fields: step.onboarding_fields || []
        }))
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `onboarding-config-${config.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Konfigurácia bola exportovaná');
    } catch (error) {
      console.error('Error exporting configuration:', error);
      toast.error('Chyba pri exportovaní konfigurácie');
    }
  };

  const activeConfig = configurations.find(c => c.is_active);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Správa konfigurácií</CardTitle>
              <p className="text-sm text-muted-foreground">
                Vytvárajte a spravujte rôzne verzie onboarding procesu
              </p>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nová konfigurácia
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : configurations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Žiadne konfigurácie nie sú vytvorené. Vytvorte prvú konfiguráciu.
            </div>
          ) : (
            <div className="space-y-3">
              {configurations.map((config) => (
                <Card key={config.id} className={config.is_active ? 'ring-2 ring-primary' : ''}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{config.name}</h3>
                          {config.is_active && (
                            <Badge variant="default">
                              <Check className="h-3 w-3 mr-1" />
                              Aktívna
                            </Badge>
                          )}
                        </div>
                        {config.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {config.description}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Vytvorené: {new Date(config.created_at).toLocaleDateString('sk-SK')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!config.is_active && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveConfiguration(config.id)}
                          >
                            Aktivovať
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedConfig(config);
                            setNewConfigName(config.name);
                            setNewConfigDescription(config.description || '');
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => duplicateConfiguration(config)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => exportConfiguration(config)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        {!config.is_active && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedConfig(config);
                              setShowDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Configuration Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Vytvoriť novú konfiguráciu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Názov konfigurácie</Label>
              <Input
                value={newConfigName}
                onChange={(e) => setNewConfigName(e.target.value)}
                placeholder="Zadajte názov konfigurácie..."
              />
            </div>
            <div>
              <Label>Popis (voliteľné)</Label>
              <Textarea
                value={newConfigDescription}
                onChange={(e) => setNewConfigDescription(e.target.value)}
                placeholder="Popis konfigurácie..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Zrušiť
            </Button>
            <Button onClick={createConfiguration}>
              Vytvoriť
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Configuration Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upraviť konfiguráciu</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Názov konfigurácie</Label>
              <Input
                value={newConfigName}
                onChange={(e) => setNewConfigName(e.target.value)}
                placeholder="Zadajte názov konfigurácie..."
              />
            </div>
            <div>
              <Label>Popis (voliteľné)</Label>
              <Textarea
                value={newConfigDescription}
                onChange={(e) => setNewConfigDescription(e.target.value)}
                placeholder="Popis konfigurácie..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Zrušiť
            </Button>
            <Button onClick={() => selectedConfig && updateConfiguration({
              ...selectedConfig,
              name: newConfigName,
              description: newConfigDescription
            })}>
              Uložiť zmeny
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Configuration Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Odstrániť konfiguráciu</AlertDialogTitle>
            <AlertDialogDescription>
              Naozaj chcete odstrániť konfiguráciu "{selectedConfig?.name}"? 
              Táto akcia je nezvratná a odstráni všetky kroky a polia tejto konfigurácie.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Zrušiť</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedConfig && deleteConfiguration(selectedConfig.id)}
            >
              Odstrániť
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ConfigurationManagement;