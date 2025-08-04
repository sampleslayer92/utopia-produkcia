import BusinessLocationStep from '../../BusinessLocationStep';
import { StepComponentProps } from '../StepComponentRegistry';

const BusinessLocationsWrapper = ({ data, updateData, onNext, onPrev, stepConfig }: StepComponentProps) => {
  return (
    <BusinessLocationStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
      customFields={stepConfig?.fields}
    />
  );
};

export default BusinessLocationsWrapper;