
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
    <section id="how-it-works" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-gray-50/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Ako prebieha <span className="bg-blue-gradient bg-clip-text text-transparent">objednávka</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tri jednoduché kroky k tvojmu novému platobému riešeniu
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Card with light theme */}
              <div className="relative bg-white border border-gray-200 rounded-3xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-utopia-300 hover:scale-105 shadow-lg">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-blue-gradient rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {step.number}
                </div>
                
                {/* Icon container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-utopia-100 to-utopia-200 rounded-3xl flex items-center justify-center mx-auto group-hover:shadow-lg transition-all duration-300 border border-utopia-200">
                    <step.icon className="w-10 h-10 text-utopia-600 group-hover:text-utopia-700 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-utopia-50 border border-utopia-200 rounded-2xl p-6 inline-block">
            <p className="text-utopia-700 font-medium text-lg">
              ⏱️ Celý proces zaberie menej než 10 minút
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
