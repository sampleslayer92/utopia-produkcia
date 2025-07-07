import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Edit2, Save, X, Tags, RefreshCw } from 'lucide-react';
import { useContractStatuses, ContractStatus, EntityType } from '@/hooks/useContractStatuses';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const COLOR_PALETTE = [
  '#6B7280', '#EF4444', '#F59E0B', '#10B981', 
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'
];

const ApplicationSettingsTab = () => {
  const { t } = useTranslation('admin');
  const [selectedEntityType, setSelectedEntityType] = useState<EntityType>('contracts');
  const { statuses, createStatus, updateStatus, deleteStatus, isLoading, refetch } = useContractStatuses(selectedEntityType);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    label: '',
    description: '',
    color: COLOR_PALETTE[0],
    category: 'general' as ContractStatus['category']
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.label.trim()) {
      toast.error(t('settings.validation.nameRequired'));
      return;
    }

    const statusData = {
      ...formData,
      name: formData.name.toLowerCase().replace(/\s+/g, '_'),
      is_system: false,
      is_active: true,
      position: statuses.length,
      entity_type: selectedEntityType
    };

    const result = await createStatus(statusData);
    if (result.success) {
      toast.success(t('settings.success.statusCreated'));
      setFormData({ name: '', label: '', description: '', color: COLOR_PALETTE[0], category: 'general' });
      setShowAddForm(false);
    } else {
      toast.error(result.error || t('settings.errors.statusCreate'));
    }
  };

  const handleUpdate = async (id: string, updates: Partial<ContractStatus>) => {
    const result = await updateStatus(id, updates);
    if (result.success) {
      toast.success(t('settings.success.statusUpdated'));
      setEditingStatus(null);
    } else {
      toast.error(result.error || t('settings.errors.statusUpdate'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('settings.validation.deleteConfirm'))) {
      const result = await deleteStatus(id);
      if (result.success) {
        toast.success(t('settings.success.statusDeleted'));
      } else {
        toast.error(result.error || t('settings.errors.statusDelete'));
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Contract Statuses Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Tags className="h-5 w-5" />
                {t('settings.applicationSettings.title')}
              </CardTitle>
              <CardDescription>
                {t('settings.applicationSettings.description')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {t('settings.applicationSettings.refresh')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('settings.applicationSettings.addStatus')}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Entity Type Selector */}
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
            <Label className="text-sm font-medium">{t('settings.applicationSettings.entityType')}</Label>
            <Select value={selectedEntityType} onValueChange={(value) => setSelectedEntityType(value as EntityType)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(t('settings.applicationSettings.entityTypes', { returnObjects: true }) as Record<string, string>).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showAddForm && (
            <Card className="p-4 border-dashed border-primary/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('settings.applicationSettings.systemName')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder={t('settings.applicationSettings.placeholders.systemName')}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="label">{t('settings.applicationSettings.displayLabel')}</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                      placeholder={t('settings.applicationSettings.placeholders.displayLabel')}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">{t('settings.applicationSettings.description')}</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={t('settings.applicationSettings.placeholders.description')}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('settings.applicationSettings.category')}</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ContractStatus['category'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(t('settings.applicationSettings.categories', { returnObjects: true }) as Record<string, string>).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t('settings.applicationSettings.color')}</Label>
                    <div className="flex gap-2 mt-2">
                      {COLOR_PALETTE.map((color) => (
                        <button
                          key={color}
                          type="button"
                          className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                            formData.color === color ? 'border-foreground' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                          onClick={() => setFormData(prev => ({ ...prev, color }))}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    {t('settings.applicationSettings.save')}
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    <X className="h-4 w-4 mr-2" />
                    {t('settings.applicationSettings.cancel')}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <Separator />

          <div className="grid gap-3">
            {statuses.map((status) => (
              <Card key={status.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">{status.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {status.name}
                        </Badge>
                        {status.is_system && (
                          <Badge variant="secondary" className="text-xs">
                            {t('settings.applicationSettings.systemStatus')}
                          </Badge>
                        )}
                      </div>
                      {status.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {status.description}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {t(`settings.applicationSettings.categories.${status.category}`)}
                    </Badge>
                    {!status.is_system && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingStatus(status.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(status.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Future Settings Sections */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.applicationSettings.futureSettings.title')}</CardTitle>
          <CardDescription>
            {t('settings.applicationSettings.futureSettings.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>{t('settings.applicationSettings.futureSettings.comingSoon')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationSettingsTab;