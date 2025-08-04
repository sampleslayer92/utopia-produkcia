import ContactInfoStep from '../../ContactInfoStep';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const ContactInfoWrapper = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  return (
    <ContactInfoStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default ContactInfoWrapper;