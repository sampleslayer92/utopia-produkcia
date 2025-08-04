import AuthorizedPersonsStep from '../../AuthorizedPersonsStep';
import { ModuleComponentProps } from '../ModuleComponentRegistry';

const AuthorizedPersonsWrapper = ({ 
  data, 
  updateData, 
  onNext, 
  onPrev, 
  configuration = {},
  isReadOnly = false 
}: ModuleComponentProps) => {
  return (
    <AuthorizedPersonsStep
      data={data}
      updateData={updateData}
      onNext={onNext}
      onPrev={onPrev}
    />
  );
};

export default AuthorizedPersonsWrapper;