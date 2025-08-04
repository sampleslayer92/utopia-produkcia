import ContactInfoStep from '../../ContactInfoStep';
import { StepComponentProps } from '../StepComponentRegistry';

const ContactInfoWrapper = ({ data, updateData, onNext, onPrev, stepConfig }: StepComponentProps) => {
  return (
    <ContactInfoStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
      customFields={stepConfig?.fields}
    />
  );
};

export default ContactInfoWrapper;