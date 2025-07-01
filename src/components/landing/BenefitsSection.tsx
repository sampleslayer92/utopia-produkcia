
import { CreditCard, Brain, FileText, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: CreditCard,
      title: "Prepojenie na platobné brány",
      description: "Global Payments, SumUp, GP WebPay a ďalší.",
      color: "from-blue-500 to-utopia-500"
    },
    {
      icon: Brain,
      title: "Smart výber zariadení",
      description: "Na základe tvojej firmy odporučíme vhodné riešenia.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: FileText,
      title: "Online podpis zmluvy",
      description: "Žiadna tlač ani skenovanie – podpisuješ digitálne.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Shield,
      title: "Bezpečné & rýchle",
      description: "Cloudové riešenie s dôrazom na GDPR a stabilitu.",
      color: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="benefits" className="py-32 px-6 bg-white relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-gray-50/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-light text-gray-900 mb-6">
            Prečo si firmy vyberajú <span className="bg-blue-gradient bg-clip-text text-transparent">UTOPIU</span>?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Moderné riešenia pre moderné podnikanie
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative bg-white border border-gray-200 rounded-3xl p-8 h-full transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:scale-105 shadow-lg">
                {/* Icon container */}
                <div className={`w-20 h-20 bg-gradient-to-br ${benefit.color} rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                  <benefit.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
                </div>
                
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 inline-block">
            <p className="text-green-700 font-medium text-lg">
              ✅ Viac než 90 % používateľov dokončí onboarding v jeden deň
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
