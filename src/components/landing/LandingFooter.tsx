import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const LandingFooter = () => {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/auth');
  };
  return <footer className="bg-gray-900 text-white py-20 px-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-utopia-900/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" alt="Utopia Logo" className="h-12 w-auto brightness-0 invert opacity-90 hover:scale-110 transition-transform duration-300" />
              
            </div>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
              Digitálny onboarding portál pre moderné fintech riešenia. 
              Objednaj si pokladňu, terminál alebo softvér online.
            </p>
            <Button onClick={handleLoginClick} variant="outline" className="bg-white/10 border-utopia-500 text-utopia-400 hover:bg-utopia-500/10 hover:border-utopia-400 rounded-xl px-6 py-3 transition-all duration-300 hover:shadow-lg">
              Prihlásiť sa do portálu
            </Button>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-lg">Navigácia</h4>
            <ul className="space-y-3 text-gray-300">
              <li><a href="#" className="hover:text-utopia-400 transition-colors">O nás</a></li>
              <li><a href="#" className="hover:text-utopia-400 transition-colors">Kontakt</a></li>
              <li><a href="#" className="hover:text-utopia-400 transition-colors">Obchodné podmienky</a></li>
              <li><a href="#" className="hover:text-utopia-400 transition-colors">GDPR</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-6 text-white text-lg">Sleduj nás</h4>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-utopia-500/20 hover:border-utopia-500/50 transition-all duration-300 hover:shadow-lg">
                <span className="text-sm font-medium text-white/80">Li</span>
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-utopia-500/20 hover:border-utopia-500/50 transition-all duration-300 hover:shadow-lg">
                <span className="text-sm font-medium text-white/80">Fb</span>
              </a>
              <a href="#" className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center hover:bg-utopia-500/20 hover:border-utopia-500/50 transition-all duration-300 hover:shadow-lg">
                <span className="text-sm font-medium text-white/80">Ig</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 UTOPIA – Onboarding pre nový digitálny svet
          </p>
        </div>
      </div>
    </footer>;
};
export default LandingFooter;