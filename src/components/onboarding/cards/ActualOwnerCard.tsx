
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, User, Calendar, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ActualOwner } from "@/types/onboarding";

interface ActualOwnerCardProps {
  owner: ActualOwner;
  onEdit: () => void;
  onDelete: () => void;
}

const ActualOwnerCard = ({ owner, onEdit, onDelete }: ActualOwnerCardProps) => {
  const { t } = useTranslation(['forms']);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4 text-gray-500" />
              <h3 className="font-medium text-lg">
                {owner.firstName} {owner.lastName}
              </h3>
              {owner.createdFromContact && (
                <Badge variant="secondary" className="text-xs">
                  {t('forms:actualOwners.fromContact')}
                </Badge>
              )}
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              {owner.birthDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span>{t('forms:actualOwners.bornLabel', { date: owner.birthDate })}</span>
                </div>
              )}
              {owner.birthPlace && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>{owner.birthPlace}</span>
                </div>
              )}
              {owner.citizenship && (
                <div className="text-sm text-gray-500">
                  {owner.citizenship}
                </div>
              )}
              {owner.isPoliticallyExposed && (
                <Badge variant="destructive" className="text-xs">
                  Politicky exponovaná osoba
                </Badge>
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

export default ActualOwnerCard;
