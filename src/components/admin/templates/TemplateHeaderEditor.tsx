import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface TemplateHeaderEditorProps {
  headerData: any;
  onChange: (headerData: any) => void;
}

export const TemplateHeaderEditor: React.FC<TemplateHeaderEditorProps> = ({
  headerData,
  onChange
}) => {
  const handleChange = (field: string, value: any) => {
    onChange({
      ...headerData,
      [field]: value
    });
  };

  const handleLogoUpload = (field: string) => {
    // Placeholder pre budúcu implementáciu upload funktionality
    console.log('Logo upload for:', field);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nastavenia hlavičky</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Názov dokumentu</Label>
          <Input
            id="title"
            value={headerData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Zadajte názov dokumentu"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>ONEPOS Logo</Label>
            <div className="flex items-center gap-2">
              <Input
                value={headerData.logoUrl || ''}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                placeholder="URL alebo cesta k logu"
                readOnly
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLogoUpload('logoUrl')}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Global Payments Logo</Label>
            <div className="flex items-center gap-2">
              <Input
                value={headerData.globalPaymentsLogoUrl || ''}
                onChange={(e) => handleChange('globalPaymentsLogoUrl', e.target.value)}
                placeholder="URL alebo cesta k logu"
                readOnly
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleLogoUpload('globalPaymentsLogoUrl')}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Farba pozadia hlavičky</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="backgroundColor"
              value={headerData.backgroundColor || '#1E90FF'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-10 border border-input rounded cursor-pointer"
            />
            <Input
              value={headerData.backgroundColor || '#1E90FF'}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              placeholder="#1E90FF"
            />
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">Náhľad hlavičky</h4>
          <div 
            className="p-4 rounded text-white text-center font-bold"
            style={{ backgroundColor: headerData.backgroundColor || '#1E90FF' }}
          >
            {headerData.title || 'Názov dokumentu'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};