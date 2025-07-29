import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Download, RefreshCw } from "lucide-react";
import { generateContractPDF } from "@/utils/pdfGenerator";
import { toast } from "sonner";

interface ContractTemplatePreviewProps {
  template: any;
  onBack: () => void;
  onEdit: () => void;
}

export const ContractTemplatePreview: React.FC<ContractTemplatePreviewProps> = ({
  template,
  onBack,
  onEdit
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data pre preview
  const mockData = {
    contract: {
      contract_number: 'CTR-2024-001',
      created_at: new Date().toISOString()
    },
    merchant: {
      company_name: 'Príklad s.r.o.',
      ico: '12345678',
      dic: '2023456789',
      vat_number: 'SK2023456789',
      address_street: 'Príkladová 123',
      address_city: 'Bratislava',
      address_zip_code: '81101'
    },
    contactInfo: {
      first_name: 'Ján',
      last_name: 'Novák',
      email: 'jan.novak@priklad.sk',
      phone: '+421 900 123 456',
      sales_note: 'Poznámka pre predaj'
    },
    businessLocations: [
      {
        id: '1',
        name: 'Hlavná pobočka',
        address: 'Príkladová 123, Bratislava',
        terminal_count: 2
      }
    ],
    contractItems: [
      {
        name: 'POS Terminál',
        count: 2,
        monthly_fee: 15.99,
        category: 'terminal'
      }
    ],
    authorizedPersons: [
      {
        first_name: 'Ján',
        last_name: 'Novák',
        birth_date: '1980-01-15',
        birth_place: 'Bratislava',
        position: 'Konateľ',
        document_type: 'OP',
        document_number: 'AB123456'
      }
    ],
    actualOwners: [
      {
        first_name: 'Ján',
        last_name: 'Novák',
        birth_date: '1980-01-15',
        birth_place: 'Bratislava',
        citizenship: 'SK',
        permanent_address: 'Príkladová 123, 81101 Bratislava'
      }
    ]
  };

  const handleGeneratePreview = async () => {
    setIsGenerating(true);
    try {
      let pdfBlob;
      
      if (template.template_data.type === 'G1') {
        pdfBlob = await generateContractPDF(mockData, 'G1', template.template_data);
      } else {
        pdfBlob = await generateContractPDF(mockData, 'G2', template.template_data);
      }
      
      // Vytvorenie URL pre preview
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, '_blank');
      
      toast.success('PDF náhľad bol vygenerovaný');
    } catch (error) {
      console.error('Chyba pri generovaní PDF:', error);
      toast.error('Chyba pri generovaní PDF náhľadu');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderTemplateInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle>Informácie o šablóne</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Názov:</strong> {template.name}
          </div>
          <div>
            <strong>Typ:</strong> {template.template_data?.type}
          </div>
          <div>
            <strong>Stav:</strong> {template.is_active ? 'Aktívne' : 'Neaktívne'}
          </div>
          <div>
            <strong>Vytvorené:</strong> {new Date(template.created_at).toLocaleDateString('sk-SK')}
          </div>
        </div>
        {template.description && (
          <div>
            <strong>Popis:</strong> {template.description}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderHeaderPreview = () => (
    <Card>
      <CardHeader>
        <CardTitle>Hlavička dokumentu</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="p-4 rounded border"
          style={{ backgroundColor: template.template_data?.header?.backgroundColor || '#1E90FF' }}
        >
          <div className="text-white text-center font-bold">
            {template.template_data?.header?.title || 'Názov dokumentu'}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSectionsPreview = () => (
    <Card>
      <CardHeader>
        <CardTitle>Sekcie dokumentu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {template.template_data?.sections?.map((section: any, index: number) => (
            <div key={index} className="border-l-4 border-primary pl-4">
              <div className="font-semibold">{section.title}</div>
              <div className="text-sm text-muted-foreground">
                {section.fields?.length || 0} polí
              </div>
            </div>
          )) || (
            <div className="text-muted-foreground">Žiadne sekcie nie sú definované</div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderStylePreview = () => (
    <Card>
      <CardHeader>
        <CardTitle>Štýl dokumentu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Primárna farba:</strong>
            <div 
              className="w-6 h-6 rounded border inline-block ml-2"
              style={{ backgroundColor: template.template_data?.styling?.primaryColor || '#1E90FF' }}
            />
          </div>
          <div>
            <strong>Font:</strong> {template.template_data?.styling?.fontFamily || 'Arial'}
          </div>
          <div>
            <strong>Veľkosť fontu:</strong> {template.template_data?.styling?.fontSize || '12px'}
          </div>
          <div>
            <strong>Formát stránky:</strong> {template.template_data?.styling?.pageFormat || 'A4'}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Späť
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Náhľad šablóny</h1>
            <p className="text-muted-foreground">{template.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleGeneratePreview}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isGenerating ? 'Generujem...' : 'PDF náhľad'}
          </Button>
          <Button onClick={onEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Upraviť
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {renderTemplateInfo()}
        {renderHeaderPreview()}
        {renderSectionsPreview()}
        {renderStylePreview()}
      </div>
    </div>
  );
};