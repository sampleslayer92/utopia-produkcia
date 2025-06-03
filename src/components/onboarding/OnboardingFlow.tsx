
import OnboardingHeader from "./ui/OnboardingHeader";
import OnboardingSidebar from "./ui/OnboardingSidebar";
import OnboardingNavigation from "./ui/OnboardingNavigation";
import OnboardingStepHeader from "./ui/OnboardingStepHeader";
import OnboardingStepRenderer from "./components/OnboardingStepRenderer";
import { useOnboardingData } from "./hooks/useOnboardingData";
import { useOnboardingNavigation } from "./hooks/useOnboardingNavigation";
import { onboardingSteps } from "./config/onboardingSteps";

const OnboardingFlow = () => {
  const { currentStep, setCurrentStep, onboardingData, updateData } = useOnboardingData();
  const {
    totalSteps,
    nextStep,
    prevStep,
    handleComplete,
    handleStepClick,
    handleSaveAndExit
  } = useOnboardingNavigation(currentStep, setCurrentStep, onboardingData);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <OnboardingHeader />

      <div className="flex min-h-[calc(100vh-80px)]">
        <OnboardingSidebar
          currentStep={currentStep}
          steps={onboardingSteps}
          onStepClick={handleStepClick}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content */}
          <div className="flex-1 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
              <OnboardingStepHeader
                currentStep={currentStep}
                totalSteps={totalSteps}
                title={onboardingSteps[currentStep]?.title || 'Loading...'}
                description={onboardingSteps[currentStep]?.description || ''}
              />
              
              <div className="animate-fade-in">
                <OnboardingStepRenderer
                  currentStep={currentStep}
                  data={onboardingData}
                  updateData={updateData}
                  onNext={nextStep}
                  onPrev={prevStep}
                  onComplete={handleComplete}
                />
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
