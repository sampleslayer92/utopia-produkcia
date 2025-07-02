import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
const LandingNavigation = () => {
  const navigate = useNavigate();
  const handleAuthClick = () => {
    navigate('/auth');
  };
  const handleOnboardingClick = () => {
    navigate('/onboarding');
  };
  return <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="https://famouscreative.eu/wp-content/uploads/2025/07/logo_utopia_svg.svg" alt="Utopia Logo" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-gray-900">
          </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-gray-600 hover:text-utopia-500 transition-colors font-medium">
              Ako to funguje
            </a>
            <a href="#benefits" className="text-gray-600 hover:text-utopia-500 transition-colors font-medium">
              Výhody
            </a>
            <a href="#segments" className="text-gray-600 hover:text-utopia-500 transition-colors font-medium">
              Riešenia
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button onClick={handleAuthClick} variant="ghost" className="text-gray-600 hover:text-utopia-500 font-medium">
              Prihlásiť sa
            </Button>
            <Button onClick={handleOnboardingClick} className="bg-blue-gradient text-white px-6 py-2 rounded-xl font-medium hover:shadow-lg transition-all duration-300">
              Začať
            </Button>
          </div>
        </div>
      </div>
    </nav>;
};
export default LandingNavigation;