
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { OnboardingData } from "@/types/onboarding";

interface ActualOwnersSidebarProps {
  data: OnboardingData;
  onAddOwner: () => void;
}

const ActualOwnersSidebar = ({ data }: ActualOwnersSidebarProps) => {
  const { t } = useTranslation(['steps', 'forms']);

  const hasOwners = data.actualOwners.length > 0;
  const contactName = `${data.contactInfo.firstName} ${data.contactInfo.lastName}`.trim();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">{t('steps:actualOwners.title')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            {t('steps:actualOwners.description')}
          </p>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{t('steps:actualOwners.sidebar.status')}</span>
              {hasOwners ? (
                <Badge variant="default" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  {data.actualOwners.length} {t('steps:actualOwners.sidebar.completed')}
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {t('steps:actualOwners.sidebar.notSet')}
                </Badge>
              )}
            </div>
          </div>

          {contactName && (
            <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <h4 className="text-sm font-medium text-indigo-800 mb-1">
                {t('steps:actualOwners.sidebar.autoFillTip')}
              </h4>
              <p className="text-xs text-indigo-700">
                {t('steps:actualOwners.sidebar.autoFillDescription', { name: contactName })}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm">{t('steps:actualOwners.sidebar.whoIsOwner')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-gray-600 space-y-2">
            {(t('steps:actualOwners.sidebar.ownerCriteria', { returnObjects: true }) as string[]).map((criterion: string, index: number) => (
              <li key={index}>• {criterion}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActualOwnersSidebar;
