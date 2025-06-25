
import ColorsSection from './sections/ColorsSection';
import TypographySection from './sections/TypographySection';
import ButtonsSection from './sections/ButtonsSection';
import InputsSection from './sections/InputsSection';
import OnboardingComponentsSection from './sections/OnboardingComponentsSection';
import AdminComponentsSection from './sections/AdminComponentsSection';
import GuidelinesSection from './sections/GuidelinesSection';
import ProjectDocsSection from './sections/ProjectDocsSection';
import FoundationsOverview from './sections/FoundationsOverview';

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
      
      // UI Components
      case 'buttons':
        return <ButtonsSection />;
      case 'inputs':
        return <InputsSection />;
      
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
