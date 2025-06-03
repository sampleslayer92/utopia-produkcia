
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingData } from "@/types/onboarding";
import { toast } from "sonner";
import ContactInfoStep from "./ContactInfoStep";
import CompanyInfoStep from "./CompanyInfoStep";
import BusinessLocationStep from "./BusinessLocationStep";
import DeviceSelectionStep from "./DeviceSelectionStep";
import AuthorizedPersonsStep from "./AuthorizedPersonsStep";
import ActualOwnersStep from "./ActualOwnersStep";
import ConsentsStep from "./ConsentsStep";
import OnboardingHeader from "./ui/OnboardingHeader";
import OnboardingSidebar from "./ui/OnboardingSidebar";
import OnboardingNavigation from "./ui/OnboardingNavigation";

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    contactInfo: {
      salutation: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      phonePrefix: '+421',
      salesNote: ''
    },
    companyInfo: {
      ico: '',
      dic: '',
      companyName: '',
      registryType: '',
      court: '',
      section: '',
      insertNumber: '',
      address: { street: '', city: '', zipCode: '' },
      contactAddress: { street: '', city: '', zipCode: '' },
      contactAddressSameAsMain: true,
      contactPerson: { name: '', email: '', phone: '', isTechnicalPerson: false }
    },
    businessLocations: [],
    deviceSelection: {
      terminals: {
        paxA920Pro: { count: 0, monthlyFee: 0, simCards: 0 },
        paxA80: { count: 0, monthlyFee: 0 }
      },
      tablets: {
        tablet10: { count: 0, monthlyFee: 0 },
        tablet15: { count: 0, monthlyFee: 0 },
        tabletPro15: { count: 0, monthlyFee: 0 }
      },
      softwareLicenses: [],
      accessories: [],
      ecommerce: [],
      technicalService: [],
      mifFees: { regulatedCards: 0, unregulatedCards: 0, dccRabat: 0 },
      transactionTypes: [],
      note: ''
    },
    authorizedPersons: [],
    actualOwners: [],
    consents: {
      gdpr: false,
      terms: false,
      electronicCommunication: false,
      signatureDate: '',
      signingPersonId: ''
    },
    currentStep: 0
  });

  const steps = [
    { number: 0, title: "Kontaktné údaje", description: "Základné kontaktné informácie" },
    { number: 1, title: "Údaje o spoločnosti", description: "Informácie o právnickej osobe" },
    { number: 2, title: "Prevádzky", description: "Prevádzkové lokality a údaje" },
    { number: 3, title: "Zariadenia a služby", description: "Výber technického vybavenia" },
    { number: 4, title: "Oprávnené osoby", description: "Osoby oprávnené konať" },
    { number: 5, title: "Skutoční majitelia", description: "Koneční beneficienti" },
    { number: 6, title: "Súhlasy a podpis", description: "Potvrdenie a podpis zmluvy" }
  ];

  const totalSteps = steps.length;

  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Ensure all arrays exist to prevent undefined errors
        const safeData = {
          ...parsed,
          businessLocations: parsed.businessLocations || [],
          authorizedPersons: parsed.authorizedPersons || [],
          actualOwners: parsed.actualOwners || [],
          deviceSelection: {
            ...parsed.deviceSelection,
            softwareLicenses: parsed.deviceSelection?.softwareLicenses || [],
            accessories: parsed.deviceSelection?.accessories || [],
            ecommerce: parsed.deviceSelection?.ecommerce || [],
            technicalService: parsed.deviceSelection?.technicalService || [],
            transactionTypes: parsed.deviceSelection?.transactionTypes || []
          }
        };
        setOnboardingData(safeData);
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const dataToSave = { ...onboardingData, currentStep };
    localStorage.setItem('onboarding_data', JSON.stringify(dataToSave));
  }, [onboardingData, currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      toast.success("Krok uložený", {
        description: `Postupujete na krok: ${steps[currentStep + 1].title}`
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const handleComplete = () => {
    console.log('Onboarding dokončený:', onboardingData);
    // Generate contract data
    const contractData = {
      ...onboardingData,
      completedAt: new Date().toISOString(),
      status: 'completed'
    };
    localStorage.setItem('contract_data', JSON.stringify(contractData));
    
    // Store user role and redirect
    localStorage.setItem('utopia_user_role', 'merchant');
    navigate('/merchant');
  };

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    window.scrollTo(0, 0);
  };

  const handleSaveAndExit = () => {
    navigate('/');
  };

  const renderStep = () => {
    const commonProps = {
      data: onboardingData,
      updateData,
      onNext: nextStep,
      onPrev: prevStep
    };

    switch (currentStep) {
      case 0:
        return <ContactInfoStep {...commonProps} />;
      case 1:
        return <CompanyInfoStep {...commonProps} />;
      case 2:
        return <BusinessLocationStep {...commonProps} />;
      case 3:
        return <DeviceSelectionStep {...commonProps} />;
      case 4:
        return <AuthorizedPersonsStep {...commonProps} />;
      case 5:
        return <ActualOwnersStep {...commonProps} />;
      case 6:
        return <ConsentsStep {...commonProps} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <OnboardingHeader />

      <div className="flex min-h-[calc(100vh-80px)]">
        <OnboardingSidebar
          currentStep={currentStep}
          steps={steps}
          onStepClick={handleStepClick}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content */}
          <div className="flex-1 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">
                  {steps[currentStep]?.title || 'Loading...'}
                </h1>
                <p className="text-slate-600">
                  {steps[currentStep]?.description || ''}
                </p>
              </div>
              
              <div className="animate-fade-in">
                {renderStep()}
              </div>
            </div>
          </div>

          <OnboardingNavigation
            currentStep={currentStep}
            totalSteps={totalSteps}
            onPrevStep={prevStep}
            onNextStep={nextStep}
            onComplete={handleComplete}
            onSaveAndExit={handleSaveAndExit}
          />
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
