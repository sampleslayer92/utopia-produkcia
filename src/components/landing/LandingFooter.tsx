
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingFooter = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/auth');
  };

  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Logo and description */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" 
                alt="Utopia Logo" 
                className="h-10 w-auto brightness-0 invert hover:scale-110 transition-transform duration-300" 
              />
              <span className="text-2xl font-bold">UTOPIA</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Digitálny onboarding portál pre moderné fintech riešenia. 
              Objednaj si pokladňu, terminál alebo softvér online.
            </p>
            <Button
              onClick={handleLoginClick}
              variant="outline"
              className="border-utopia-500 text-utopia-400 hover:bg-utopia-500 hover:text-white"
            >
              Prihlásiť sa do portálu
            </Button>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold mb-4">Navigácia</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-utopia-400 transition-colors">O nás</a></li>
              <li><a href="#" className="hover:text-utopia-400 transition-colors">Kontakt</a></li>
              <li><a href="#" className="hover:text-utopia-400 transition-colors">Obchodné podmienky</a></li>
              <li><a href="#" className="hover:text-utopia-400 transition-colors">GDPR</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4">Sleduj nás</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-utopia-500 transition-colors">
                <span className="text-sm font-bold">Li</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-utopia-500 transition-colors">
                <span className="text-sm font-bold">Fb</span>
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-utopia-500 transition-colors">
                <span className="text-sm font-bold">Ig</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 UTOPIA – Onboarding pre nový digitálny svet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
