import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, User } from "lucide-react";
import { PersonWithRoles, PersonRoleType, PERSON_ROLE_LABELS } from "@/types/person";
import { useTranslation } from "react-i18next";

interface PersonCardProps {
  person: PersonWithRoles;
  onEdit: (person: PersonWithRoles) => void;
  onDelete: (personId: string) => void;
  onRoleChange: (personId: string, roles: PersonRoleType[]) => void;
  availableRoles: PersonRoleType[];
  readOnly?: boolean;
}

export const PersonCard = ({ 
  person, 
  onEdit, 
  onDelete, 
  onRoleChange, 
  availableRoles,
  readOnly = false 
}: PersonCardProps) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language as 'sk' | 'en';

  const handleRoleToggle = (roleType: PersonRoleType, checked: boolean) => {
    if (readOnly) return;
    
    const newRoles = checked 
      ? [...person.roles, roleType]
      : person.roles.filter(role => role !== roleType);
    
    onRoleChange(person.id, newRoles);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {person.first_name} {person.last_name}
            </h3>
            {person.email && (
              <p className="text-sm text-muted-foreground">{person.email}</p>
            )}
            {person.phone && (
              <p className="text-sm text-muted-foreground">{person.phone}</p>
            )}
          </div>
        </div>
        
        {!readOnly && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(person)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {!person.is_predefined && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(person.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-medium">Role:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableRoles.map(roleType => {
            const isChecked = person.roles.includes(roleType);
            const label = PERSON_ROLE_LABELS[roleType][currentLang];
            
            return (
              <div key={roleType} className="flex items-center space-x-2">
                <Checkbox
                  id={`${person.id}-${roleType}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => handleRoleToggle(roleType, !!checked)}
                  disabled={readOnly}
                />
                <label 
                  htmlFor={`${person.id}-${roleType}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            );
          })}
        </div>
        
        {person.roles.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {person.roles.map(role => (
              <Badge key={role} variant="secondary" className="text-xs">
                {PERSON_ROLE_LABELS[role][currentLang]}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {person.permanent_address && (
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            <strong>Adresa:</strong> {person.permanent_address}
          </p>
        </div>
      )}
    </Card>
  );
};