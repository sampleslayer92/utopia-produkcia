
import { Button } from "@/components/ui/button";
import MagneticButton from "@/components/ui/MagneticButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStartOrder = () => {
    navigate('/onboarding');
  };

  const handleHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-mesh-gradient animate-mesh-gradient"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full opacity-60 animate-particle-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-12 gap-16 items-center h-full">
            
            {/* Left Content - Typography */}
            <div className="lg:col-span-7 text-left">
              {/* Main Heading with Extreme Typography */}
              <div className="mb-12">
                <div className="overflow-hidden">
                  <h1 className="text-9xl md:text-11xl lg:text-13xl font-extralight text-white mb-4 leading-none tracking-tighter animate-text-reveal">
                    <span className="block opacity-90">Build</span>
                  </h1>
                </div>
                
                <div className="overflow-hidden">
                  <h1 
                    className="text-9xl md:text-11xl lg:text-13xl font-thin mb-4 leading-none tracking-tighter animate-text-reveal bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink bg-clip-text text-transparent bg-size-200 animate-gradient-x"
                    style={{ animationDelay: '0.2s' }}
                  >
                    <span className="block">Brilliant</span>
                  </h1>
                </div>
                
                <div className="overflow-hidden">
                  <h2 
                    className="text-5xl md:text-7xl lg:text-8xl font-extralight text-slate-300 leading-tight tracking-wide animate-text-reveal"
                    style={{ animationDelay: '0.4s' }}
                  >
                    Fintech Solutions
                  </h2>
                </div>
              </div>

              {/* Subheading with shimmer effect */}
              <div 
                className="mb-16 animate-fade-in-up"
                style={{ animationDelay: '0.6s' }}
              >
                <p className="text-2xl md:text-3xl text-slate-200 leading-relaxed font-light max-w-3xl relative">
                  <span className="relative inline-block">
                    Objednaj si pokladňu, terminál alebo softvér online – presne pre tvoje podnikanie.
                    <div className="absolute inset-0 bg-shimmer bg-size-200 animate-shimmer opacity-30"></div>
                  </span>
                  <br />
                  <span className="text-neon-blue font-medium mt-4 block">
                    Bez papierov, bez stresu. Hotovo do pár minút.
                  </span>
                </p>
              </div>

              {/* Premium CTA Buttons */}
              <div 
                className="flex flex-col sm:flex-row gap-8 mb-20 animate-fade-in-up"
                style={{ animationDelay: '0.8s' }}
              >
                <MagneticButton
                  onClick={handleStartOrder}
                  className="bg-gradient-to-r from-neon-blue to-neon-purple text-white px-16 py-8 text-2xl font-medium rounded-3xl shadow-2xl hover:shadow-neon-blue/25 border border-white/20 backdrop-blur-xl"
                >
                  <span className="relative z-10">Začať objednávku</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-purple/20 rounded-3xl animate-glow"></div>
                </MagneticButton>
                
                <MagneticButton
                  onClick={handleHowItWorks}
                  variant="outline"
                  className="border-2 border-neon-blue/50 text-neon-blue hover:bg-neon-blue/10 px-16 py-8 text-2xl font-medium rounded-3xl backdrop-blur-xl bg-white/5"
                >
                  Ako to funguje
                </MagneticButton>
              </div>

              {/* Enhanced Stats */}
              <div 
                className="flex flex-col sm:flex-row gap-12 animate-fade-in-up"
                style={{ animationDelay: '1s' }}
              >
                {[
                  { value: "90%", label: "Úspešnosť za 24h", color: "neon-green" },
                  { value: "10 min", label: "Priemerný onboarding", color: "neon-blue" },
                  { value: "500+", label: "Spokojných klientov", color: "neon-purple" }
                ].map((stat, index) => (
                  <div key={index} className="text-center sm:text-left group">
                    <div className={`text-6xl font-bold text-${stat.color} mb-3 group-hover:scale-110 transition-transform duration-300`}>
                      {stat.value}
                    </div>
                    <div className="text-slate-400 font-medium text-lg">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - 3D Interactive Terminal */}
            <div className="lg:col-span-5 relative">
              <div 
                className="relative animate-fade-in-up"
                style={{ 
                  animationDelay: '1.2s',
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 5}deg) rotateX(${mousePosition.y * 5}deg)`
                }}
              >
                {/* Main Terminal */}
                <div className="relative group">
                  <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-2xl rounded-3xl p-12 shadow-2xl border border-white/10 hover:border-neon-blue/30 transition-all duration-500 animate-terminal-glow">
                    
                    {/* Terminal Header */}
                    <div className="flex items-center gap-3 mb-8">
                      <div className="flex gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                      </div>
                      <div className="text-slate-400 text-sm ml-4">UTOPIA Terminal v2.0</div>
                    </div>

                    {/* Terminal Content */}
                    <div className="bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 rounded-2xl p-8 border border-neon-blue/20">
                      <div className="text-center mb-8">
                        <div className="text-3xl font-bold text-white mb-2">UTOPIA Terminal</div>
                        <div className="text-neon-blue text-lg">Nová generácia platieb</div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="bg-white/10 backdrop-blur-xl rounded-xl p-6 border border-white/20">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-slate-300">Platba kartou</span>
                            <span className="text-neon-green text-xl">✓</span>
                          </div>
                          <div className="text-4xl font-bold text-white">€24.99</div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3">
                          {['Contactless', 'Chip & PIN', 'Mobile Pay'].map((method, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-xl rounded-lg p-4 text-center border border-white/10 hover:border-neon-blue/30 transition-colors duration-300">
                              <div className="text-xs text-slate-300">{method}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <div className="absolute -top-6 -right-6 bg-gradient-to-r from-neon-yellow to-neon-orange rounded-full w-20 h-20 flex items-center justify-center shadow-2xl animate-bounce-gentle group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">⚡</span>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-neon-green to-neon-blue rounded-full w-16 h-16 flex items-center justify-center shadow-2xl animate-bounce-gentle group-hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
                    <span className="text-2xl">💳</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-gentle">
        <div className="flex flex-col items-center text-slate-400">
          <div className="text-sm mb-2">Scroll</div>
          <div className="w-0.5 h-8 bg-gradient-to-b from-neon-blue to-transparent"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
