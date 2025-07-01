
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PartnerSection = () => {
  const navigate = useNavigate();

  const handlePartnerClick = () => {
    navigate('/auth');
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-utopia-500 to-utopia-600">
      <div className="max-w-4xl mx-auto text-center">
        <div className="animate-fade-in-up">
          <blockquote className="text-2xl md:text-3xl font-semibold text-white mb-2">
            „Pomáhame partnerom rásť.
          </blockquote>
          <p className="text-xl md:text-2xl text-utopia-100 mb-8">
            Máš klientov? My máme technológiu."
          </p>
          
          <Button
            onClick={handlePartnerClick}
            size="lg"
            className="bg-white text-utopia-600 hover:bg-utopia-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Chcem byť partner
          </Button>
          
          <p className="text-utopia-100 mt-6 text-sm">
            Získaš prístup do nášho portálu a provízny program.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
