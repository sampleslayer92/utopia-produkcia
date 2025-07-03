import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Building2, User, MapPin, Loader2, Phone, Mail, Hash, CreditCard } from "lucide-react";
import OnboardingInput from "@/components/onboarding/ui/OnboardingInput";
import CompanyAutocomplete from "@/components/onboarding/ui/CompanyAutocomplete";
import ORSRSearch from "@/components/onboarding/ui/ORSRSearch";
import type { CompanyRecognitionResult } from "@/components/onboarding/services/mockCompanyRecognition";

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
  const { t } = useTranslation('ui');
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

  const handleCompanySelect = (company: CompanyRecognitionResult) => {
    setFormData(prev => ({
      ...prev,
      company_name: company.companyName,
      ico: company.ico,
      dic: company.dic || `SK${company.ico}`,
      address_street: company.address?.street || '',
      address_city: company.address?.city || '',
      address_zip_code: company.address?.zipCode || ''
    }));
  };

  const handleORSRData = (data: any) => {
    setFormData(prev => ({
      ...prev,
      company_name: data.companyName,
      dic: data.dic,
      address_street: data.address?.street || '',
      address_city: data.address?.city || '',
      address_zip_code: data.address?.zipCode || ''
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50/30 border-2 border-slate-200/60 shadow-2xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            {t('modal.addMerchant.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-sm">
            {t('modal.addMerchant.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Information */}
          <div className="space-y-6 p-6 bg-white/60 rounded-xl border border-slate-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-base font-semibold text-slate-800">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              {t('modal.addMerchant.companyInfo')}
            </div>
            
            <div className="space-y-4">
              {/* Company Name with Autocomplete */}
              <CompanyAutocomplete
                value={formData.company_name}
                onValueChange={(value) => setFormData(prev => ({ ...prev, company_name: value }))}
                onCompanySelect={handleCompanySelect}
                placeholder="Začnite písať názov spoločnosti..."
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <OnboardingInput
                    label="IČO"
                    value={formData.ico}
                    onChange={handleInputChange('ico')}
                    placeholder="12345678"
                    icon={<Hash className="h-4 w-4" />}
                  />
                  <div className="flex justify-end">
                    <ORSRSearch ico={formData.ico} onDataFound={handleORSRData} />
                  </div>
                </div>
                
                <OnboardingInput
                  label="DIČ"
                  value={formData.dic}
                  onChange={handleInputChange('dic')}
                  placeholder="1234567890"
                  icon={<Hash className="h-4 w-4" />}
                />
              </div>
              
              <OnboardingInput
                label="IČ DPH"
                value={formData.vat_number}
                onChange={handleInputChange('vat_number')}
                placeholder="SK1234567890"
                icon={<CreditCard className="h-4 w-4" />}
              />
            </div>
          </div>

          {/* Contact Person */}
          <div className="space-y-6 p-6 bg-white/60 rounded-xl border border-slate-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-base font-semibold text-slate-800">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <User className="h-5 w-5 text-emerald-600" />
              </div>
              {t('modal.addMerchant.contactPerson')}
            </div>
            
            <div className="space-y-4">
              <OnboardingInput
                label="Meno a priezvisko *"
                value={formData.contact_person_name}
                onChange={handleInputChange('contact_person_name')}
                placeholder="Ján Novák"
                icon={<User className="h-4 w-4" />}
                required
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OnboardingInput
                  label="Email *"
                  type="email"
                  value={formData.contact_person_email}
                  onChange={handleInputChange('contact_person_email')}
                  placeholder="jan.novak@example.com"
                  icon={<Mail className="h-4 w-4" />}
                  required
                />
                
                <OnboardingInput
                  label="Telefón"
                  value={formData.contact_person_phone}
                  onChange={handleInputChange('contact_person_phone')}
                  placeholder="+421 900 123 456"
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-6 p-6 bg-white/60 rounded-xl border border-slate-200/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 text-base font-semibold text-slate-800">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              {t('modal.addMerchant.address')}
            </div>
            
            <div className="space-y-4">
              <OnboardingInput
                label="Ulica a číslo"
                value={formData.address_street}
                onChange={handleInputChange('address_street')}
                placeholder="Hlavná 123"
                icon={<MapPin className="h-4 w-4" />}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <OnboardingInput
                  label="Mesto"
                  value={formData.address_city}
                  onChange={handleInputChange('address_city')}
                  placeholder="Bratislava"
                  icon={<MapPin className="h-4 w-4" />}
                />
                
                <OnboardingInput
                  label="PSČ"
                  value={formData.address_zip_code}
                  onChange={handleInputChange('address_zip_code')}
                  placeholder="12345"
                  icon={<Hash className="h-4 w-4" />}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-6 hover:bg-slate-50"
            >
              Zrušiť
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
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