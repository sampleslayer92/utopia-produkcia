import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { useContractStatuses, ContractStatus } from '@/hooks/useContractStatuses';
import { toast } from 'sonner';

interface StatusManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_PALETTE = [
  '#6B7280', '#EF4444', '#F59E0B', '#10B981', 
  '#3B82F6', '#8B5CF6', '#EC4899', '#F97316'
];

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'Všeobecné' },
  { value: 'in_progress', label: 'V procese' },
  { value: 'completed', label: 'Dokončené' },
  { value: 'cancelled', label: 'Zrušené' }
];

const StatusManagementModal = ({ isOpen, onClose }: StatusManagementModalProps) => {
  const { statuses, createStatus, updateStatus, deleteStatus, isLoading } = useContractStatuses('contracts');
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
      toast.error('Názov a označenie sú povinné');
      return;
    }

    const statusData = {
      ...formData,
      name: formData.name.toLowerCase().replace(/\s+/g, '_'),
      is_system: false,
      is_active: true,
      position: statuses.length,
      entity_type: 'contracts' as const
    };

    const result = await createStatus(statusData);
    if (result.success) {
      toast.success('Status bol úspešne vytvorený');
      setFormData({ name: '', label: '', description: '', color: COLOR_PALETTE[0], category: 'general' });
      setShowAddForm(false);
    } else {
      toast.error(result.error || 'Chyba pri vytváraní statusu');
    }
  };

  const handleUpdate = async (id: string, updates: Partial<ContractStatus>) => {
    const result = await updateStatus(id, updates);
    if (result.success) {
      toast.success('Status bol aktualizovaný');
      setEditingStatus(null);
    } else {
      toast.error(result.error || 'Chyba pri aktualizácii');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Naozaj chcete zmazať tento status?')) {
      const result = await deleteStatus(id);
      if (result.success) {
        toast.success('Status bol zmazaný');
      } else {
        toast.error(result.error || 'Chyba pri mazaní statusu');
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Správa Statusov
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Pridať Status
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[60vh]">
          {showAddForm && (
            <Card className="p-4 border-dashed border-primary/50">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Názov (systémový)</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="napr. waiting_review"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="label">Označenie (zobrazované)</Label>
                    <Input
                      id="label"
                      value={formData.label}
                      onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                      placeholder="napr. Čaká na kontrolu"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Popis</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Popis statusu..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kategória</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as ContractStatus['category'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Farba</Label>
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
                    Uložiť
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => setShowAddForm(false)}>
                    <X className="h-4 w-4 mr-2" />
                    Zrušiť
                  </Button>
                </div>
              </form>
            </Card>
          )}

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
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{status.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {status.name}
                        </Badge>
                        {status.is_system && (
                          <Badge variant="secondary" className="text-xs">
                            Systémový
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
                      {CATEGORY_OPTIONS.find(c => c.value === status.category)?.label}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Zavrieť
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StatusManagementModal;