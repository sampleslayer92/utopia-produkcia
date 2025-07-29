import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, Copy, Trash2 } from "lucide-react";
import { useContractTemplates } from "@/hooks/useContractTemplates";
import { ContractTemplateEditor } from "@/components/admin/templates/ContractTemplateEditor";
import { ContractTemplatePreview } from "@/components/admin/templates/ContractTemplatePreview";
import { toast } from "sonner";

const ContractTemplatesPage = () => {
  const { t } = useTranslation('admin');
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useContractTemplates();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [mode, setMode] = useState<'list' | 'edit' | 'preview' | 'create'>('list');

  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setMode('create');
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setMode('edit');
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setMode('preview');
  };

  const handleDuplicate = async (template: any) => {
    try {
      await createTemplate({
        name: `${template.name} (Kópia)`,
        description: template.description,
        template_data: template.template_data,
        is_active: false
      });
      toast.success('Šablóna bola skopírovaná');
    } catch (error) {
      toast.error('Chyba pri kopírovaní šablóny');
    }
  };

  const handleDelete = async (template: any) => {
    if (window.confirm('Ste si istí, že chcete odstrániť túto šablónu?')) {
      try {
        await deleteTemplate(template.id);
      } catch (error) {
        toast.error('Chyba pri odstraňovaní šablóny');
      }
    }
  };

  const handleSave = async (templateData: any) => {
    try {
      if (mode === 'create') {
        await createTemplate(templateData);
        toast.success('Šablóna bola vytvorená');
      } else if (mode === 'edit' && selectedTemplate) {
        await updateTemplate(selectedTemplate.id, templateData);
        toast.success('Šablóna bola aktualizovaná');
      }
      setMode('list');
      setSelectedTemplate(null);
    } catch (error) {
      toast.error('Chyba pri ukladaní šablóny');
    }
  };

  const renderTemplateList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Šablóny kontraktov</h1>
          <p className="text-muted-foreground">
            Spravujte šablóny pre generovanie PDF dokumentov
          </p>
        </div>
        <Button onClick={handleCreateNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nová šablóna
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <Badge variant={template.is_active ? "default" : "secondary"}>
                    {template.is_active ? 'Aktívne' : 'Neaktívne'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Typ: {template.template_data?.type || 'Neznámy'}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePreview(template)}
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(template)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDuplicate(template)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(template)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  if (mode === 'edit' || mode === 'create') {
  return (
    <AdminLayout title={mode === 'create' ? 'Nová šablóna' : 'Upraviť šablónu'}>
      <ContractTemplateEditor
        template={selectedTemplate}
        onSave={handleSave}
        onCancel={() => setMode('list')}
        mode={mode}
      />
    </AdminLayout>
  );
  }

  if (mode === 'preview') {
    return (
      <AdminLayout title="Náhľad šablóny">
        <ContractTemplatePreview
          template={selectedTemplate}
          onBack={() => setMode('list')}
          onEdit={() => setMode('edit')}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Šablóny kontraktov">
      {renderTemplateList()}
    </AdminLayout>
  );
};

export default ContractTemplatesPage;