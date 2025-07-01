
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ForWhomSection from "@/components/landing/ForWhomSection";
import BenefitsSection from "@/components/landing/BenefitsSection";
import LiveDemoSection from "@/components/landing/LiveDemoSection";
import PartnerSection from "@/components/landing/PartnerSection";
import FAQSection from "@/components/landing/FAQSection";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingNavigation from "@/components/landing/LandingNavigation";

const LandingPage = () => {
  return (
    <div className="font-inter bg-white min-h-screen">
      <LandingNavigation />
      <HeroSection />
      <HowItWorksSection />
      <ForWhomSection />
      <BenefitsSection />
      <LiveDemoSection />
      <PartnerSection />
      <FAQSection />
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
