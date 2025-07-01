
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
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">
              Názov firmy alebo IČO
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Napr. Restaurant Bratislava..."
                className="w-full px-4 py-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-utopia-500 focus:border-transparent transition-all duration-300"
                defaultValue="Restaurant Bratislava"
              />
              <Search className="absolute right-4 top-4 w-5 h-5 text-white/40" />
            </div>
          </div>
          <div className="bg-utopia-500/10 backdrop-blur-sm border border-utopia-500/30 p-4 rounded-xl">
            <p className="text-sm text-utopia-400">
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
          <div className="bg-white/5 backdrop-blur-md border-2 border-utopia-500/50 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-utopia-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-utopia-500/30">
              <CreditCard className="w-8 h-8 text-utopia-400" strokeWidth={1.5} />
            </div>
            <h4 className="font-medium text-white mb-2 text-lg">Platobný terminál</h4>
            <p className="text-sm text-white/70 mb-4 font-light">Pre bežné platby kartou</p>
            <div className="text-utopia-400 font-medium">Odporúčaný ✓</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <CreditCard className="w-8 h-8 text-white/40" strokeWidth={1.5} />
            </div>
            <h4 className="font-medium text-white mb-2 text-lg">Smart pokladňa</h4>
            <p className="text-sm text-white/70 mb-4 font-light">All-in-one riešenie</p>
          </div>
        </div>
      )
    },
    {
      title: "Digitálny podpis zmluvy",
      icon: PenTool,
      content: (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8">
          <div className="border-2 border-dashed border-utopia-500/50 rounded-2xl p-12 text-center">
            <PenTool className="w-16 h-16 text-utopia-400 mx-auto mb-6" strokeWidth={1.5} />
            <h4 className="font-medium text-white mb-3 text-xl">Podpíš zmluvu</h4>
            <p className="text-white/70 mb-6 font-light">Použij prst alebo myš na podpis</p>
            <div className="bg-utopia-500/10 backdrop-blur-sm border border-utopia-500/30 p-4 rounded-xl">
              <p className="text-sm text-utopia-400">
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
    <section className="py-32 px-6 bg-dark relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-utopia-500/5 to-transparent"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Vyskúšaj si, ako to <span className="text-utopia-500">vyzerá</span>
          </h2>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-12">
            {demoSteps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-medium transition-all duration-300 ${
                  index === currentStep
                    ? 'bg-utopia-500 text-white shadow-[0_0_20px_rgba(0,212,255,0.4)]'
                    : index < currentStep
                    ? 'bg-utopia-500/30 text-utopia-400 border border-utopia-500/50'
                    : 'bg-white/10 text-white/40 border border-white/20'
                }`}>
                  {index + 1}
                </div>
                {index < demoSteps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-300 ${
                    index < currentStep ? 'bg-utopia-500' : 'bg-white/20'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current step */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16 bg-utopia-500/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-utopia-500/30">
                {React.createElement(demoSteps[currentStep].icon, {
                  className: "w-8 h-8 text-utopia-400",
                  strokeWidth: 1.5
                })}
              </div>
              <h3 className="text-2xl md:text-3xl font-medium text-white">
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
              className="flex items-center gap-2 bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-utopia-500/50 rounded-xl"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              Späť
            </Button>
            
            <span className="text-sm text-white/50">
              {currentStep + 1} z {demoSteps.length}
            </span>
            
            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-utopia-500 hover:bg-utopia-600 text-white rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
              disabled={currentStep === demoSteps.length - 1}
            >
              Ďalej
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-utopia-400 font-light text-lg">
            Toto je len ukážka. Tvoja verzia bude ušitá na mieru.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;
