import ActualOwnersStep from '../../ActualOwnersStep';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const ActualOwnersWrapper = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  return (
    <ActualOwnersStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default ActualOwnersWrapper;