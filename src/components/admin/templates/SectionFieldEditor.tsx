import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Plus, Trash2, Save, Table } from "lucide-react";
import { TableLayoutEditor } from "./TableLayoutEditor";

interface SectionFieldEditorProps {
  section: any;
  onSave: (section: any) => void;
  onCancel: () => void;
}

export const SectionFieldEditor: React.FC<SectionFieldEditorProps> = ({
  section,
  onSave,
  onCancel
}) => {
  const [sectionData, setSectionData] = useState({
    ...section,
    fields: section.fields || []
  });

  const updateSectionData = (field: string, value: any) => {
    setSectionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addField = () => {
    const newField = {
      key: `field_${Date.now()}`,
      label: 'Nové pole',
      type: 'text',
      required: false
    };
    
    setSectionData(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));
  };

  const updateField = (index: number, field: string, value: any) => {
    setSectionData(prev => ({
      ...prev,
      fields: prev.fields.map((f: any, i: number) => 
        i === index ? { ...f, [field]: value } : f
      )
    }));
  };

  const deleteField = (index: number) => {
    setSectionData(prev => ({
      ...prev,
      fields: prev.fields.filter((_: any, i: number) => i !== index)
    }));
  };

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'tel', label: 'Telefón' },
    { value: 'date', label: 'Dátum' },
    { value: 'number', label: 'Číslo' },
    { value: 'textarea', label: 'Textová oblasť' },
    { value: 'select', label: 'Výber' },
    { value: 'checkbox', label: 'Zaškrtávacia políčka' },
    { value: 'signature', label: 'Podpis' }
  ];

  const sectionTypes = [
    { value: 'form', label: 'Formulár' },
    { value: 'dynamic_form', label: 'Dynamický formulár' },
    { value: 'table_layout', label: 'Tabuľkový layout' },
    { value: 'dynamic_table', label: 'Dynamická tabuľka' },
    { value: 'checkbox_matrix', label: 'Matrica zaškrtávacích políčok' },
    { value: 'signature_area', label: 'Oblasť podpisu' }
  ];

  const [showTableEditor, setShowTableEditor] = useState(false);

  // Initialize table data if section type is table_layout
  React.useEffect(() => {
    if (sectionData.type === 'table_layout' && !sectionData.table) {
      setSectionData(prev => ({
        ...prev,
        table: {
          rows: 3,
          cols: 3,
          cells: Array.from({ length: 9 }, (_, i) => ({
            id: `cell_${Math.floor(i / 3)}_${i % 3}_${Date.now()}`,
            row: Math.floor(i / 3),
            col: i % 3,
            colspan: 1,
            rowspan: 1,
            type: 'empty'
          }))
        }
      }));
    }
  }, [sectionData.type]);

  // Show table editor for table_layout sections
  if (showTableEditor && sectionData.type === 'table_layout') {
    return (
      <TableLayoutEditor
        table={sectionData.table}
        onChange={(table) => setSectionData(prev => ({ ...prev, table }))}
        onClose={() => setShowTableEditor(false)}
      />
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
          <h2 className="text-xl font-semibold">Upraviť sekciu</h2>
        </div>
        <Button onClick={() => onSave(sectionData)} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Uložiť sekciu
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nastavenia sekcie</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Názov sekcie</Label>
              <Input
                id="section-title"
                value={sectionData.title}
                onChange={(e) => updateSectionData('title', e.target.value)}
                placeholder="Zadajte názov sekcie"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-type">Typ sekcie</Label>
              <select
                id="section-type"
                value={sectionData.type || 'form'}
                onChange={(e) => updateSectionData('type', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                {sectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table Layout Section */}
      {sectionData.type === 'table_layout' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Tabuľkový layout</CardTitle>
              <Button 
                onClick={() => setShowTableEditor(true)} 
                className="flex items-center gap-2"
              >
                <Table className="h-4 w-4" />
                Upraviť tabuľku
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sectionData.table ? (
              <div className="text-sm text-muted-foreground">
                Tabuľka {sectionData.table.rows}×{sectionData.table.cols} s {sectionData.table.cells?.length || 0} bunkami
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>Tabuľka nie je definovaná</p>
                <p className="text-sm">Kliknite na "Upraviť tabuľku" pre vytvorenie layoutu</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Regular Fields Section - only show for non-table layouts */}
      {sectionData.type !== 'table_layout' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Polia sekcie</CardTitle>
              <Button onClick={addField} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Pridať pole
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sectionData.fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Žiadne polia nie sú definované</p>
                <p className="text-sm">Kliknite na "Pridať pole" pre vytvorenie nového poľa</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sectionData.fields.map((field: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label>Kľúč poľa</Label>
                        <Input
                          value={field.key}
                          onChange={(e) => updateField(index, 'key', e.target.value)}
                          placeholder="field_key"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Názov poľa</Label>
                        <Input
                          value={field.label}
                          onChange={(e) => updateField(index, 'label', e.target.value)}
                          placeholder="Názov poľa"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Typ poľa</Label>
                        <select
                          value={field.type}
                          onChange={(e) => updateField(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-input rounded-md"
                        >
                          {fieldTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required || false}
                          onCheckedChange={(checked) => updateField(index, 'required', checked)}
                        />
                        <Label>Povinné pole</Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteField(index)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};