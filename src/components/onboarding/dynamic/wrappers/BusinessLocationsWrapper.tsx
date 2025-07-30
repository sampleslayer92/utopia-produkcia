import BusinessLocationStep from '../../BusinessLocationStep';
import { StepComponentProps } from '../StepComponentRegistry';

const BusinessLocationsWrapper = ({ data, updateData, onNext, onPrev }: StepComponentProps) => {
  return (
    <BusinessLocationStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default BusinessLocationsWrapper;