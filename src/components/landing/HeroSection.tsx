
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleStartOrder = () => {
    navigate('/onboarding');
  };

  const handleHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.querySelector('.hero-container')?.getBoundingClientRect();
      if (rect) {
        setMousePosition({
          x: (e.clientX - rect.left - rect.width / 2) / 20,
          y: (e.clientY - rect.top - rect.height / 2) / 20
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="hero-container relative min-h-screen bg-gradient-to-br from-light-gray-50 via-white to-light-gray-100 flex items-center justify-center px-6 overflow-hidden pt-20">
      {/* Ultra-modern background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-utopia-200/40 to-utopia-light/30 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-r from-accent-purple/30 to-utopia-400/40 rounded-full blur-3xl animate-float-3d" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-accent-cyan/40 to-accent-yellow/30 rounded-full blur-3xl animate-float-3d" style={{ animationDelay: '2s' }}></div>
        
        {/* Mesh gradient overlay */}
        <div className="absolute inset-0 bg-mesh-gradient opacity-60"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Content - Enhanced */}
          <div className="text-left space-y-8">
            {/* Revolutionary heading with letter reveal animation */}
            <div className="overflow-hidden">
              <h1 className="text-7xl md:text-9xl lg:text-11xl font-extralight text-gray-900 leading-tight tracking-tight">
                <span className="block animate-letter-reveal opacity-0" style={{ animationDelay: '0.1s' }}>Build</span>
                <span className="block bg-gradient-to-r from-utopia-500 via-utopia-light to-accent-cyan bg-clip-text text-transparent font-light animate-letter-reveal opacity-0 bg-[length:200%_100%] animate-text-shimmer" style={{ animationDelay: '0.3s' }}>
                  Brilliant
                </span>
                <span className="block text-gray-700 text-5xl md:text-7xl lg:text-8xl mt-4 font-thin animate-letter-reveal opacity-0" style={{ animationDelay: '0.5s' }}>
                  Fintech Solutions
                </span>
              </h1>
            </div>

            {/* Premium subheading with mask reveal */}
            <div className="overflow-hidden">
              <p className="text-2xl md:text-3xl lg:text-4xl text-gray-600 mb-12 max-w-2xl leading-relaxed font-light animate-mask-reveal opacity-0" style={{ animationDelay: '0.7s' }}>
                Objednaj si pokladňu, terminál alebo softvér online – presne pre tvoje podnikanie.
                <br />
                <span className="text-utopia-500 font-medium bg-gradient-to-r from-utopia-500 to-utopia-light bg-clip-text text-transparent">
                  Bez papierov, bez stresu. Hotovo do pár minút.
                </span>
              </p>
            </div>

            {/* Magnetic CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16 animate-stagger-fade-in opacity-0" style={{ animationDelay: '0.9s' }}>
              <Button 
                onClick={handleStartOrder}
                size="lg" 
                className="group relative overflow-hidden bg-blue-gradient text-white px-12 py-6 text-xl font-medium rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-premium magnetic-hover border-0"
              >
                <span className="relative z-10">Začať objednávku</span>
                <div className="absolute inset-0 bg-shimmer-gradient animate-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Button>
              
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg" 
                className="group glass-card text-utopia-600 hover:text-utopia-700 px-12 py-6 text-xl font-medium rounded-2xl transition-all duration-500 hover:scale-105 hover:shadow-glass magnetic-hover border-utopia-200/50"
              >
                <span className="relative z-10">Ako to funguje</span>
              </Button>
            </div>

            {/* 3D Stats with neomorphism */}
            <div className="flex flex-col sm:flex-row gap-8 animate-stagger-fade-in opacity-0" style={{ animationDelay: '1.1s' }}>
              {[
                { value: "90%", label: "Úspešnosť za 24h", delay: "0s" },
                { value: "10 min", label: "Priemerný onboarding", delay: "0.1s" },
                { value: "500+", label: "Spokojných klientov", delay: "0.2s" }
              ].map((stat, index) => (
                <div key={index} className="text-center sm:text-left group perspective-1000" style={{ animationDelay: stat.delay }}>
                  <div className="preserve-3d transition-transform duration-500 group-hover:animate-tilt">
                    <div className="text-5xl font-bold bg-gradient-to-r from-utopia-500 to-utopia-light bg-clip-text text-transparent mb-2 animate-glow-pulse">
                      {stat.value}
                    </div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - 3D Interactive Terminal */}
          <div className="relative animate-stagger-fade-in opacity-0 perspective-1000" style={{ animationDelay: '1.3s' }}>
            <div 
              className="relative transform-gpu transition-transform duration-300 preserve-3d"
              style={{ 
                transform: `rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg)`
              }}
            >
              {/* Main 3D Terminal Mockup */}
              <div className="group relative bg-white rounded-3xl shadow-3d p-8 transform rotate-6 hover:rotate-3 transition-all duration-500 hover:shadow-premium glass-card backdrop-blur-xl">
                <div className="relative bg-gradient-to-br from-utopia-500 via-utopia-600 to-utopia-light rounded-2xl p-8 text-white overflow-hidden">
                  {/* Animated background pattern */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                  
                  <div className="relative z-10">
                    <div className="text-center mb-8">
                      <div className="text-3xl font-bold mb-3 animate-glow-pulse">UTOPIA Terminal</div>
                      <div className="text-utopia-100 text-lg">Nová generácia platieb</div>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="glass-card p-6 rounded-xl backdrop-blur-sm border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm text-utopia-100">Platba kartou</span>
                          <span className="text-green-300 text-xl animate-bounce-3d">✓</span>
                        </div>
                        <div className="text-3xl font-bold text-white">€24.99</div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {['Contactless', 'Chip & PIN', 'Mobile Pay'].map((method, index) => (
                          <div key={method} className="glass-card p-4 rounded-lg text-center backdrop-blur-sm border border-white/20 group-hover:animate-bounce-3d" style={{ animationDelay: `${index * 0.1}s` }}>
                            <div className="text-xs text-utopia-100">{method}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating 3D Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-r from-accent-yellow to-accent-orange rounded-full flex items-center justify-center shadow-glow animate-float-3d group-hover:animate-morph">
                <span className="text-3xl">⚡</span>
              </div>
              
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-r from-accent-green to-accent-cyan rounded-full flex items-center justify-center shadow-glow animate-float-3d group-hover:animate-morph" style={{ animationDelay: '0.5s' }}>
                <span className="text-2xl">💳</span>
              </div>

              {/* Interactive glow rings */}
              <div className="absolute inset-0 rounded-3xl border-2 border-utopia-400/30 animate-glow-pulse pointer-events-none"></div>
              <div className="absolute inset-4 rounded-2xl border border-utopia-300/20 animate-glow-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
