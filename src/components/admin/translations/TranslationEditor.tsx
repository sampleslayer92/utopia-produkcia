import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Trash2, Plus } from 'lucide-react';
import { Translation, useUpdateTranslation, useDeleteTranslation, useCreateTranslation } from '@/hooks/useTranslations';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TranslationEditorProps {
  translations: Translation[];
  language: string;
  namespace: string;
  namespaces: string[];
}

export const TranslationEditor = ({ translations, language, namespace, namespaces }: TranslationEditorProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newTranslation, setNewTranslation] = useState({
    key: '',
    namespace: namespace,
    language: language,
    value: '',
    is_system: false,
  });

  const updateTranslation = useUpdateTranslation();
  const deleteTranslation = useDeleteTranslation();
  const createTranslation = useCreateTranslation();

  const handleEditStart = (translation: Translation) => {
    setEditingId(translation.id);
    setEditValue(translation.value);
  };

  const handleEditSave = async () => {
    if (editingId) {
      updateTranslation.mutate({ id: editingId, value: editValue });
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = (id: string) => {
    deleteTranslation.mutate(id);
  };

  const handleCreateTranslation = () => {
    createTranslation.mutate(newTranslation, {
      onSuccess: () => {
        setShowAddDialog(false);
        setNewTranslation({
          key: '',
          namespace: namespace,
          language: language,
          value: '',
          is_system: false,
        });
      },
    });
  };

  const filteredTranslations = translations.filter(
    t => t.language === language && t.namespace === namespace
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          {namespace} - {language.toUpperCase()}
        </h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Pridať preklad
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pridať nový preklad</DialogTitle>
              <DialogDescription>
                Vytvorte nový preklad pre {language.toUpperCase()} jazyk.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="key">Kľúč</Label>
                <Input
                  id="key"
                  value={newTranslation.key}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, key: e.target.value }))}
                  placeholder="napr. dashboard.title"
                />
              </div>
              <div>
                <Label htmlFor="namespace">Namespace</Label>
                <Select 
                  value={newTranslation.namespace} 
                  onValueChange={(value) => setNewTranslation(prev => ({ ...prev, namespace: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {namespaces.map((ns) => (
                      <SelectItem key={ns} value={ns}>
                        {ns}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="value">Preklad</Label>
                <Textarea
                  id="value"
                  value={newTranslation.value}
                  onChange={(e) => setNewTranslation(prev => ({ ...prev, value: e.target.value }))}
                  placeholder="Zadajte preklad..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Zrušiť
              </Button>
              <Button onClick={handleCreateTranslation} disabled={!newTranslation.key || !newTranslation.value}>
                Vytvoriť
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {filteredTranslations.map((translation) => (
          <Card key={translation.id}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-sm font-medium">{translation.key}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    {translation.is_system && (
                      <Badge variant="secondary" className="text-xs">
                        Systémový
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {translation.namespace}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingId === translation.id ? (
                    <>
                      <Button size="sm" variant="outline" onClick={handleEditSave}>
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleEditStart(translation)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!translation.is_system && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Zmazať preklad</AlertDialogTitle>
                              <AlertDialogDescription>
                                Naozaj chcete zmazať tento preklad? Táto akcia sa nedá vrátiť späť.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(translation.id)}>
                                Zmazať
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === translation.id ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="min-h-[60px]"
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {translation.value}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredTranslations.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Žiadne preklady pre tento namespace a jazyk.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};