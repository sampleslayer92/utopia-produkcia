import AuthorizedPersonsStep from '../../AuthorizedPersonsStep';
import ActualOwnersStep from '../../ActualOwnersStep';
import { StepComponentProps } from '../StepComponentRegistry';

const PersonsAndOwnersWrapper = ({ data, updateData, onNext, onPrev, stepConfig }: StepComponentProps) => {
  // Render both authorized persons and actual owners in one step
  // or just one based on step configuration
  if (stepConfig.stepKey === 'authorized_persons') {
    return (
      <AuthorizedPersonsStep
        data={data}
        updateData={updateData}
        onNext={onNext}
        onPrev={onPrev}
      />
    );
  }

  if (stepConfig.stepKey === 'actual_owners') {
    return (
      <ActualOwnersStep
        data={data}
        updateData={updateData}
        onNext={onNext}
        onPrev={onPrev}
      />
    );
  }

  // Combined view for 'persons_and_owners'
  return (
    <div className="space-y-8">
      <AuthorizedPersonsStep
        data={data}
        updateData={updateData}
        onNext={() => {}}
        onPrev={onPrev}
      />
      <ActualOwnersStep
        data={data}
        updateData={updateData}
        onNext={onNext}
        onPrev={() => {}}
      />
    </div>
  );
};

export default PersonsAndOwnersWrapper;