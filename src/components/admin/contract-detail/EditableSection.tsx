
import { ReactNode } from "react";

interface EditableSectionProps {
  children: ReactNode;
  isEditMode: boolean;
  className?: string;
  onSave?: () => void;
  label?: string;
}

const EditableSection = ({ 
  children, 
  isEditMode, 
  className = "",
  onSave,
  label 
}: EditableSectionProps) => {
  return (
    <div className={`relative ${isEditMode ? 'border-2 border-dashed border-blue-300 rounded-lg p-2 bg-blue-50/30' : ''} ${className}`}>
      {isEditMode && label && (
        <div className="absolute -top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          {label} - Editovateľné
        </div>
      )}
      {children}
      {isEditMode && onSave && (
        <div className="mt-2 flex justify-end">
          <button
            onClick={onSave}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
          >
            Uložiť sekciu
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableSection;
