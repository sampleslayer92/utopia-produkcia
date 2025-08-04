import CompanyInfoStep from '../../CompanyInfoStep';
import { StepComponentProps } from '../StepComponentRegistry';

const CompanyInfoWrapper = ({ data, updateData, onNext, onPrev, stepConfig }: StepComponentProps) => {
  return (
    <CompanyInfoStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
      customFields={stepConfig?.fields}
    />
  );
};

export default CompanyInfoWrapper;