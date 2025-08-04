import React from 'react';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOnboardingConfig } from '@/hooks/useOnboardingConfig';
import ConfigurableOnboardingFlow from '@/components/onboarding/dynamic/ConfigurableOnboardingFlow';

const SharedOnboardingPage = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [linkData, setLinkData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { loadConfiguration } = useOnboardingConfig();

  useEffect(() => {
    if (linkId) {
      loadSharedLink();
    }
  }, [linkId]);

  const loadSharedLink = async () => {
    try {
      setLoading(true);
      
      // Verify the shared link
      const { data: linkData, error: linkError } = await (supabase as any)
        .from('shareable_onboarding_links')
        .select('*')
        .eq('id', linkId)
        .eq('is_active', true)
        .maybeSingle();

      if (linkError || !linkData) {
        setError('Link nie je platný alebo bol deaktivovaný');
        return;
      }

      // Check if link has expired
      if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
        setError('Link už vypršal');
        return;
      }

      setLinkData(linkData);
      
      // Load the specific configuration
      await loadConfiguration(linkData.configuration_id);
      
    } catch (error) {
      console.error('Error loading shared link:', error);
      setError('Chyba pri načítavaní linku');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Načítava sa onboarding...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Chyba</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header with link info */}
      <div className="bg-muted/50 border-b p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Test onboarding procesu</h1>
            <p className="text-sm text-muted-foreground">
              Link: {linkData?.name || 'Testovací link'}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Powered by Dynamic Onboarding
          </div>
        </div>
      </div>
      
      <ConfigurableOnboardingFlow />
    </div>
  );
};

export default SharedOnboardingPage;