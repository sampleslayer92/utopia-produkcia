import CompanyInfoStep from '../../CompanyInfoStep';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const CompanyInfoWrapper = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  return (
    <CompanyInfoStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default CompanyInfoWrapper;