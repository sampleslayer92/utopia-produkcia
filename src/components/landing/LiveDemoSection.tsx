
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, CreditCard, PenTool } from "lucide-react";

const LiveDemoSection = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState("");

  const demoSteps = [
    {
      title: "Zadaj názov firmy",
      icon: Search,
      content: (
        <div className="glass-card rounded-3xl p-10 shadow-premium backdrop-blur-xl border border-white/20 hover:shadow-glow-lg transition-all duration-500 group">
          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-4">
              Názov firmy alebo IČO
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Napr. Restaurant Bratislava..."
                className="w-full px-6 py-5 bg-white/60 border-2 border-gray-200/50 rounded-2xl text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-utopia-500/20 focus:border-utopia-500 transition-all duration-500 text-lg backdrop-blur-sm shadow-neomorphism focus:shadow-neomorphism-inset"
                defaultValue="Restaurant Bratislava"
              />
              <Search className="absolute right-6 top-5 w-6 h-6 text-gray-400 animate-glow-pulse" />
            </div>
          </div>
          <div className="glass-card border border-green-200/50 p-6 rounded-2xl backdrop-blur-sm animate-stagger-fade-in hover:shadow-glow transition-all duration-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center animate-bounce-3d">
                <span className="text-white font-bold text-sm">✓</span>
              </div>
              <p className="text-green-700 font-semibold">
                Firma nájdená! Predvypĺňame údaje...
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Vyber terminál alebo pokladňu",
      icon: CreditCard,
      content: (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-card border-2 border-utopia-500/50 rounded-3xl p-8 hover:shadow-glow-lg transition-all duration-500 shadow-premium group perspective-1000 hover:animate-tilt">
            <div className="preserve-3d">
              <div className="w-20 h-20 bg-gradient-to-br from-utopia-500 to-utopia-light rounded-3xl flex items-center justify-center mb-8 shadow-premium group-hover:shadow-glow transition-all duration-500 animate-morph">
                <CreditCard className="w-10 h-10 text-white transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-xl">Platobný terminál</h4>
              <p className="text-gray-600 mb-6">Pre bežné platby kartou</p>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-utopia-500 rounded-full animate-glow-pulse"></div>
                <div className="text-utopia-600 font-bold">Odporúčaný</div>
              </div>
            </div>
          </div>
          <div className="glass-card border border-gray-200/50 rounded-3xl p-8 hover:shadow-premium transition-all duration-500 group perspective-1000 hover:animate-tilt">
            <div className="preserve-3d">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-300 to-gray-400 rounded-3xl flex items-center justify-center mb-8 shadow-neomorphism transition-all duration-500">
                <CreditCard className="w-10 h-10 text-gray-600" strokeWidth={1.5} />
              </div>
              <h4 className="font-bold text-gray-900 mb-3 text-xl">Smart pokladňa</h4>
              <p className="text-gray-600 mb-6">All-in-one riešenie</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Digitálny podpis zmluvy",
      icon: PenTool,
      content: (
        <div className="glass-card rounded-3xl p-10 shadow-premium backdrop-blur-xl border border-white/20 group">
          <div className="border-2 border-dashed border-utopia-300/50 rounded-3xl p-16 text-center hover:border-utopia-500/50 transition-all duration-500 hover:shadow-glow backdrop-blur-sm">
            <div className="mb-8 perspective-1000">
              <PenTool className="w-20 h-20 text-utopia-500 mx-auto transition-transform duration-500 group-hover:animate-float-3d animate-glow-pulse" strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-gray-900 mb-4 text-2xl">Podpíš zmluvu</h4>
            <p className="text-gray-600 mb-8 text-lg">Použij prst alebo myš na podpis</p>
            <div className="glass-card border border-blue-200/50 p-6 rounded-2xl backdrop-blur-sm hover:shadow-glow transition-all duration-500">
              <div className="flex items-center gap-3 justify-center">
                <span className="text-2xl animate-bounce-3d">📱</span>
                <p className="text-blue-700 font-semibold">
                  Môžeš podpísať aj na mobile alebo tablete
                </p>
              </div>
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
    <section className="py-32 px-6 bg-gradient-to-b from-light-gray-50 via-white to-light-gray-50 relative overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-30"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-utopia-50/10 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Enhanced heading */}
        <div className="text-center mb-24 animate-stagger-fade-in">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-extralight text-gray-900 mb-8 leading-tight">
            Vyskúšaj si, ako to{" "}
            <span className="bg-gradient-to-r from-utopia-500 via-utopia-light to-accent-cyan bg-clip-text text-transparent font-light bg-[length:200%_100%] animate-text-shimmer">
              vyzerá
            </span>
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-light">
            Interaktívna ukážka onboarding procesu
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-12 shadow-premium backdrop-blur-xl border border-white/20 hover:shadow-glow-lg transition-all duration-500">
          {/* 3D Step indicator */}
          <div className="flex items-center justify-center mb-16 perspective-1000">
            {demoSteps.map((_, index) => (
              <div key={index} className="flex items-center preserve-3d">
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center font-bold text-lg transition-all duration-500 shadow-neomorphism hover:animate-tilt ${
                  index === currentStep
                    ? 'bg-gradient-to-br from-utopia-500 to-utopia-light text-white shadow-glow animate-glow-pulse'
                    : index < currentStep
                    ? 'bg-gradient-to-br from-utopia-200 to-utopia-300 text-utopia-700 border border-utopia-400/30'
                    : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-500 border border-gray-400/30'
                }`}>
                  {index + 1}
                </div>
                {index < demoSteps.length - 1 && (
                  <div className={`w-20 h-2 mx-6 rounded-full transition-all duration-500 ${
                    index < currentStep ? 'bg-gradient-to-r from-utopia-500 to-utopia-light animate-shimmer' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current step header */}
          <div className="text-center mb-12 animate-stagger-fade-in">
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="w-20 h-20 glass-card rounded-3xl flex items-center justify-center border border-utopia-300/50 shadow-neomorphism hover:animate-morph transition-all duration-500">
                {React.createElement(demoSteps[currentStep].icon, {
                  className: "w-10 h-10 text-utopia-600 animate-glow-pulse",
                  strokeWidth: 1.5
                })}
              </div>
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                {demoSteps[currentStep].title}
              </h3>
            </div>
          </div>

          {/* Step content with advanced animations */}
          <div className="mb-12 animate-mask-reveal">
            {demoSteps[currentStep].content}
          </div>

          {/* Premium navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={prevStep}
              variant="outline"
              className="glass-card border-gray-300/50 text-gray-600 hover:bg-utopia-50 hover:border-utopia-500/50 rounded-2xl px-8 py-4 text-lg transition-all duration-500 hover:scale-105 magnetic-hover shadow-neomorphism"
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Späť
            </Button>
            
            <div className="glass-card px-6 py-3 rounded-2xl border border-utopia-200/50 backdrop-blur-sm">
              <span className="text-gray-600 font-medium">
                {currentStep + 1} z {demoSteps.length}
              </span>
            </div>
            
            <Button
              onClick={nextStep}
              className="bg-gradient-to-r from-utopia-500 to-utopia-light text-white rounded-2xl px-8 py-4 text-lg transition-all duration-500 hover:scale-105 hover:shadow-glow magnetic-hover border-0"
              disabled={currentStep === demoSteps.length - 1}
            >
              Ďalej
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Enhanced info card */}
        <div className="text-center mt-16 animate-stagger-fade-in">
          <div className="inline-block glass-card border border-yellow-200/50 rounded-3xl p-8 backdrop-blur-xl shadow-premium hover:shadow-glow transition-all duration-500 hover:scale-105 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-bounce-3d">
                <span className="text-2xl">💡</span>
              </div>
              <p className="text-yellow-700 font-semibold text-xl group-hover:text-yellow-800 transition-colors duration-300">
                Toto je len ukážka. Tvoja verzia bude ušitá na mieru.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;
