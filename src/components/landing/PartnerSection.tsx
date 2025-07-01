
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PartnerSection = () => {
  const navigate = useNavigate();

  const handlePartnerClick = () => {
    navigate('/auth');
  };

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-utopia-50 via-blue-50 to-light-gray-50 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-utopia-100/20 to-blue-100/20"></div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="animate-fade-in-up">
          <blockquote className="text-4xl md:text-5xl font-light text-gray-900 mb-4">
            „Pomáhame partnerom rásť.
          </blockquote>
          <p className="text-3xl md:text-4xl text-gray-700 mb-12 font-light">
            Máš klientov? My máme technológiu."
          </p>
          
          <Button
            onClick={handlePartnerClick}
            size="lg"
            className="bg-blue-gradient text-white px-12 py-6 text-xl font-medium rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <span className="relative z-10">Chcem byť partner</span>
          </Button>
          
          <p className="text-gray-600 mt-8 text-lg">
            Získaš prístup do nášho portálu a provízny program.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
