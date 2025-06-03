
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CreditCard, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OnboardingData } from "@/types/onboarding";
import ContactInfoStep from "./ContactInfoStep";
import CompanyInfoStep from "./NewCompanyInfoStep";
import BusinessLocationStep from "./BusinessLocationStep";
import DeviceSelectionStep from "./DeviceSelectionStep";
import AuthorizedPersonsStep from "./AuthorizedPersonsStep";
import ActualOwnersStep from "./ActualOwnersStep";
import ConsentsStep from "./ConsentsStep";

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
      contactPerson: { name: '', email: '', phone: '', isTechnicalPerson: false }
    },
    businessLocation: {
      name: '',
      hasPOS: false,
      address: { street: '', city: '', zipCode: '' },
      iban: '',
      contactPerson: { name: '', email: '', phone: '' },
      businessSector: '',
      estimatedTurnover: 0,
      averageTransaction: 0,
      openingHours: '',
      seasonality: 'year-round'
    },
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
    { number: 2, title: "Údaje o prevádzke", description: "Prevádzková lokalita a údaje" },
    { number: 3, title: "Zariadenia a služby", description: "Výber technického vybavenia" },
    { number: 4, title: "Oprávnené osoby", description: "Osoby oprávnené konať" },
    { number: 5, title: "Skutoční majitelia", description: "Koneční beneficienti" },
    { number: 6, title: "Súhlasy a podpis", description: "Potvrdenie a podpis zmluvy" }
  ];

  const totalSteps = steps.length;
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('onboarding_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setOnboardingData(parsed);
        setCurrentStep(parsed.currentStep || 0);
      } catch (error) {
        console.error('Error loading onboarding data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = { ...onboardingData, currentStep };
    localStorage.setItem('onboarding_data', JSON.stringify(dataToSave));
  }, [onboardingData, currentStep]);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                PayFlow
              </span>
            </div>
            <Badge variant="outline" className="border-blue-200 text-blue-700">
              Registrácia obchodníka
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">
              {steps[currentStep].title}
            </h1>
            <span className="text-sm text-slate-600">
              Krok {currentStep + 1} z {totalSteps}
            </span>
          </div>
          
          <Progress value={progressPercentage} className="h-2 mb-6" />
          
          {/* Steps Overview */}
          <div className="grid grid-cols-7 gap-2 mb-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`text-center p-3 rounded-lg transition-all duration-200 ${
                  step.number === currentStep
                    ? 'bg-blue-100 border-2 border-blue-300'
                    : step.number < currentStep
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-sm font-medium ${
                    step.number === currentStep
                      ? 'bg-blue-600 text-white'
                      : step.number < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-300 text-slate-600'
                  }`}
                >
                  {step.number < currentStep ? <Check className="h-4 w-4" /> : step.number + 1}
                </div>
                <div className="text-xs font-medium text-slate-900 mb-1">
                  {step.title}
                </div>
                <div className="text-xs text-slate-600">
                  {step.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="max-w-6xl mx-auto">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="max-w-6xl mx-auto mt-8">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Späť
            </Button>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Uložiť a ukončiť
              </Button>
              
              {currentStep === totalSteps - 1 ? (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Dokončiť registráciu
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center"
                >
                  Ďalej
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
