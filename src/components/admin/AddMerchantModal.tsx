import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, User, MapPin, Loader2 } from "lucide-react";

interface AddMerchantModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface MerchantFormData {
  company_name: string;
  ico: string;
  dic: string;
  vat_number: string;
  contact_person_name: string;
  contact_person_email: string;
  contact_person_phone: string;
  address_street: string;
  address_city: string;
  address_zip_code: string;
}

const AddMerchantModal = ({ open, onOpenChange, onSuccess }: AddMerchantModalProps) => {
  const { t } = useTranslation('admin');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState<MerchantFormData>({
    company_name: '',
    ico: '',
    dic: '',
    vat_number: '',
    contact_person_name: '',
    contact_person_email: '',
    contact_person_phone: '',
    address_street: '',
    address_city: '',
    address_zip_code: ''
  });

  const handleInputChange = (field: keyof MerchantFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.company_name.trim()) {
      toast({
        title: "Chyba",
        description: "Názov spoločnosti je povinný",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.contact_person_name.trim()) {
      toast({
        title: "Chyba", 
        description: "Meno kontaktnej osoby je povinné",
        variant: "destructive"
      });
      return false;
    }
    
    if (!formData.contact_person_email.trim()) {
      toast({
        title: "Chyba",
        description: "Email kontaktnej osoby je povinný",
        variant: "destructive"
      });
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contact_person_email)) {
      toast({
        title: "Chyba",
        description: "Neplatný formát emailu",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('merchants')
        .insert([{
          company_name: formData.company_name.trim(),
          ico: formData.ico.trim() || null,
          dic: formData.dic.trim() || null,
          vat_number: formData.vat_number.trim() || null,
          contact_person_name: formData.contact_person_name.trim(),
          contact_person_email: formData.contact_person_email.trim(),
          contact_person_phone: formData.contact_person_phone.trim() || null,
          address_street: formData.address_street.trim() || null,
          address_city: formData.address_city.trim() || null,
          address_zip_code: formData.address_zip_code.trim() || null
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Úspech",
        description: "Merchant bol úspešne vytvorený"
      });
      
      // Reset form
      setFormData({
        company_name: '',
        ico: '',
        dic: '',
        vat_number: '',
        contact_person_name: '',
        contact_person_email: '',
        contact_person_phone: '',
        address_street: '',
        address_city: '',
        address_zip_code: ''
      });
      
      onOpenChange(false);
      onSuccess?.();
      
    } catch (error: any) {
      console.error('Error creating merchant:', error);
      toast({
        title: "Chyba",
        description: error.message || "Nastala chyba pri vytváraní merchanta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Nový merchant
          </DialogTitle>
          <DialogDescription>
            Pridať nového merchanta so základnými údajmi
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="h-4 w-4" />
              Informácie o spoločnosti
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="company_name">
                  Názov spoločnosti <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange('company_name')}
                  placeholder="Názov spoločnosti"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="ico">IČO</Label>
                <Input
                  id="ico"
                  value={formData.ico}
                  onChange={handleInputChange('ico')}
                  placeholder="12345678"
                />
              </div>
              
              <div>
                <Label htmlFor="dic">DIČ</Label>
                <Input
                  id="dic"
                  value={formData.dic}
                  onChange={handleInputChange('dic')}
                  placeholder="1234567890"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="vat_number">IČ DPH</Label>
                <Input
                  id="vat_number"
                  value={formData.vat_number}
                  onChange={handleInputChange('vat_number')}
                  placeholder="SK1234567890"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Person */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <User className="h-4 w-4" />
              Kontaktná osoba
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="contact_person_name">
                  Meno a priezvisko <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_person_name"
                  value={formData.contact_person_name}
                  onChange={handleInputChange('contact_person_name')}
                  placeholder="Ján Novák"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person_email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact_person_email"
                  type="email"
                  value={formData.contact_person_email}
                  onChange={handleInputChange('contact_person_email')}
                  placeholder="jan.novak@example.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contact_person_phone">Telefón</Label>
                <Input
                  id="contact_person_phone"
                  value={formData.contact_person_phone}
                  onChange={handleInputChange('contact_person_phone')}
                  placeholder="+421 900 123 456"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Address */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Adresa
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="address_street">Ulica a číslo</Label>
                <Input
                  id="address_street"
                  value={formData.address_street}
                  onChange={handleInputChange('address_street')}
                  placeholder="Hlavná 123"
                />
              </div>
              
              <div>
                <Label htmlFor="address_city">Mesto</Label>
                <Input
                  id="address_city"
                  value={formData.address_city}
                  onChange={handleInputChange('address_city')}
                  placeholder="Bratislava"
                />
              </div>
              
              <div>
                <Label htmlFor="address_zip_code">PSČ</Label>
                <Input
                  id="address_zip_code"
                  value={formData.address_zip_code}
                  onChange={handleInputChange('address_zip_code')}
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Zrušiť
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Vytvoriť merchanta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMerchantModal;