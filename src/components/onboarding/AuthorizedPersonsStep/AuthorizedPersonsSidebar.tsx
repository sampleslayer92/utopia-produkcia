
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, UserCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OnboardingData } from "@/types/onboarding";

interface AuthorizedPersonsSidebarProps {
  data: OnboardingData;
  onAddPerson: () => void;
}

const AuthorizedPersonsSidebar = ({ data, onAddPerson }: AuthorizedPersonsSidebarProps) => {
  const { t } = useTranslation(['steps', 'forms']);

  const hasPersons = data.authorizedPersons.length > 0;
  const contactName = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`.trim();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">{t('steps:authorizedPersons.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {t('steps:authorizedPersons.description')}
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Stav:</span>
              {hasPersons ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {data.authorizedPersons.length} osôb
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Nezadané
                </Badge>
              )}
            </div>
          </div>

          {contactName && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                Tip: Automatické vyplnenie
              </h4>
              <p className="text-xs text-blue-700">
                Môžete použiť tlačidlo "Vyplniť z kontaktov" pre automatické pridanie kontaktnej osoby {contactName} ako splnomocnenú osobu.
              </p>
            </div>
          )}

          <Button onClick={onAddPerson} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Pridať osobu
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Dôležité informácie</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-gray-600 space-y-2">
            <li>• Údaje musia byť v súlade s oficiálnymi dokumentmi</li>
            <li>• Pre každú splnomocnenú osobu je potrebný platný doklad totožnosti</li>
            <li>• Musí byť uvedená aspoň jedna splnomocnená osoba</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorizedPersonsSidebar;
