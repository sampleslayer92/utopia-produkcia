
import { CreditCard, Brain, FileText, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: CreditCard,
      title: "Prepojenie na platobné brány",
      description: "Global Payments, SumUp, GP WebPay a ďalší.",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: Brain,
      title: "Smart výber zariadení",
      description: "Na základe tvojej firmy odporučíme vhodné riešenia.",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: FileText,
      title: "Online podpis zmluvy",
      description: "Žiadna tlač ani skenovanie – podpisuješ digitálne.",
      gradient: "from-green-400 to-green-600"
    },
    {
      icon: Shield,
      title: "Bezpečné & rýchle",
      description: "Cloudové riešenie s dôrazom na GDPR a stabilitu.",
      gradient: "from-utopia-400 to-utopia-600"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Prečo si firmy vyberajú UTOPIU?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {benefit.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-utopia-600 font-medium">
            Viac než 90 % používateľov dokončí onboarding v jeden deň.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
