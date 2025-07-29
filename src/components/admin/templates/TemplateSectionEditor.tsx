import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GripVertical, Edit2 } from "lucide-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from "./SortableItem";
import { SectionFieldEditor } from "./SectionFieldEditor";

interface TemplateSectionEditorProps {
  sections: any[];
  templateType: string;
  onChange: (sections: any[]) => void;
}

export const TemplateSectionEditor: React.FC<TemplateSectionEditorProps> = ({
  sections,
  templateType,
  onChange
}) => {
  const [editingSection, setEditingSection] = useState<number | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = sections.findIndex(section => section.id === active.id);
      const newIndex = sections.findIndex(section => section.id === over.id);
      
      onChange(arrayMove(sections, oldIndex, newIndex));
    }
  };

  const addSection = () => {
    const newSection = {
      id: `section_${Date.now()}`,
      title: 'Nová sekcia',
      fields: [],
      type: 'form'
    };
    
    onChange([...sections, newSection]);
    setEditingSection(sections.length);
  };

  const updateSection = (index: number, sectionData: any) => {
    const updatedSections = [...sections];
    updatedSections[index] = sectionData;
    onChange(updatedSections);
  };

  const deleteSection = (index: number) => {
    const updatedSections = sections.filter((_, i) => i !== index);
    onChange(updatedSections);
    setEditingSection(null);
  };

  const getDefaultSections = () => {
    if (templateType === 'G1') {
      return [
        {
          id: 'company_info',
          title: '1. ÚDAJE O SPOLEČNOSTI',
          type: 'form',
          fields: [
            { key: 'company_name', label: 'Název společnosti', type: 'text', required: true },
            { key: 'ico', label: 'IČO', type: 'text', required: true },
            { key: 'dic', label: 'DIČ', type: 'text', required: true },
            { key: 'ic_dph', label: 'IČ DPH', type: 'text', required: false },
            { key: 'street', label: 'Sídlo - ulice', type: 'text', required: true },
            { key: 'house_number', label: 'Číslo popisné', type: 'text', required: true },
            { key: 'city', label: 'Město', type: 'text', required: true },
            { key: 'postal_code', label: 'PSČ', type: 'text', required: true },
            { key: 'country', label: 'Země', type: 'text', required: true },
            { key: 'phone', label: 'Telefon', type: 'text', required: true },
            { key: 'email', label: 'E-mail', type: 'email', required: true }
          ]
        },
        {
          id: 'business_contact',
          title: 'Kontaktní osoba pro obchodní záležitosti',
          type: 'form',
          fields: [
            { key: 'business_contact_name', label: 'Jméno a příjmení', type: 'text', required: true },
            { key: 'business_contact_phone', label: 'Telefon', type: 'text', required: true },
            { key: 'business_contact_email', label: 'E-mail', type: 'email', required: true }
          ]
        },
        {
          id: 'technical_contact',
          title: 'Kontaktní osoba pro technické záležitosti (pokud je jiná)',
          type: 'form',
          fields: [
            { key: 'technical_contact_name', label: 'Jméno a příjmení', type: 'text', required: false },
            { key: 'technical_contact_phone', label: 'Telefon', type: 'text', required: false },
            { key: 'technical_contact_email', label: 'E-mail', type: 'email', required: false }
          ]
        },
        {
          id: 'business_location',
          title: '2. ÚDAJE O PROVOZOVNE OBCHODNÍKA',
          type: 'form',
          fields: [
            { key: 'location_name', label: 'Název provozovny', type: 'text', required: true },
            { key: 'location_street', label: 'Adresa - ulice', type: 'text', required: true },
            { key: 'location_house_number', label: 'Číslo popisné', type: 'text', required: true },
            { key: 'location_city', label: 'Město', type: 'text', required: true },
            { key: 'location_postal_code', label: 'PSČ', type: 'text', required: true },
            { key: 'location_country', label: 'Země', type: 'text', required: true },
            { key: 'location_phone', label: 'Telefon', type: 'text', required: true },
            { key: 'ecommerce', label: 'ECOMMERCE', type: 'checkbox', required: false },
            { key: 'pos', label: 'POS', type: 'checkbox', required: false },
            { key: 'website_url', label: 'URL obchodu', type: 'url', required: false },
            { key: 'currency_czk', label: 'CZK', type: 'checkbox', required: false },
            { key: 'currency_eur', label: 'EUR', type: 'checkbox', required: false },
            { key: 'currency_other', label: 'Jiná měna', type: 'text', required: false },
            { key: 'mcc_code', label: 'MCC kód', type: 'text', required: true },
            { key: 'business_description', label: 'Popis činnosti', type: 'textarea', required: true }
          ]
        }
      ];
    } else {
      return [
        {
          id: 'authorized_persons',
          title: '1. OPRÁVNĚNÉ OSOBY',
          type: 'dynamic_form',
          fields: [
            { key: 'first_name', label: 'Jméno', type: 'text', required: true },
            { key: 'last_name', label: 'Příjmení', type: 'text', required: true },
            { key: 'birth_date', label: 'Datum narození', type: 'date', required: true }
          ]
        }
      ];
    }
  };

  const loadDefaultSections = () => {
    onChange(getDefaultSections());
  };

  if (editingSection !== null) {
    return (
      <SectionFieldEditor
        section={sections[editingSection]}
        onSave={(sectionData) => {
          updateSection(editingSection, sectionData);
          setEditingSection(null);
        }}
        onCancel={() => setEditingSection(null)}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sekcie dokumentu</CardTitle>
          <div className="flex gap-2">
            {sections.length === 0 && (
              <Button variant="outline" onClick={loadDefaultSections}>
                Načítať predvolené
              </Button>
            )}
            <Button onClick={addSection} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Pridať sekciu
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {sections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Žiadne sekcie nie sú definované</p>
            <p className="text-sm">Kliknite na "Pridať sekciu" alebo "Načítať predvolené"</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {sections.map((section, index) => (
                  <SortableItem key={section.id} id={section.id}>
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-card">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <div>
                          <div className="font-medium">{section.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {section.fields?.length || 0} polí • Typ: {section.type || 'form'}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingSection(index)}
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteSection(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </CardContent>
    </Card>
  );
};