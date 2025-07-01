
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartOrder = () => {
    navigate('/onboarding');
  };

  const handleHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-dark flex items-center justify-center px-6 overflow-hidden">
      {/* Animated background with gradient mesh */}
      <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-40"></div>
      
      {/* Floating orbs with glow effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-utopia-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-neon-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-neon-green/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-5xl mx-auto">
        {/* Logo - smaller and more refined */}
        <div className="mb-12 animate-fade-in">
          <img 
            src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
            alt="Utopia Logo" 
            className="h-12 md:h-16 w-auto mx-auto mb-8 brightness-0 invert opacity-90" 
          />
        </div>

        {/* Main heading with larger typography */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-8 animate-fade-in-up tracking-tight">
          <span className="block font-extralight">UTOPIA</span>
          <span className="block text-utopia-500 mt-4 bg-gradient-to-r from-utopia-400 via-utopia-500 to-neon-blue bg-clip-text text-transparent font-normal">
            Budúcnosť fintech
          </span>
          <span className="block text-white/80 text-4xl md:text-5xl lg:text-6xl mt-2 font-extralight">
            onboardingu
          </span>
        </h1>

        {/* Subheading with refined styling */}
        <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-4xl mx-auto animate-fade-in-up leading-relaxed font-light" style={{ animationDelay: '0.2s' }}>
          Objednaj si pokladňu, terminál alebo softvér online – presne pre tvoje podnikanie.
          <br />
          <span className="text-utopia-400 font-normal">Bez papierov, bez stresu. Hotovo do pár minút.</span>
        </p>

        {/* CTA Buttons with glassmorphism and glow effects */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleStartOrder}
            size="lg" 
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-10 py-6 text-lg font-medium rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]"
          >
            <span className="relative z-10">Začať objednávku</span>
            <div className="absolute inset-0 bg-gradient-to-r from-utopia-500/20 to-neon-blue/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <Button 
            onClick={handleHowItWorks}
            variant="outline" 
            size="lg" 
            className="bg-transparent border-2 border-utopia-500/50 text-utopia-400 hover:bg-utopia-500/10 hover:border-utopia-400 px-10 py-6 text-lg font-medium rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          >
            Ako to funguje
          </Button>
        </div>

        {/* Micro text */}
        <p className="text-sm text-white/50 animate-fade-in-up font-light" style={{ animationDelay: '0.6s' }}>
          Nie je potrebné nič inštalovať. Stačí tvoja firma a pár klikov.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
