import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { TemplateHeaderEditor } from "./TemplateHeaderEditor";
import { TemplateSectionEditor } from "./TemplateSectionEditor";
import { TemplateStyleEditor } from "./TemplateStyleEditor";
import { ContractTemplatePreview } from "./ContractTemplatePreview";

interface ContractTemplateEditorProps {
  template?: any;
  onSave: (templateData: any) => void;
  onCancel: () => void;
  mode: 'create' | 'edit';
}

export const ContractTemplateEditor: React.FC<ContractTemplateEditorProps> = ({
  template,
  onSave,
  onCancel,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    template_data: {
      type: 'G1',
      header: {
        title: '',
        logoUrl: '/src/assets/onepos-logo.png',
        globalPaymentsLogoUrl: '/src/assets/global-payments-logo.png',
        backgroundColor: '#1E90FF'
      },
      sections: [],
      footer: {
        brandingText: 'ONEPOS',
        pageNumberFormat: 'Strana {page}/{totalPages}'
      },
      styling: {
        primaryColor: '#1E90FF',
        fontFamily: 'Arial, sans-serif',
        fontSize: '12px',
        margin: '20px',
        pageFormat: 'A4'
      }
    }
  });

  const [currentTab, setCurrentTab] = useState('basic');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name || '',
        description: template.description || '',
        is_active: template.is_active ?? true,
        template_data: template.template_data || formData.template_data
      });
    }
  }, [template]);

  const handleBasicChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTemplateDataChange = (path: string[], value: any) => {
    setFormData(prev => {
      const newTemplateData = { ...prev.template_data };
      let current = newTemplateData;
      
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      current[path[path.length - 1]] = value;
      
      return {
        ...prev,
        template_data: newTemplateData
      };
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (isPreviewMode) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Späť na editáciu
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Uložiť šablónu
          </Button>
        </div>
        <ContractTemplatePreview 
          template={{ ...template, ...formData }}
          onBack={() => setIsPreviewMode(false)}
          onEdit={() => setIsPreviewMode(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Späť
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {mode === 'create' ? 'Nová šablóna' : 'Upraviť šablónu'}
            </h1>
            <p className="text-muted-foreground">
              {mode === 'create' 
                ? 'Vytvorte novú šablónu pre generovanie PDF dokumentov'
                : 'Upravte existujúcu šablónu'
              }
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPreviewMode(true)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Náhľad
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Uložiť
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Základné</TabsTrigger>
          <TabsTrigger value="header">Hlavička</TabsTrigger>
          <TabsTrigger value="sections">Sekcie</TabsTrigger>
          <TabsTrigger value="styling">Štýly</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Základné informácie</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Názov šablóny</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleBasicChange('name', e.target.value)}
                    placeholder="Zadajte názov šablóny"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Typ šablóny</Label>
                  <select
                    id="type"
                    value={formData.template_data.type}
                    onChange={(e) => handleTemplateDataChange(['type'], e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-md"
                  >
                    <option value="G1">G1 - Žiadosť o akceptáciu</option>
                    <option value="G2">G2 - Skutočný majiteľ</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Popis</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleBasicChange('description', e.target.value)}
                  placeholder="Zadajte popis šablóny"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleBasicChange('is_active', checked)}
                />
                <Label htmlFor="is_active">Šablóna je aktívna</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="header">
          <TemplateHeaderEditor
            headerData={formData.template_data.header}
            onChange={(headerData) => handleTemplateDataChange(['header'], headerData)}
          />
        </TabsContent>

        <TabsContent value="sections">
          <TemplateSectionEditor
            sections={formData.template_data.sections}
            templateType={formData.template_data.type}
            onChange={(sections) => handleTemplateDataChange(['sections'], sections)}
          />
        </TabsContent>

        <TabsContent value="styling">
          <TemplateStyleEditor
            styleData={formData.template_data.styling}
            footerData={formData.template_data.footer}
            onChange={(styleData, footerData) => {
              handleTemplateDataChange(['styling'], styleData);
              handleTemplateDataChange(['footer'], footerData);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};