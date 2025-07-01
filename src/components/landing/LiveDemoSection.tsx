import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, CreditCard, PenTool } from "lucide-react";

const LiveDemoSection = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Zadaj názov firmy",
      icon: Search,
      content: (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Názov firmy alebo IČO
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Napr. Restaurant Bratislava..."
                className="w-full px-4 py-4 bg-light-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-utopia-500 focus:border-transparent transition-all duration-300"
                defaultValue="Restaurant Bratislava"
              />
              <Search className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-xl">
            <p className="text-sm text-green-700">
              ✓ Firma nájdená! Predvypĺňame údaje...
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Vyber terminál alebo pokladňu",
      icon: CreditCard,
      content: (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-utopia-500 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 bg-utopia-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <CreditCard className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">Platobný terminál</h4>
            <p className="text-sm text-gray-600 mb-4">Pre bežné platby kartou</p>
            <div className="text-utopia-600 font-semibold">Odporúčaný ✓</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 shadow-lg">
            <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mb-6">
              <CreditCard className="w-8 h-8 text-gray-500" strokeWidth={1.5} />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2 text-lg">Smart pokladňa</h4>
            <p className="text-sm text-gray-600 mb-4">All-in-one riešenie</p>
          </div>
        </div>
      )
    },
    {
      title: "Digitálny podpis zmluvy",
      icon: PenTool,
      content: (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <div className="border-2 border-dashed border-utopia-300 rounded-2xl p-12 text-center">
            <PenTool className="w-16 h-16 text-utopia-500 mx-auto mb-6" strokeWidth={1.5} />
            <h4 className="font-semibold text-gray-900 mb-3 text-xl">Podpíš zmluvu</h4>
            <p className="text-gray-600 mb-6">Použij prst alebo myš na podpis</p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
              <p className="text-sm text-blue-700">
                📱 Môžeš podpísať aj na mobile alebo tablete
              </p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % demoSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + demoSteps.length) % demoSteps.length);
  };

  return (
    <section className="py-32 px-6 bg-light-gray-50 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-utopia-50/20 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Vyskúšaj si, ako to <span className="bg-blue-gradient bg-clip-text text-transparent">vyzerá</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Interaktívna ukážka onboarding procesu
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-12">
            {demoSteps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-medium transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-utopia-500 text-white shadow-lg'
                    : index < currentStep
                    ? 'bg-utopia-200 text-utopia-700 border border-utopia-300'
                    : 'bg-gray-200 text-gray-500 border border-gray-300'
                }`}>
                  {index + 1}
                </div>
                {index < demoSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                    index < currentStep ? 'bg-utopia-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current step */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-utopia-100 rounded-2xl flex items-center justify-center border border-utopia-300">
                {React.createElement(demoSteps[currentStep].icon, {
                  className: "w-8 h-8 text-utopia-600",
                  strokeWidth: 1.5
                })}
              </div>
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">
                {demoSteps[currentStep].title}
              </h3>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-12 animate-fade-in">
            {demoSteps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex items-center gap-2 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-utopia-500 rounded-xl"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Späť
            </Button>
            
            <span className="text-sm text-gray-500">
              {currentStep + 1} z {demoSteps.length}
            </span>
            
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-utopia-500 hover:bg-utopia-600 text-white rounded-xl transition-all duration-300 hover:shadow-lg"
              disabled={currentStep === demoSteps.length - 1}
            >
              Ďalej
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 inline-block">
            <p className="text-yellow-700 font-medium text-lg">
              💡 Toto je len ukážka. Tvoja verzia bude ušitá na mieru.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;
