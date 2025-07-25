import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Languages, Search, Globe, Plus, FileText, Users, Settings, Bell, ShieldCheck, Layout, HelpCircle } from 'lucide-react';
import { useTranslations, useTranslationNamespaces, useTranslationLanguages } from '@/hooks/useTranslations';
import { AdvancedTranslationEditor } from '@/components/admin/translations/AdvancedTranslationEditor';
import { Separator } from '@/components/ui/separator';
import AdminLayout from '@/components/admin/AdminLayout';

const namespaceIcons = {
  common: FileText,
  admin: ShieldCheck,
  ui: Layout,
  forms: FileText,
  steps: Users,
  notifications: Bell,
  help: HelpCircle,
  auth: ShieldCheck,
  actions: Settings,
  pages: Globe,
};

const namespaceDescriptions = {
  common: 'Základné elementy používané v celej aplikácii',
  admin: 'Texty pre administratívne rozhranie',
  ui: 'Prvky používateľského rozhrania',
  forms: 'Formuláre a validačné správy',
  steps: 'Kroky onboarding procesu',
  notifications: 'Notifikácie a správy',
  help: 'Nápoveda a podporné texty',
  auth: 'Autentifikácia a prihlasovacie texty',
  actions: 'Akcie a tlačidlá',
  pages: 'Stránky a navigácia',
};

export const TranslationsManagementPage = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('sk');
  const [selectedNamespace, setSelectedNamespace] = useState('common');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: translations = [], isLoading: isLoadingTranslations } = useTranslations();
  const { data: namespaces = [], isLoading: isLoadingNamespaces } = useTranslationNamespaces();
  const { data: languages = [], isLoading: isLoadingLanguages } = useTranslationLanguages();

  const filteredTranslations = translations.filter(translation => {
    const matchesSearch = !searchTerm || 
      translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.value.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getTranslationCount = (namespace: string, language: string) => {
    return translations.filter(t => t.namespace === namespace && t.language === language).length;
  };

  const getMissingTranslationsCount = (namespace: string) => {
    const languageCounts = languages.map(lang => 
      getTranslationCount(namespace, lang)
    );
    const maxCount = Math.max(...languageCounts, 0);
    return languages.reduce((total, lang) => {
      const count = getTranslationCount(namespace, lang);
      return total + (maxCount - count);
    }, 0);
  };

  if (isLoadingTranslations || isLoadingNamespaces || isLoadingLanguages) {
    return (
      <AdminLayout title="Správa prekladov" subtitle="Spravujte preklady pre všetky jazyky a kategórie v aplikácii">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title="Správa prekladov" 
      subtitle="Spravujte preklady pre všetky jazyky a kategórie v aplikácii"
    >
      <div className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Jazyky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {languages.map((language) => (
                <Badge key={language} variant="outline">
                  {language.toUpperCase()}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Namespaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{namespaces.length}</div>
            <p className="text-muted-foreground text-sm">kategórií prekladov</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              Celkovo prekladov
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{translations.length}</div>
            <p className="text-muted-foreground text-sm">v databáze</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Správa prekladov</CardTitle>
              <CardDescription>
                Upravujte preklady pre jednotlivé jazyky a kategórie
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Vyhľadať v prekladoch..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <TabsList className="grid w-full grid-cols-2">
              {languages.map((language) => (
                <TabsTrigger key={language} value={language}>
                  {language.toUpperCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {languages.map((language) => (
              <TabsContent key={language} value={language} className="space-y-4">
                <div className="flex gap-4">
                  <Select value={selectedNamespace} onValueChange={setSelectedNamespace}>
                    <SelectTrigger className="w-64">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {namespaces.map((namespace) => {
                        const Icon = namespaceIcons[namespace as keyof typeof namespaceIcons] || FileText;
                        const missingCount = getMissingTranslationsCount(namespace);
                        
                        return (
                          <SelectItem key={namespace} value={namespace}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              <span>{namespace}</span>
                              {missingCount > 0 && (
                                <Badge variant="destructive" className="ml-2">
                                  {missingCount} chýba
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    {(() => {
                      const Icon = namespaceIcons[selectedNamespace as keyof typeof namespaceIcons] || FileText;
                      return <Icon className="h-5 w-5" />;
                    })()}
                    <h3 className="font-medium">{selectedNamespace}</h3>
                    <Badge variant="outline">
                      {getTranslationCount(selectedNamespace, language)} prekladov
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {namespaceDescriptions[selectedNamespace as keyof typeof namespaceDescriptions] || 'Preklady pre túto kategóriu'}
                  </p>
                </div>

                <Separator />

                <AdvancedTranslationEditor
                  translations={filteredTranslations}
                  language={language}
                  namespace={selectedNamespace}
                  namespaces={namespaces}
                  languages={languages}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </AdminLayout>
  );
};