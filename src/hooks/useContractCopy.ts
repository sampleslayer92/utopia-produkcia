import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { OnboardingData } from '@/types/onboarding';
import { toast } from 'sonner';

interface CopyConfig {
  sourceContractId: string;
  segments: string[];
  merchantId: string;
  timestamp: number;
}

export const useContractCopy = () => {
  const [copyConfig, setCopyConfig] = useState<CopyConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for copy configuration on mount
    const storedConfig = localStorage.getItem('contract_copy_config');
    if (storedConfig) {
      try {
        const config = JSON.parse(storedConfig);
        // Check if config is not too old (24 hours)
        if (Date.now() - config.timestamp < 24 * 60 * 60 * 1000) {
          setCopyConfig(config);
        } else {
          localStorage.removeItem('contract_copy_config');
        }
      } catch (error) {
        console.error('Error parsing copy config:', error);
        localStorage.removeItem('contract_copy_config');
      }
    }
  }, []);

  const loadContractData = async (contractId: string): Promise<Partial<OnboardingData> | null> => {
    setIsLoading(true);
    try {
      // Load all related data for the contract
      const [
        { data: contactInfo },
        { data: companyInfo },
        { data: businessLocations },
        { data: contractItems },
        { data: contractCalculations },
        { data: authorizedPersons },
        { data: actualOwners },
        { data: deviceSelection }
      ] = await Promise.all([
        supabase.from('contact_info').select('*').eq('contract_id', contractId).single(),
        supabase.from('company_info').select('*').eq('contract_id', contractId).single(),
        supabase.from('business_locations').select('*').eq('contract_id', contractId),
        supabase.from('contract_items').select('*').eq('contract_id', contractId),
        supabase.from('contract_calculations').select('*').eq('contract_id', contractId).single(),
        supabase.from('authorized_persons').select('*').eq('contract_id', contractId),
        supabase.from('actual_owners').select('*').eq('contract_id', contractId),
        supabase.from('device_selection').select('*').eq('contract_id', contractId).single()
      ]);

      const contractData: Partial<OnboardingData> = {};

      // Map contact info
      if (contactInfo) {
        contractData.contactInfo = {
          salutation: contactInfo.salutation,
          firstName: contactInfo.first_name,
          lastName: contactInfo.last_name,
          email: contactInfo.email,
          phone: contactInfo.phone,
          phonePrefix: contactInfo.phone_prefix || '+421',
          salesNote: contactInfo.sales_note || '',
          userRoles: contactInfo.user_role ? [contactInfo.user_role] : [],
          userRole: contactInfo.user_role || ''
        };
      }

      // Map company info
      if (companyInfo) {
        contractData.companyInfo = {
          ico: companyInfo.ico,
          dic: companyInfo.dic,
          companyName: companyInfo.company_name,
          registryType: companyInfo.registry_type === 'public' ? '' : 
                       companyInfo.registry_type === 'business' ? 'S.r.o.' :
                       companyInfo.registry_type === 'other' ? '' : '',
          isVatPayer: companyInfo.is_vat_payer,
          vatNumber: companyInfo.vat_number || '',
          court: companyInfo.court || '',
          section: companyInfo.section || '',
          insertNumber: companyInfo.insert_number || '',
          address: {
            street: companyInfo.address_street,
            city: companyInfo.address_city,
            zipCode: companyInfo.address_zip_code
          },
          contactAddress: {
            street: companyInfo.contact_address_street || '',
            city: companyInfo.contact_address_city || '',
            zipCode: companyInfo.contact_address_zip_code || ''
          },
          contactAddressSameAsMain: companyInfo.contact_address_same_as_main,
          headOfficeEqualsOperatingAddress: false,
          contactPerson: {
            firstName: companyInfo.contact_person_first_name,
            lastName: companyInfo.contact_person_last_name,
            email: companyInfo.contact_person_email,
            phone: companyInfo.contact_person_phone,
            isTechnicalPerson: companyInfo.contact_person_is_technical
          }
        };
      }

      // Map business locations
      if (businessLocations && businessLocations.length > 0) {
        contractData.businessLocations = businessLocations.map(location => ({
          id: location.location_id,
          name: location.name,
          hasPOS: location.has_pos,
          address: {
            street: location.address_street,
            city: location.address_city,
            zipCode: location.address_zip_code
          },
          iban: location.iban,
          contactPerson: {
            name: location.contact_person_name,
            email: location.contact_person_email,
            phone: location.contact_person_phone
          },
          businessSector: location.business_sector,
          businessSubject: location.business_sector,
          mccCode: '',
          estimatedTurnover: Number(location.estimated_turnover),
          monthlyTurnover: Number(location.estimated_turnover),
          averageTransaction: Number(location.average_transaction),
          seasonality: location.seasonality as 'year-round' | 'seasonal',
          seasonalWeeks: location.seasonal_weeks || undefined,
          openingHours: location.opening_hours,
          openingHoursDetailed: [
            { day: "Po", open: "09:00", close: "17:00", otvorene: true },
            { day: "Ut", open: "09:00", close: "17:00", otvorene: true },
            { day: "St", open: "09:00", close: "17:00", otvorene: true },
            { day: "Št", open: "09:00", close: "17:00", otvorene: true },
            { day: "Pi", open: "09:00", close: "17:00", otvorene: true },
            { day: "So", open: "09:00", close: "14:00", otvorene: false },
            { day: "Ne", open: "09:00", close: "17:00", otvorene: false }
          ],
          bankAccounts: [{
            id: '1',
            format: 'IBAN' as const,
            iban: location.iban,
            mena: 'EUR' as const
          }]
        }));
      }

      // Map device selection and contract items
      if (contractItems && contractItems.length > 0) {
        const devices = contractItems.filter(item => item.item_type === 'device');
        const services = contractItems.filter(item => item.item_type === 'service');
        
        contractData.devices = devices.map(device => ({
          id: device.item_id,
          type: 'device' as const,
          name: device.name,
          description: device.description || '',
          category: device.category,
          count: device.count,
          monthlyFee: Number(device.monthly_fee),
          companyCost: Number(device.company_cost),
          addons: []
        }));

        contractData.services = services.map(service => ({
          id: service.item_id,
          type: 'service' as const,
          name: service.name,
          description: service.description || '',
          category: service.category,
          count: service.count,
          monthlyFee: Number(service.monthly_fee),
          companyCost: Number(service.company_cost),
          addons: []
        }));
      }

      // Map fees from contract calculations
      if (contractCalculations) {
        contractData.fees = {
          regulatedCards: Number(contractCalculations.regulated_fee),
          unregulatedCards: Number(contractCalculations.unregulated_fee)
        };
      }

      // Map authorized persons
      if (authorizedPersons && authorizedPersons.length > 0) {
        contractData.authorizedPersons = authorizedPersons.map(person => ({
          id: person.person_id,
          firstName: person.first_name,
          lastName: person.last_name,
          email: person.email,
          phone: person.phone,
          phonePrefix: '+421',
          maidenName: person.maiden_name || '',
          birthDate: person.birth_date,
          birthPlace: person.birth_place,
          birthNumber: person.birth_number,
          citizenship: person.citizenship,
          permanentAddress: person.permanent_address,
          position: person.position,
          documentType: person.document_type as 'OP' | 'Pas',
          documentNumber: person.document_number,
          documentValidity: person.document_validity,
          documentIssuer: person.document_issuer,
          documentCountry: person.document_country,
          isPoliticallyExposed: person.is_politically_exposed,
          isUSCitizen: person.is_us_citizen
        }));
      }

      // Map actual owners
      if (actualOwners && actualOwners.length > 0) {
        contractData.actualOwners = actualOwners.map(owner => ({
          id: owner.owner_id,
          firstName: owner.first_name,
          lastName: owner.last_name,
          maidenName: owner.maiden_name || '',
          birthDate: owner.birth_date,
          birthPlace: owner.birth_place,
          birthNumber: owner.birth_number,
          citizenship: owner.citizenship,
          permanentAddress: owner.permanent_address,
          isPoliticallyExposed: owner.is_politically_exposed
        }));
      }

      return contractData;
    } catch (error) {
      console.error('Error loading contract data:', error);
      toast.error('Chyba pri načítavaní údajov zmluvy');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const applyContractCopy = async (): Promise<Partial<OnboardingData> | null> => {
    if (!copyConfig) return null;

    const sourceData = await loadContractData(copyConfig.sourceContractId);
    if (!sourceData) return null;

    // Filter data based on selected segments
    const filteredData: Partial<OnboardingData> = {};

    if (copyConfig.segments.includes('contactInfo') && sourceData.contactInfo) {
      filteredData.contactInfo = sourceData.contactInfo;
    }

    if (copyConfig.segments.includes('companyInfo') && sourceData.companyInfo) {
      filteredData.companyInfo = sourceData.companyInfo;
    }

    if (copyConfig.segments.includes('businessLocations') && sourceData.businessLocations) {
      filteredData.businessLocations = sourceData.businessLocations;
    }

    if (copyConfig.segments.includes('deviceSelection')) {
      if (sourceData.devices) filteredData.devices = sourceData.devices;
      if (sourceData.services) filteredData.services = sourceData.services;
      if (sourceData.deviceSelection) filteredData.deviceSelection = sourceData.deviceSelection;
    }

    if (copyConfig.segments.includes('fees') && sourceData.fees) {
      filteredData.fees = sourceData.fees;
    }

    if (copyConfig.segments.includes('personsAndOwners')) {
      if (sourceData.authorizedPersons) filteredData.authorizedPersons = sourceData.authorizedPersons;
      if (sourceData.actualOwners) filteredData.actualOwners = sourceData.actualOwners;
    }

    // Clear copy config after use
    localStorage.removeItem('contract_copy_config');
    setCopyConfig(null);

    return filteredData;
  };

  const clearCopyConfig = () => {
    localStorage.removeItem('contract_copy_config');
    setCopyConfig(null);
  };

  return {
    copyConfig,
    isLoading,
    applyContractCopy,
    clearCopyConfig
  };
};