import FeesStep from '../../FeesStep';
import { StepComponentProps } from '../StepComponentRegistry';

const FeesWrapper = ({ data, updateData, onNext, onPrev }: StepComponentProps) => {
  return (
    <FeesStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default FeesWrapper;