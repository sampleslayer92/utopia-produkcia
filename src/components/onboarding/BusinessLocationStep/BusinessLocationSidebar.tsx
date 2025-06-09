
import { useTranslation } from "react-i18next";
import { Store, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BusinessLocationSidebarProps {
  hasBusinessContactRole: boolean;
  userRole?: string;
  onAddLocation: () => void;
}

const BusinessLocationSidebar = ({ 
  hasBusinessContactRole, 
  userRole,
  onAddLocation 
}: BusinessLocationSidebarProps) => {
  const { t } = useTranslation();

  // Get features as array or fallback to empty array
  const features = t('steps.businessLocation.features', { returnObjects: true }) as string[] || [];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-6 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Store className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="font-medium text-blue-900">{t('steps.businessLocation.sidebar.title')}</h3>
        </div>
        
        <p className="text-sm text-blue-800">
          {t('steps.businessLocation.sidebar.description')}
        </p>
        
        <div className="bg-blue-100/50 border border-blue-200 rounded-lg p-4 text-xs text-blue-800">
          <p className="font-medium mb-2">{t('steps.businessLocation.sidebar.newFeatures')}</p>
          <ul className="space-y-2 list-disc list-inside">
            {Array.isArray(features) && features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>

        {hasBusinessContactRole && (
          <div className="bg-green-100/50 border border-green-200 rounded-lg p-4 text-xs text-green-800">
            <p className="font-medium mb-2">{t('steps.businessLocation.sidebar.autoFillTitle')}</p>
            <p>{t('steps.businessLocation.sidebar.autoFillDescription', { userRole })}</p>
          </div>
        )}
        
        <div className="mt-4">
          <Button
            onClick={onAddLocation}
            variant="outline"
            className="w-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 text-blue-700 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('steps.businessLocation.addLocation')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessLocationSidebar;
