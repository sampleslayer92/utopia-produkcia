
import { ReactNode } from "react";

interface EditableSectionProps {
  children: ReactNode;
  isEditMode: boolean;
  className?: string;
}

const EditableSection = ({ children, isEditMode, className = "" }: EditableSectionProps) => {
  return (
    <div className={`${isEditMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-2' : ''} ${className}`}>
      {children}
    </div>
  );
};

export default EditableSection;
