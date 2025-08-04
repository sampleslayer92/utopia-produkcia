
import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Link, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useOnboardingData } from "@/components/onboarding/hooks/useOnboardingData";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const AdminOnboardingPage = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { onboardingData, clearData } = useOnboardingData();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyLink = async () => {
    if (!onboardingData.contractId) {
      toast.error('Zmluva ešte nebola vytvorená', {
        description: 'Najprv vyplňte základné informácie'
      });
      return;
    }

    const shareUrl = `${window.location.origin}/onboarding/${onboardingData.contractId}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Odkaz skopírovaný!', {
        description: 'Odkaz na zdieľanie formulára bol skopírovaný do schránky'
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      toast.success('Odkaz skopírovaný!', {
        description: 'Odkaz na zdieľanie formulára bol skopírovaný do schránky'
      });
    }
  };

  const handleDeleteDraft = async () => {
    if (!onboardingData.contractId) {
      toast.error('Žiadna rozpracovaná žiadosť na vymazanie');
      return;
    }

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', onboardingData.contractId);

      if (error) throw error;

      clearData();
      toast.success('Rozpracovaná žiadosť vymazaná', {
        description: 'Všetky údaje boli odstránené'
      });
      navigate('/admin');
    } catch (error) {
      console.error('Error deleting draft:', error);
      toast.error('Chyba pri mazaní', {
        description: 'Nepodarilo sa vymazať rozpracovanú žiadosť'
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const onboardingActions = (
    <div className="flex items-center gap-2">
      {onboardingData.contractId && (
        <>
          <Button 
            variant="outline"
            onClick={handleCopyLink}
            className="hover:bg-slate-50"
          >
            <Link className="h-4 w-4 mr-2" />
            Kopírovať odkaz
          </Button>
          <Button 
            variant="outline"
            onClick={handleDeleteDraft}
            disabled={isDeleting}
            className="hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {isDeleting ? 'Mazanie...' : 'Vymazať žiadosť'}
          </Button>
        </>
      )}
      <Button 
        variant="outline"
        onClick={() => navigate('/admin')}
        className="hover:bg-slate-50"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        {t('contractDetail.backToList')}
      </Button>
    </div>
  );

  return (
    <AdminLayout 
      title="Nová zmluva" 
      subtitle="Vytvorenie novej zmluvy a merchanta"
      actions={onboardingActions}
    >
      <div className="bg-white rounded-lg border border-slate-200">
        <OnboardingFlow isAdminMode={true} />
      </div>
    </AdminLayout>
  );
};

export default AdminOnboardingPage;
