
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
              <span className="text-sm font-medium">{t('steps:authorizedPersons.sidebar.status')}</span>
              {hasPersons ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {data.authorizedPersons.length} {t('steps:authorizedPersons.sidebar.completed')}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {t('steps:authorizedPersons.sidebar.notSet')}
                </Badge>
              )}
            </div>
          </div>

          {contactName && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                {t('steps:authorizedPersons.sidebar.autoFillTip')}
              </h4>
              <p className="text-xs text-blue-700">
                {t('steps:authorizedPersons.sidebar.autoFillDescription', { name: contactName })}
              </p>
            </div>
          )}

          <Button onClick={onAddPerson} className="w-full" variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            {t('steps:authorizedPersons.sidebar.addButton')}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">{t('steps:authorizedPersons.sidebar.importantInfo')}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-gray-600 space-y-2">
            {t('steps:authorizedPersons.sidebar.requirements', { returnObjects: true }).map((requirement: string, index: number) => (
              <li key={index}>• {requirement}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthorizedPersonsSidebar;
