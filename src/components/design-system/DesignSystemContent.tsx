
import ColorsSection from './sections/ColorsSection';
import TypographySection from './sections/TypographySection';
import ButtonsSection from './sections/ButtonsSection';
import InputsSection from './sections/InputsSection';
import OnboardingComponentsSection from './sections/OnboardingComponentsSection';
import AdminComponentsSection from './sections/AdminComponentsSection';
import GuidelinesSection from './sections/GuidelinesSection';
import ProjectDocsSection from './sections/ProjectDocsSection';
import FoundationsOverview from './sections/FoundationsOverview';
import SpacingSection from './sections/SpacingSection';
import ShadowsSection from './sections/ShadowsSection';
import AnimationsSection from './sections/AnimationsSection';
import CardsSection from './sections/CardsSection';
import ModalsSection from './sections/ModalsSection';
import NavigationSection from './sections/NavigationSection';

interface DesignSystemContentProps {
  selectedSection: string;
  searchTerm: string;
}

const DesignSystemContent = ({ selectedSection, searchTerm }: DesignSystemContentProps) => {
  const renderSection = () => {
    switch (selectedSection) {
      // Foundations
      case 'foundations':
        return <FoundationsOverview />;
      case 'colors':
        return <ColorsSection />;
      case 'typography':
        return <TypographySection />;
      case 'spacing':
        return <SpacingSection />;
      case 'shadows':
        return <ShadowsSection />;
      case 'animations':
        return <AnimationsSection />;
      
      // UI Components
      case 'buttons':
        return <ButtonsSection />;
      case 'inputs':
        return <InputsSection />;
      case 'cards':
        return <CardsSection />;
      case 'modals':
        return <ModalsSection />;
      case 'navigation':
        return <NavigationSection />;
      
      // Onboarding Components
      case 'onboarding-inputs':
      case 'step-components':
      case 'product-cards':
        return <OnboardingComponentsSection section={selectedSection} />;
      
      // Admin Components
      case 'admin-layout':
      case 'admin-tables':
        return <AdminComponentsSection section={selectedSection} />;
      
      // Guidelines
      case 'file-structure':
      case 'naming-conventions':
      case 'best-practices':
      case 'accessibility':
        return <GuidelinesSection section={selectedSection} />;
      
      // Project Documentation
      case 'onboarding-flow':
      case 'database-schema':
      case 'api-endpoints':
      case 'i18n-setup':
        return <ProjectDocsSection section={selectedSection} />;
      
      default:
        return <FoundationsOverview />;
    }
  };

  return (
    <div className="p-8">
      {renderSection()}
    </div>
  );
};

export default DesignSystemContent;
