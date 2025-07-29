import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TemplateStyleEditorProps {
  styleData: any;
  footerData: any;
  onChange: (styleData: any, footerData: any) => void;
}

export const TemplateStyleEditor: React.FC<TemplateStyleEditorProps> = ({
  styleData,
  footerData,
  onChange
}) => {
  const handleStyleChange = (field: string, value: any) => {
    onChange({
      ...styleData,
      [field]: value
    }, footerData);
  };

  const handleFooterChange = (field: string, value: any) => {
    onChange(styleData, {
      ...footerData,
      [field]: value
    });
  };

  const fontFamilies = [
    'Arial, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Georgia, serif',
    'Verdana, sans-serif',
    'Tahoma, sans-serif'
  ];

  const pageFormats = [
    { value: 'A4', label: 'A4 (210 × 297 mm)' },
    { value: 'A3', label: 'A3 (297 × 420 mm)' },
    { value: 'Letter', label: 'Letter (216 × 279 mm)' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Štýl dokumentu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primárna farba</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="primaryColor"
                  value={styleData.primaryColor || '#1E90FF'}
                  onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                  className="w-12 h-10 border border-input rounded cursor-pointer"
                />
                <Input
                  value={styleData.primaryColor || '#1E90FF'}
                  onChange={(e) => handleStyleChange('primaryColor', e.target.value)}
                  placeholder="#1E90FF"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontFamily">Rodina fontov</Label>
              <select
                id="fontFamily"
                value={styleData.fontFamily || 'Arial, sans-serif'}
                onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                {fontFamilies.map(font => (
                  <option key={font} value={font}>
                    {font.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fontSize">Veľkosť fontu</Label>
              <Input
                id="fontSize"
                value={styleData.fontSize || '12px'}
                onChange={(e) => handleStyleChange('fontSize', e.target.value)}
                placeholder="12px"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageFormat">Formát stránky</Label>
              <select
                id="pageFormat"
                value={styleData.pageFormat || 'A4'}
                onChange={(e) => handleStyleChange('pageFormat', e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md"
              >
                {pageFormats.map(format => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="margin">Okraje stránky</Label>
              <Input
                id="margin"
                value={styleData.margin || '20px'}
                onChange={(e) => handleStyleChange('margin', e.target.value)}
                placeholder="20px"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pätička dokumentu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brandingText">Text brandu</Label>
              <Input
                id="brandingText"
                value={footerData.brandingText || 'ONEPOS'}
                onChange={(e) => handleFooterChange('brandingText', e.target.value)}
                placeholder="ONEPOS"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageNumberFormat">Formát číslovania stránok</Label>
              <Input
                id="pageNumberFormat"
                value={footerData.pageNumberFormat || 'Strana {page}/{totalPages}'}
                onChange={(e) => handleFooterChange('pageNumberFormat', e.target.value)}
                placeholder="Strana {page}/{totalPages}"
              />
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            <p><strong>Dostupné premenné:</strong></p>
            <ul className="list-disc list-inside">
              <li><code>{'{page}'}</code> - aktuálne číslo stránky</li>
              <li><code>{'{totalPages}'}</code> - celkový počet stránok</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Náhľad štýlu</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border rounded-lg p-6"
            style={{ 
              fontFamily: styleData.fontFamily || 'Arial, sans-serif',
              fontSize: styleData.fontSize || '12px'
            }}
          >
            <div 
              className="text-white text-center font-bold p-4 rounded mb-4"
              style={{ backgroundColor: styleData.primaryColor || '#1E90FF' }}
            >
              Ukážka hlavičky dokumentu
            </div>
            
            <div className="space-y-3">
              <h3 className="font-bold text-lg">1. UKÁŽKOVÁ SEKCIA</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="border p-2 rounded">
                  <label className="text-sm font-medium">Pole 1:</label>
                  <div className="border-b border-dotted">Ukážkový obsah</div>
                </div>
                <div className="border p-2 rounded">
                  <label className="text-sm font-medium">Pole 2:</label>
                  <div className="border-b border-dotted">Ukážkový obsah</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="font-bold">
                {footerData.brandingText || 'ONEPOS'}
              </div>
              <div>
                {footerData.pageNumberFormat?.replace('{page}', '1').replace('{totalPages}', '3') || 'Strana 1/3'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};