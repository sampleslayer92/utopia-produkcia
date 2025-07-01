
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
    <section id="how-it-works" className="py-32 px-6 bg-dark relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark-50/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Ako prebieha <span className="text-utopia-500">objednávka</span>?
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Glassmorphism card */}
              <div className="relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full transition-all duration-300 hover:bg-white/10 hover:border-utopia-500/30 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,212,255,0.2)]">
                {/* Step number */}
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-utopia-500 to-neon-blue rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg">
                  {step.number}
                </div>
                
                {/* Icon container */}
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-utopia-400/20 to-neon-blue/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto group-hover:animate-glow border border-utopia-500/20">
                    <step.icon className="w-10 h-10 text-utopia-400 group-hover:text-utopia-300 transition-colors duration-300" strokeWidth={1.5} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-medium text-white mb-4 text-center">
                  {step.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed text-center font-light">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-utopia-400 font-light text-lg">
            Celý proces zaberie menej než 10 minút.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
