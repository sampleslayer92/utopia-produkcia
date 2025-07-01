
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const PartnerSection = () => {
  const navigate = useNavigate();

  const handlePartnerClick = () => {
    navigate('/auth');
  };

  return (
    <section className="py-32 px-6 bg-gradient-to-br from-utopia-500/20 via-neon-purple/10 to-dark relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-mesh animate-gradient-shift opacity-30"></div>
      
      <div className="max-w-5xl mx-auto text-center relative z-10">
        <div className="animate-fade-in-up">
          <blockquote className="text-3xl md:text-4xl font-light text-white mb-4">
            „Pomáhame partnerom rásť.
          </blockquote>
          <p className="text-2xl md:text-3xl text-white/80 mb-12 font-light">
            Máš klientov? My máme technológiu."
          </p>
          
          <Button
            onClick={handlePartnerClick}
            size="lg"
            className="group relative bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-12 py-6 text-xl font-medium rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(0,212,255,0.5)]"
          >
            <span className="relative z-10">Chcem byť partner</span>
            <div className="absolute inset-0 bg-gradient-to-r from-utopia-500/20 to-neon-blue/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Button>
          
          <p className="text-white/60 mt-8 text-lg font-light">
            Získaš prístup do nášho portálu a provízny program.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PartnerSection;
