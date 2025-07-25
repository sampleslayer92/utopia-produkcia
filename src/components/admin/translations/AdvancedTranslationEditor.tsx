import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  FileText, 
  Globe, 
  Filter,
  Download,
  Upload,
  CheckSquare,
  Square,
  MoreHorizontal,
  Eye,
  Copy,
  Archive
} from 'lucide-react';
import { useUpdateTranslation, useDeleteTranslation, useCreateTranslation, useBulkUpdateTranslations, useExportTranslations, Translation } from '@/hooks/useTranslations';
import { useToast } from '@/hooks/use-toast';

interface AdvancedTranslationEditorProps {
  translations: Translation[];
  language: string;
  namespace: string;
  namespaces: string[];
  languages: string[];
}

interface NewTranslation {
  key: string;
  namespace: string;
  language: string;
  value: string;
  is_system: boolean;
}

export const AdvancedTranslationEditor: React.FC<AdvancedTranslationEditorProps> = ({
  translations,
  language,
  namespace,
  namespaces,
  languages
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'system' | 'custom'>('all');
  const [selectedTranslations, setSelectedTranslations] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [newTranslation, setNewTranslation] = useState<NewTranslation>({
    key: '',
    namespace,
    language,
    value: '',
    is_system: false,
  });

  const updateTranslation = useUpdateTranslation();
  const deleteTranslation = useDeleteTranslation();
  const createTranslation = useCreateTranslation();
  const bulkUpdate = useBulkUpdateTranslations();
  const exportTranslations = useExportTranslations();
  const { toast } = useToast();

  // Filter and search logic
  const filteredTranslations = useMemo(() => {
    let filtered = translations;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        t => 
          t.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.namespace.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType === 'system') {
      filtered = filtered.filter(t => t.is_system);
    } else if (filterType === 'custom') {
      filtered = filtered.filter(t => !t.is_system);
    }

    return filtered.sort((a, b) => {
      if (a.namespace !== b.namespace) {
        return a.namespace.localeCompare(b.namespace);
      }
      return a.key.localeCompare(b.key);
    });
  }, [translations, searchTerm, filterType]);

  // Group translations by namespace for better display
  const groupedTranslations = useMemo(() => {
    const groups: Record<string, Translation[]> = {};
    filteredTranslations.forEach(translation => {
      if (!groups[translation.namespace]) {
        groups[translation.namespace] = [];
      }
      groups[translation.namespace].push(translation);
    });
    return groups;
  }, [filteredTranslations]);

  const handleEditStart = (translation: Translation) => {
    setEditingId(translation.id);
    setEditValue(translation.value);
  };

  const handleEditSave = async () => {
    if (editingId) {
      await updateTranslation.mutateAsync({ id: editingId, value: editValue });
      setEditingId(null);
      setEditValue('');
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditValue('');
  };

  const handleDelete = async (id: string) => {
    await deleteTranslation.mutateAsync(id);
  };

  const handleCreateTranslation = async () => {
    if (!newTranslation.key || !newTranslation.value) {
      toast({
        title: 'Chyba',
        description: 'Kľúč a hodnota sú povinné.',
        variant: 'destructive',
      });
      return;
    }

    await createTranslation.mutateAsync(newTranslation);
    setShowAddDialog(false);
    setNewTranslation({
      key: '',
      namespace,
      language,
      value: '',
      is_system: false,
    });
  };

  const handleSelectTranslation = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedTranslations);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedTranslations(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTranslations(new Set(filteredTranslations.map(t => t.id)));
    } else {
      setSelectedTranslations(new Set());
    }
  };

  const handleBulkDelete = async () => {
    const deletePromises = Array.from(selectedTranslations).map(id => 
      deleteTranslation.mutateAsync(id)
    );
    
    try {
      await Promise.all(deletePromises);
      setSelectedTranslations(new Set());
      toast({
        title: 'Hromadné mazanie úspešné',
        description: `${selectedTranslations.size} prekladov bolo zmazaných.`,
      });
    } catch (error) {
      toast({
        title: 'Chyba pri hromadnom mazaní',
        description: 'Niektoré preklady sa nepodarilo zmazať.',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    exportTranslations.mutate({ language, namespace });
  };

  const isAllSelected = filteredTranslations.length > 0 && 
    filteredTranslations.every(t => selectedTranslations.has(t.id));
  const isPartiallySelected = selectedTranslations.size > 0 && !isAllSelected;

  if (viewMode === 'cards') {
    return (
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Vyhľadať v prekladoch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky</SelectItem>
                <SelectItem value="system">Systémové</SelectItem>
                <SelectItem value="custom">Vlastné</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode('table')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Tabuľka
            </Button>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Pridať preklad
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nový preklad</DialogTitle>
                  <DialogDescription>
                    Pridať nový preklad do databázy
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="key">Kľúč</Label>
                    <Input
                      id="key"
                      value={newTranslation.key}
                      onChange={(e) => setNewTranslation({...newTranslation, key: e.target.value})}
                      placeholder="napr. buttons.save"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="namespace">Namespace</Label>
                    <Select
                      value={newTranslation.namespace}
                      onValueChange={(value) => setNewTranslation({...newTranslation, namespace: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {namespaces.map(ns => (
                          <SelectItem key={ns} value={ns}>{ns}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="language">Jazyk</Label>
                    <Select
                      value={newTranslation.language}
                      onValueChange={(value) => setNewTranslation({...newTranslation, language: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map(lang => (
                          <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="value">Hodnota</Label>
                    <Textarea
                      id="value"
                      value={newTranslation.value}
                      onChange={(e) => setNewTranslation({...newTranslation, value: e.target.value})}
                      placeholder="Text prekladu"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_system"
                      checked={newTranslation.is_system}
                      onCheckedChange={(checked) => setNewTranslation({...newTranslation, is_system: !!checked})}
                    />
                    <Label htmlFor="is_system">Systémový preklad</Label>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Zrušiť
                  </Button>
                  <Button onClick={handleCreateTranslation}>
                    Vytvoriť
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {selectedTranslations.size > 0 && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <span className="text-sm">
                Vybrané: {selectedTranslations.size} prekladov
              </span>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Zmazať vybrané
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedTranslations(new Set())}
              >
                Zrušiť výber
              </Button>
            </div>
          )}
        </div>

        {/* Cards View */}
        <div className="grid gap-4">
          {Object.entries(groupedTranslations).map(([ns, nsTranslations]) => (
            <Card key={ns}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {ns}
                  <Badge variant="secondary">
                    {nsTranslations.length} prekladov
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {nsTranslations.map(translation => (
                    <div key={translation.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <Checkbox
                        checked={selectedTranslations.has(translation.id)}
                        onCheckedChange={(checked) => handleSelectTranslation(translation.id, !!checked)}
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {translation.key}
                          </code>
                          {translation.is_system && (
                            <Badge variant="outline" className="text-xs">
                              Systémový
                            </Badge>
                          )}
                        </div>
                        
                        {editingId === translation.id ? (
                          <div className="space-y-2">
                            <Textarea
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              rows={2}
                              className="text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleEditSave}>
                                <Save className="h-4 w-4 mr-1" />
                                Uložiť
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleEditCancel}>
                                <X className="h-4 w-4 mr-1" />
                                Zrušiť
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className="text-sm text-foreground">{translation.value}</p>
                          </div>
                        )}
                      </div>
                      
                      {editingId !== translation.id && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStart(translation)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          {!translation.is_system && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Potvrdiť zmazanie</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Naozaj chcete zmazať preklad "{translation.key}"?
                                    Táto akcia je nevratná.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(translation.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Zmazať
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTranslations.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Žiadne preklady</h3>
              <p className="text-muted-foreground text-center mb-4">
                Pre vybraný jazyk "{language}" a namespace "{namespace}" neboli nájdené žiadne preklady.
              </p>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Pridať prvý preklad
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Table View
  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Vyhľadať v prekladoch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Všetky</SelectItem>
              <SelectItem value="system">Systémové</SelectItem>
              <SelectItem value="custom">Vlastné</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Karty
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Pridať preklad
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nový preklad</DialogTitle>
                <DialogDescription>
                  Pridať nový preklad do databázy
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="key">Kľúč</Label>
                  <Input
                    id="key"
                    value={newTranslation.key}
                    onChange={(e) => setNewTranslation({...newTranslation, key: e.target.value})}
                    placeholder="napr. buttons.save"
                  />
                </div>
                
                <div>
                  <Label htmlFor="namespace">Namespace</Label>
                  <Select
                    value={newTranslation.namespace}
                    onValueChange={(value) => setNewTranslation({...newTranslation, namespace: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {namespaces.map(ns => (
                        <SelectItem key={ns} value={ns}>{ns}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="language">Jazyk</Label>
                  <Select
                    value={newTranslation.language}
                    onValueChange={(value) => setNewTranslation({...newTranslation, language: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang} value={lang}>{lang.toUpperCase()}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="value">Hodnota</Label>
                  <Textarea
                    id="value"
                    value={newTranslation.value}
                    onChange={(e) => setNewTranslation({...newTranslation, value: e.target.value})}
                    placeholder="Text prekladu"
                    rows={3}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is_system"
                    checked={newTranslation.is_system}
                    onCheckedChange={(checked) => setNewTranslation({...newTranslation, is_system: !!checked})}
                  />
                  <Label htmlFor="is_system">Systémový preklad</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Zrušiť
                </Button>
                <Button onClick={handleCreateTranslation}>
                  Vytvoriť
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {selectedTranslations.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <span className="text-sm">
              Vybrané: {selectedTranslations.size} prekladov
            </span>
            <Separator orientation="vertical" className="h-4" />
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Zmazať vybrané
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedTranslations(new Set())}
            >
              Zrušiť výber
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={isAllSelected}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Kľúč</TableHead>
                  <TableHead>Namespace</TableHead>
                  <TableHead>Hodnota</TableHead>
                  <TableHead>Typ</TableHead>
                  <TableHead className="w-[100px]">Akcie</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTranslations.map(translation => (
                  <TableRow key={translation.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedTranslations.has(translation.id)}
                        onCheckedChange={(checked) => handleSelectTranslation(translation.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {translation.key}
                      </code>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{translation.namespace}</Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      {editingId === translation.id ? (
                        <div className="space-y-2">
                          <Textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleEditSave}>
                              <Save className="h-4 w-4 mr-1" />
                              Uložiť
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleEditCancel}>
                              <X className="h-4 w-4 mr-1" />
                              Zrušiť
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="truncate" title={translation.value}>
                          {translation.value}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {translation.is_system ? (
                        <Badge variant="secondary">Systémový</Badge>
                      ) : (
                        <Badge variant="outline">Vlastný</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId !== translation.id && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStart(translation)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          
                          {!translation.is_system && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Potvrdiť zmazanie</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Naozaj chcete zmazať preklad "{translation.key}"?
                                    Táto akcia je nevratná.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Zrušiť</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(translation.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Zmazať
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      {filteredTranslations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Globe className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Žiadne preklady</h3>
            <p className="text-muted-foreground text-center mb-4">
              Pre vybraný jazyk "{language}" a namespace "{namespace}" neboli nájdené žiadne preklady.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Pridať prvý preklad
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};