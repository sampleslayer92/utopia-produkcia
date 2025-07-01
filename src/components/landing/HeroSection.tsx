
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
    <section className="relative min-h-screen bg-gradient-to-br from-white via-utopia-50/30 to-utopia-100/20 flex items-center justify-center px-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-utopia-200/20 rounded-full animate-float"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-utopia-300/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-utopia-400/20 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <img 
            src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
            alt="Utopia Logo" 
            className="h-16 md:h-20 w-auto mx-auto mb-6" 
          />
        </div>

        {/* Main heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 animate-fade-in-up">
          <span className="block">UTOPIA</span>
          <span className="block text-utopia-500 mt-2">Budúcnosť fintech onboardingu</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Objednaj si pokladňu, terminál alebo softvér online – presne pre tvoje podnikanie.<br />
          <span className="font-medium text-utopia-600">Bez papierov, bez stresu. Hotovo do pár minút.</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleStartOrder}
            size="lg" 
            className="bg-utopia-500 hover:bg-utopia-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Začať objednávku
          </Button>
          <Button 
            onClick={handleHowItWorks}
            variant="outline" 
            size="lg" 
            className="border-utopia-500 text-utopia-600 hover:bg-utopia-50 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
          >
            Ako to funguje
          </Button>
        </div>

        {/* Micro text */}
        <p className="text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          Nie je potrebné nič inštalovať. Stačí tvoja firma a pár klikov.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
