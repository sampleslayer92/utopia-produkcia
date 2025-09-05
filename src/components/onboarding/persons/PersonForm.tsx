import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Person } from "@/types/person";
import { useTranslation } from "react-i18next";

interface PersonFormProps {
  person?: Person;
  onSave: (personData: Omit<Person, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const PersonForm = ({ person, onSave, onCancel, isLoading }: PersonFormProps) => {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<Omit<Person, 'id' | 'created_at' | 'updated_at'>>({
    first_name: person?.first_name || '',
    last_name: person?.last_name || '',
    email: person?.email || '',
    phone: person?.phone || '',
    birth_date: person?.birth_date || '',
    birth_place: person?.birth_place || '',
    birth_number: person?.birth_number || '',
    permanent_address: person?.permanent_address || '',
    citizenship: person?.citizenship || 'SK',
    maiden_name: person?.maiden_name || '',
    document_type: person?.document_type || 'OP',
    document_number: person?.document_number || '',
    document_issuer: person?.document_issuer || '',
    document_country: person?.document_country || 'SK',
    document_validity: person?.document_validity || '',
    position: person?.position || '',
    is_politically_exposed: person?.is_politically_exposed || false,
    is_us_citizen: person?.is_us_citizen || false,
    is_predefined: person?.is_predefined || false,
  });

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const isValid = formData.first_name.trim() && formData.last_name.trim();

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">Meno *</Label>
            <Input
              id="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="last_name">Priezvisko *</Label>
            <Input
              id="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Telefón</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="birth_date">Dátum narodenia</Label>
            <Input
              id="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleInputChange('birth_date', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="birth_place">Miesto narodenia</Label>
            <Input
              id="birth_place"
              value={formData.birth_place}
              onChange={(e) => handleInputChange('birth_place', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="birth_number">Rodné číslo</Label>
            <Input
              id="birth_number"
              value={formData.birth_number}
              onChange={(e) => handleInputChange('birth_number', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="citizenship">Štátna príslušnosť</Label>
            <Select 
              value={formData.citizenship} 
              onValueChange={(value) => handleInputChange('citizenship', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SK">Slovenská</SelectItem>
                <SelectItem value="CZ">Česká</SelectItem>
                <SelectItem value="HU">Maďarská</SelectItem>
                <SelectItem value="PL">Poľská</SelectItem>
                <SelectItem value="AT">Rakúska</SelectItem>
                <SelectItem value="DE">Nemecká</SelectItem>
                <SelectItem value="other">Iná</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="position">Pozícia</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange('position', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="document_type">Typ dokladu</Label>
            <Select 
              value={formData.document_type} 
              onValueChange={(value) => handleInputChange('document_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OP">Občiansky preukaz</SelectItem>
                <SelectItem value="Pas">Pas</SelectItem>
                <SelectItem value="ID">ID karta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="document_number">Číslo dokladu</Label>
            <Input
              id="document_number"
              value={formData.document_number}
              onChange={(e) => handleInputChange('document_number', e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="document_validity">Platnosť dokladu</Label>
            <Input
              id="document_validity"
              type="date"
              value={formData.document_validity}
              onChange={(e) => handleInputChange('document_validity', e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="permanent_address">Trvalá adresa</Label>
          <Textarea
            id="permanent_address"
            value={formData.permanent_address}
            onChange={(e) => handleInputChange('permanent_address', e.target.value)}
            rows={3}
          />
        </div>
        
        <div>
          <Label htmlFor="maiden_name">Rodné priezvisko</Label>
          <Input
            id="maiden_name"
            value={formData.maiden_name}
            onChange={(e) => handleInputChange('maiden_name', e.target.value)}
          />
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_politically_exposed"
              checked={formData.is_politically_exposed}
              onCheckedChange={(checked) => handleInputChange('is_politically_exposed', !!checked)}
            />
            <Label htmlFor="is_politically_exposed">
              Politicky exponovaná osoba
            </Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_us_citizen"
              checked={formData.is_us_citizen}
              onCheckedChange={(checked) => handleInputChange('is_us_citizen', !!checked)}
            />
            <Label htmlFor="is_us_citizen">
              Občan USA
            </Label>
          </div>
        </div>
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            disabled={!isValid || isLoading}
          >
            {isLoading ? 'Ukladám...' : (person ? 'Aktualizovať' : 'Pridať')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Zrušiť
          </Button>
        </div>
      </form>
    </Card>
  );
};