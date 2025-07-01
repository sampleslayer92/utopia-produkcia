
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ForWhomSection from "@/components/landing/ForWhomSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import LiveDemoSection from "@/components/landing/LiveDemoSection";
import PartnerSection from "@/components/landing/PartnerSection";
import FAQSection from "@/components/landing/FAQSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { useEffect } from "react";

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden font-sans">
      {/* Parallax background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-primary/3 rounded-full blur-3xl"
          animate={{
            y: [0, 20, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <HeroSection onGetStarted={() => navigate('/onboarding')} />
        <HowItWorksSection />
        <ForWhomSection />
        <BenefitsSection />
        <LiveDemoSection />
        <PartnerSection />
        <FAQSection />
        <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage;
