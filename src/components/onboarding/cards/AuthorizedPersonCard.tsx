
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Mail, Phone, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AuthorizedPerson } from "@/types/onboarding";

interface AuthorizedPersonCardProps {
  person: AuthorizedPerson;
  onEdit: () => void;
  onDelete: () => void;
}

const AuthorizedPersonCard = ({ person, onEdit, onDelete }: AuthorizedPersonCardProps) => {
  const { t } = useTranslation(['forms']);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-lg">
                {person.firstName} {person.lastName}
              </h3>
              {person.createdFromContact && (
                <Badge variant="secondary" className="text-xs">
                  {t('forms:authorizedPersons.fromContact')}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              {person.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3" />
                  <span>{person.email}</span>
                </div>
              )}
              {person.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>{person.phone}</span>
                </div>
              )}
              {person.position && (
                <div className="text-sm text-gray-500">
                  {person.position}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button variant="outline" size="sm" onClick={onDelete}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonCard;
