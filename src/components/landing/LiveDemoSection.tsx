
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, CreditCard, PenTool } from "lucide-react";

const LiveDemoSection = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Zadaj názov firmy",
      icon: Search,
      content: (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Názov firmy alebo IČO
            </label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Napr. Restaurant Bratislava..."
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-utopia-500 focus:border-transparent"
                defaultValue="Restaurant Bratislava"
              />
              <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="bg-utopia-50 p-4 rounded-lg">
            <p className="text-sm text-utopia-700">
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
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-utopia-500">
            <div className="w-12 h-12 bg-utopia-100 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-utopia-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Platobný terminál</h4>
            <p className="text-sm text-gray-600 mb-3">Pre bežné platby kartou</p>
            <div className="text-utopia-600 font-semibold">Odporúčaný ✓</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Smart pokladňa</h4>
            <p className="text-sm text-gray-600 mb-3">All-in-one riešenie</p>
          </div>
        </div>
      )
    },
    {
      title: "Digitálny podpis zmluvy",
      icon: PenTool,
      content: (
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="border-2 border-dashed border-utopia-300 rounded-lg p-8 text-center">
            <PenTool className="w-12 h-12 text-utopia-500 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 mb-2">Podpíš zmluvu</h4>
            <p className="text-gray-600 mb-4">Použij prst alebo myš na podpis</p>
            <div className="bg-utopia-50 p-4 rounded-lg">
              <p className="text-sm text-utopia-700">
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
    <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vyskúšaj si, ako to vyzerá
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-8">
            {demoSteps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index === currentStep
                    ? 'bg-utopia-500 text-white'
                    : index < currentStep
                    ? 'bg-utopia-100 text-utopia-600'
                    : 'bg-gray-100 text-gray-400'
                }`}>
                  {index + 1}
                </div>
                {index < demoSteps.length - 1 && (
                  <div className={`w-12 h-1 mx-2 ${
                    index < currentStep ? 'bg-utopia-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current step */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-utopia-100 rounded-xl flex items-center justify-center">
                {React.createElement(demoSteps[currentStep].icon, {
                  className: "w-6 h-6 text-utopia-600"
                })}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">
                {demoSteps[currentStep].title}
              </h3>
            </div>
          </div>

          {/* Step content */}
          <div className="mb-8 animate-fade-in">
            {demoSteps[currentStep].content}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={prevStep}
              variant="outline"
              className="flex items-center gap-2"
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
              className="flex items-center gap-2 bg-utopia-500 hover:bg-utopia-600"
              disabled={currentStep === demoSteps.length - 1}
            >
              Ďalej
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-utopia-600 font-medium">
            Toto je len ukážka. Tvoja verzia bude ušitá na mieru.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LiveDemoSection;
