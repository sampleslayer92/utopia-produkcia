import { OnboardingData } from "@/types/onboarding";
import { PersonsOwnersFieldRenderer } from "./PersonsOwnersStep/PersonsOwnersFieldRenderer";

interface PersonsOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PersonsOwnersStep = ({ data, updateData }: PersonsOwnersStepProps) => {
  return (
    <PersonsOwnersFieldRenderer
      data={data}
      updateData={updateData}
      // All other props are handled by the field renderer now
      isAddingPerson={false}
      editingPersonId={null}
      onAddPerson={() => {}}
      onSavePerson={() => {}}
      onEditPerson={() => {}}
      onDeletePerson={() => {}}
      isAddingOwner={false}
      editingOwnerId={null}
      onAddOwner={() => {}}
      onSaveOwner={() => {}}
      onEditOwner={() => {}}
      onDeleteOwner={() => {}}
      contactName=""
      canAutoFill={false}
      onAutoFill={() => {}}
    />
  );
};

export default PersonsOwnersStep;