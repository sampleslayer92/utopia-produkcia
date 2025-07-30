import DeviceSelectionStep from '../../DeviceSelectionStep';
import { StepComponentProps } from '../StepComponentRegistry';

const DeviceSelectionWrapper = ({ data, updateData, onNext, onPrev }: StepComponentProps) => {
  return (
    <DeviceSelectionStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default DeviceSelectionWrapper;