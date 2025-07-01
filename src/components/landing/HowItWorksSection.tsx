
import { Search, Settings, PenTool } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Search,
      title: "Vyhľadaj svoju firmu",
      description: "Zadaj názov alebo IČO a predvyplníme všetko za teba.",
      number: "01"
    },
    {
      icon: Settings,
      title: "Vyber si riešenie",
      description: "Terminál, pokladňa alebo softvér – odporučíme ti, čo sa hodí.",
      number: "02"
    },
    {
      icon: PenTool,
      title: "Vyplň, podpíš, hotovo",
      description: "Objednávku dokončíš za pár minút bez papierovania.",
      number: "03"
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ako prebieha objednávka?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="text-center group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-utopia-400 to-utopia-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-utopia-100 rounded-full flex items-center justify-center text-utopia-600 font-bold text-sm">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-utopia-600 font-medium">
            Celý proces zaberie menej než 10 minút.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
