import ContactInfoStep from '../../ContactInfoStep';
import { StepComponentProps } from '../StepComponentRegistry';

const ContactInfoWrapper = ({ data, updateData, onNext, onPrev }: StepComponentProps) => {
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