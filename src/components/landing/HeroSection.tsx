
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('landing');

  const handleStartOrder = () => {
    navigate('/onboarding');
  };

  const handleHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-light-gray-50 to-white flex items-center justify-center px-6 overflow-hidden pt-20">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-utopia-100/40 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent-yellow/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-left">
            {/* Main heading with much larger typography */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-light text-gray-900 mb-8 animate-fade-in-up tracking-tight leading-tight">
              <span className="block font-extralight">{t('hero.build')}</span>
              <span className="block bg-blue-gradient bg-clip-text text-transparent font-normal">
                {t('hero.brilliant')}
              </span>
              <span className="block text-gray-700 text-4xl md:text-6xl lg:text-7xl mt-4 font-extralight">
                {t('hero.fintech')}
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-2xl md:text-3xl text-gray-600 mb-12 max-w-2xl animate-fade-in-up leading-relaxed font-light" style={{ animationDelay: '0.2s' }}>
              {t('hero.subtitle')}
              <br />
              <span className="text-utopia-500 font-medium">{t('hero.highlight')}</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 mb-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <Button 
                onClick={handleStartOrder}
                size="lg" 
                className="bg-blue-gradient text-white px-12 py-6 text-xl font-medium rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {t('hero.startOrder')}
              </Button>
              
              <Button 
                onClick={handleHowItWorks}
                variant="outline" 
                size="lg" 
                className="border-2 border-utopia-500 text-utopia-500 hover:bg-utopia-50 px-12 py-6 text-xl font-medium rounded-2xl transition-all duration-300 hover:scale-105"
              >
                {t('hero.howItWorks')}
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-8 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-center sm:text-left">
                <div className="text-4xl font-bold text-utopia-500 mb-2">90%</div>
                <div className="text-gray-600 font-medium">{t('hero.stats.success')}</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-4xl font-bold text-utopia-500 mb-2">10 min</div>
                <div className="text-gray-600 font-medium">{t('hero.stats.time')}</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-4xl font-bold text-utopia-500 mb-2">500+</div>
                <div className="text-gray-600 font-medium">{t('hero.stats.clients')}</div>
              </div>
            </div>
          </div>

          {/* Right Content - 3D Mockup */}
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="relative">
              {/* Main device mockup */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-6 hover:rotate-3 transition-transform duration-500">
                <div className="bg-gradient-to-br from-utopia-500 to-utopia-light rounded-2xl p-6 text-white">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold mb-2">UTOPIA Terminal</div>
                    <div className="text-utopia-100">Nová generácia platieb</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Platba kartou</span>
                        <span className="text-green-300">✓</span>
                      </div>
                      <div className="text-2xl font-bold">€24.99</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-xs">Contactless</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-xs">Chip & PIN</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-xs">Mobile Pay</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-accent-yellow rounded-full w-16 h-16 flex items-center justify-center shadow-lg animate-bounce-gentle">
                <span className="text-2xl">⚡</span>
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-accent-green rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-bounce-gentle" style={{ animationDelay: '0.5s' }}>
                <span className="text-xl">💳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
