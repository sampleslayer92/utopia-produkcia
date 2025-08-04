import BusinessLocationStep from '../../BusinessLocationStep';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const BusinessLocationWrapper = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  return (
    <BusinessLocationStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default BusinessLocationWrapper;