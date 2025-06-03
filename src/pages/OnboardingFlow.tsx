
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CompanyInfoStep from "@/components/onboarding/CompanyInfoStep";
import LocationsStep from "@/components/onboarding/LocationsStep";
import DevicesStep from "@/components/onboarding/DevicesStep";
import ServicesStep from "@/components/onboarding/ServicesStep";
import OwnersStep from "@/components/onboarding/OwnersStep";
import BillingStep from "@/components/onboarding/BillingStep";
import ContractStep from "@/components/onboarding/ContractStep";
import { OnboardingData } from "@/types";

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    company: {},
    locations: [{}],
    devices: [],
    servicePlan: '',
    owners: [{}],
    billing: {},
    contract: {},
    currentStep: 1
  });

  const steps = [
    { number: 1, title: "Company Information", description: "Basic business details" },
    { number: 2, title: "Locations", description: "Business locations and addresses" },
    { number: 3, title: "Devices", description: "Payment processing equipment" },
    { number: 4, title: "Services", description: "Select your service plan" },
    { number: 5, title: "Owners", description: "Business ownership information" },
    { number: 6, title: "Billing", description: "Payment and banking details" },
    { number: 7, title: "Contract", description: "Review and sign agreement" }
  ];

  const totalSteps = steps.length;
  const progressPercentage = (currentStep / totalSteps) * 100;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setOnboardingData(prev => ({ ...prev, currentStep: currentStep + 1 }));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setOnboardingData(prev => ({ ...prev, currentStep: currentStep - 1 }));
    }
  };

  const updateData = (stepData: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...stepData }));
  };

  const handleComplete = () => {
    console.log('Onboarding completed:', onboardingData);
    // Here you would typically submit the data to your backend
    navigate('/merchant'); // Redirect to merchant dashboard by default
  };

  const renderStep = () => {
    const commonProps = {
      data: onboardingData,
      updateData,
      onNext: nextStep,
      onPrev: prevStep
    };

    switch (currentStep) {
      case 1:
        return <CompanyInfoStep {...commonProps} />;
      case 2:
        return <LocationsStep {...commonProps} />;
      case 3:
        return <DevicesStep {...commonProps} />;
      case 4:
        return <ServicesStep {...commonProps} />;
      case 5:
        return <OwnersStep {...commonProps} />;
      case 6:
        return <BillingStep {...commonProps} />;
      case 7:
        return <ContractStep {...commonProps} onComplete={handleComplete} />;
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
              Onboarding
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">
              {steps[currentStep - 1].title}
            </h1>
            <span className="text-sm text-slate-600">
              Step {currentStep} of {totalSteps}
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
                  {step.number}
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
        <div className="max-w-4xl mx-auto">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
              >
                Save & Exit
              </Button>
              
              {currentStep === totalSteps ? (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Complete Onboarding
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white flex items-center"
                >
                  Next
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
