
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Building, CreditCard, PenTool } from "lucide-react";

const LiveDemoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [currentStep, setCurrentStep] = useState(0);

  const demoSteps = [
    {
      title: "Zadaj názov firmy",
      description: "Začni zadaním názvu alebo IČO svojej firmy",
      icon: Building,
      mockup: (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Názov firmy alebo IČO
            </label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Zadaj názov firmy..."
                value="UTOPIA s.r.o."
                readOnly
              />
              <div className="absolute right-3 top-3">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600">Automaticky vyplnené:</div>
            <div className="mt-2 space-y-1">
              <div className="text-sm"><span className="font-medium">IČO:</span> 12345678</div>
              <div className="text-sm"><span className="font-medium">Adresa:</span> Bratislava, Slovensko</div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Vyber terminál alebo pokladňu",
      description: "Odporučíme ti najvhodnejšie riešenie",
      icon: CreditCard,
      mockup: (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-primary rounded-lg p-4 bg-primary/5">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-3">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Platobný terminál</h4>
              <p className="text-sm text-gray-600 mb-3">Odporúčané pre váš typ podnikania</p>
              <div className="text-sm text-primary font-medium">✓ Vybrané</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <Building className="h-6 w-6 text-gray-400" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Pokladňa</h4>
              <p className="text-sm text-gray-600">Pre väčšie prevádzkové potreby</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Digitálny podpis zmluvy",
      description: "Podpíš zmluvu priamo v prehliadači",
      icon: PenTool,
      mockup: (
        <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">Zmluva na poskytovanie služieb</h4>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-sm text-gray-600">
              <div className="space-y-2">
                <div>📄 Objednávka platobného terminálu</div>
                <div>💰 Mesačný poplatok: 15€</div>
                <div>⚡ Aktivácia do 24h</div>
              </div>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <PenTool className="h-8 w-8 text-primary mx-auto mb-2" />
            <div className="text-sm text-gray-600 mb-2">Podpíš prstom alebo myšou</div>
            <div className="text-xs text-gray-500">Právne záväzný digitálny podpis</div>
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
    <section ref={ref} className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Vyskúšaj si, ako to vyzerá
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {/* Demo content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            {/* Left side - Info */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <demoSteps[currentStep].icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-sm text-primary font-medium">
                    Krok {currentStep + 1} z {demoSteps.length}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {demoSteps[currentStep].title}
                  </h3>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-8">
                {demoSteps[currentStep].description}
              </p>
              
              {/* Navigation */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Predchádzajúci
                </Button>
                <Button
                  onClick={nextStep}
                  className="bg-primary hover:bg-primary-dark text-white flex items-center gap-2"
                >
                  Ďalší
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right side - Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative"
            >
              {demoSteps[currentStep].mockup}
            </motion.div>
          </motion.div>

          {/* Step indicators */}
          <div className="flex justify-center mt-12 gap-2">
            {demoSteps.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
                whileHover={{ scale: 1.2 }}
              />
            ))}
          </div>
        </div>

        {/* Microtext */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-lg">
            Toto je len ukážka. Tvoja verzia bude ušitá na mieru.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemoSection;
