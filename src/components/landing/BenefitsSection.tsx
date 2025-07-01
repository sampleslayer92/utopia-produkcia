
import { CreditCard, Brain, FileText, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: CreditCard,
      title: "Prepojenie na platobné brány",
      description: "Global Payments, SumUp, GP WebPay a ďalší.",
      gradient: "from-neon-blue/20 to-utopia-500/20"
    },
    {
      icon: Brain,
      title: "Smart výber zariadení",
      description: "Na základe tvojej firmy odporučíme vhodné riešenia.",
      gradient: "from-neon-purple/20 to-neon-pink/20"
    },
    {
      icon: FileText,
      title: "Online podpis zmluvy",
      description: "Žiadna tlač ani skenovanie – podpisuješ digitálne.",
      gradient: "from-neon-green/20 to-utopia-500/20"
    },
    {
      icon: Shield,
      title: "Bezpečné & rýchle",
      description: "Cloudové riešenie s dôrazom na GDPR a stabilitu.",
      gradient: "from-utopia-500/20 to-neon-blue/20"
    }
  ];

  return (
    <section className="py-32 px-6 bg-dark relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-utopia-500/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Prečo si firmy vyberajú <span className="text-utopia-500">UTOPIU</span>?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`relative bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 h-full transition-all duration-300 hover:bg-white/10 hover:border-utopia-500/30 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,212,255,0.2)]`}>
                {/* Icon container */}
                <div className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} backdrop-blur-sm rounded-3xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-utopia-500/30 transition-all duration-300`}>
                  <benefit.icon className="w-10 h-10 text-utopia-400 group-hover:text-utopia-300 transition-colors duration-300" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-medium text-white mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed font-light">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-utopia-400 font-light text-lg">
            Viac než 90 % používateľov dokončí onboarding v jeden deň.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
