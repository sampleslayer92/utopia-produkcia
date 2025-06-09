
import { useTranslation } from "react-i18next";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthorizedPersonsSidebar = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900">{t('steps.authorizedPersons.sidebar.title')}</h3>
        </div>
        
        <p className="text-sm text-blue-800">
          {t('steps.authorizedPersons.sidebar.description')}
        </p>

        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white/50 hover:bg-white/70 border-blue-300 text-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('steps.authorizedPersons.sidebar.addPerson')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthorizedPersonsSidebar;
