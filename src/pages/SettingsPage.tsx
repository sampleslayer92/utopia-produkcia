import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ApplicationSettingsTab from '@/components/admin/settings/ApplicationSettingsTab';
import ProfileSettingsTab from '@/components/admin/settings/ProfileSettingsTab';
import { useTranslation } from 'react-i18next';
import { Settings, Cog, User } from 'lucide-react';

const SettingsPage = () => {
  const { t } = useTranslation('admin');
  const { tab } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(tab || 'application');

  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab, activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/settings/${value}`);
  };

  return (
    <AdminLayout 
      title={t('navigation.settings')} 
      subtitle={t('settings.description')}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="application" className="flex items-center gap-2">
              <Cog className="h-4 w-4" />
              <span className="hidden sm:inline">{t('navigation.applicationSettings')}</span>
              <span className="sm:hidden">App</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t('navigation.profileSettings')}</span>
              <span className="sm:hidden">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="application" className="space-y-6">
            <ApplicationSettingsTab />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage;