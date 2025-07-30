import CompanyInfoStep from '../../CompanyInfoStep';
import { StepComponentProps } from '../StepComponentRegistry';

const CompanyInfoWrapper = ({ data, updateData, onNext, onPrev }: StepComponentProps) => {
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