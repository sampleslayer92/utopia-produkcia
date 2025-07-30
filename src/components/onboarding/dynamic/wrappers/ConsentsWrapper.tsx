import ConsentsStep from '../../ConsentsStep';
import { StepComponentProps } from '../StepComponentRegistry';

const ConsentsWrapper = ({ data, updateData, onNext, onPrev, onComplete, onSaveSignature }: StepComponentProps) => {
  return (
    <ConsentsStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
      onComplete={onComplete}
      onSaveSignature={onSaveSignature}
    />
  );
};

export default ConsentsWrapper;