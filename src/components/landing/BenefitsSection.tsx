
import { CreditCard, Brain, FileText, Shield } from "lucide-react";
import { useState } from "react";

const BenefitsSection = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const benefits = [
    {
      icon: CreditCard,
      title: "Prepojenie na platobné brány",
      description: "Global Payments, SumUp, GP WebPay a ďalší.",
      color: "from-blue-500 via-utopia-500 to-utopia-light",
      accent: "utopia"
    },
    {
      icon: Brain,
      title: "Smart výber zariadení",
      description: "Na základe tvojej firmy odporučíme vhodné riešenia.",
      color: "from-purple-500 via-accent-purple to-pink-500",
      accent: "purple"
    },
    {
      icon: FileText,
      title: "Online podpis zmluvy",
      description: "Žiadna tlač ani skenovanie – podpisuješ digitálne.",
      color: "from-green-500 via-accent-green to-emerald-500",
      accent: "green"
    },
    {
      icon: Shield,
      title: "Bezpečné & rýchle",
      description: "Cloudové riešenie s dôrazom na GDPR a stabilitu.",
      color: "from-orange-500 via-accent-orange to-red-500",
      accent: "orange"
    }
  ];

  return (
    <section id="benefits" className="py-32 px-6 bg-gradient-to-b from-white via-light-gray-50 to-white relative overflow-hidden">
      {/* Ultra-modern background */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-40"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-utopia-50/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Premium heading */}
        <div className="text-center mb-24 animate-stagger-fade-in">
          <h2 className="text-6xl md:text-7xl lg:text-8xl font-extralight text-gray-900 mb-8 leading-tight">
            Prečo si firmy vyberajú{" "}
            <span className="bg-gradient-to-r from-utopia-500 via-utopia-light to-accent-cyan bg-clip-text text-transparent font-light bg-[length:200%_100%] animate-text-shimmer">
              UTOPIU
            </span>?
          </h2>
          <p className="text-2xl md:text-3xl text-gray-600 max-w-4xl mx-auto font-light">
            Moderné riešenia pre moderné podnikanie
          </p>
        </div>

        {/* 3D Interactive Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 perspective-1000">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group animate-stagger-fade-in preserve-3d"
              style={{ animationDelay: `${index * 0.15}s` }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative glass-card p-10 h-full transition-all duration-500 hover:scale-105 rounded-3xl border border-white/20 backdrop-blur-xl shadow-premium hover:shadow-glow-lg group-hover:animate-tilt overflow-hidden">
                {/* Dynamic background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
                
                {/* Shimmer effect on hover */}
                <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* 3D Morphing Icon */}
                  <div className="relative mb-10 perspective-1000">
                    <div className={`w-24 h-24 bg-gradient-to-br ${benefit.color} rounded-3xl flex items-center justify-center shadow-premium group-hover:shadow-glow transition-all duration-500 group-hover:animate-morph preserve-3d`}>
                      <benefit.icon 
                        className="w-12 h-12 text-white transition-transform duration-500 group-hover:scale-110" 
                        strokeWidth={1.5} 
                      />
                    </div>
                    
                    {/* Floating glow rings */}
                    <div className="absolute inset-0 rounded-3xl border-2 border-utopia-400/20 animate-glow-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Title with letter reveal on hover */}
                  <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6 transition-colors duration-300 group-hover:text-utopia-600">
                    {benefit.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-lg group-hover:text-gray-700 transition-colors duration-300">
                    {benefit.description}
                  </p>

                  {/* Interactive hover indicator */}
                  <div className="absolute bottom-6 right-6 w-3 h-3 rounded-full bg-utopia-400 opacity-0 group-hover:opacity-100 animate-glow-pulse transition-opacity duration-500"></div>
                </div>

                {/* Magnetic cursor follower effect */}
                {hoveredCard === index && (
                  <div className="absolute inset-0 border-2 border-utopia-400/30 rounded-3xl animate-glow-pulse pointer-events-none"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced success indicator */}
        <div className="text-center mt-20 animate-stagger-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="inline-block glass-card border border-green-200/50 rounded-3xl p-8 backdrop-blur-xl shadow-premium hover:shadow-glow transition-all duration-500 hover:scale-105 group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center animate-bounce-3d">
                <span className="text-2xl">✅</span>
              </div>
              <p className="text-green-700 font-semibold text-xl group-hover:text-green-800 transition-colors duration-300">
                Viac než 90 % používateľov dokončí onboarding v jeden deň
              </p>
            </div>
            <div className="absolute inset-0 border border-green-300/20 rounded-3xl animate-glow-pulse pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
