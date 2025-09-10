import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";
import { ArrowDown, ArrowRight } from 'lucide-react';

const OnboardingUserflowPage = () => {
  const { t } = useTranslation();

  const FlowStep = ({ icon, title, description, variant = 'default' }: { 
    icon: string; 
    title: string; 
    description?: string;
    variant?: 'default' | 'decision' | 'success' | 'error';
  }) => {
    const getVariantStyle = () => {
      switch (variant) {
        case 'decision': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
        case 'success': return 'bg-green-50 border-green-200 text-green-800';
        case 'error': return 'bg-red-50 border-red-200 text-red-800';
        default: return 'bg-blue-50 border-blue-200 text-blue-800';
      }
    };

    return (
      <div className={`rounded-lg p-4 border-2 text-center min-w-[200px] ${getVariantStyle()}`}>
        <div className="text-2xl mb-2">{icon}</div>
        <div className="font-semibold text-sm">{title}</div>
        {description && <div className="text-xs mt-1 opacity-80">{description}</div>}
      </div>
    );
  };

  return (
    <AdminLayout 
      title="Userflow Onboardingu"
      subtitle="Kompletný diagram procesu onboardingu"
    >
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Diagram Userflow Onboardingu</h2>
            <p className="text-slate-600">
              Tento diagram zobrazuje kompletný proces onboardingu od začiatku po koniec, 
              vrátane všetkých krokov, rozhodnutí a možných ciest užívateľa.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 overflow-x-auto">
            {/* Start */}
            <div className="flex flex-col items-center space-y-4">
              <FlowStep icon="🏠" title="Štart" description="Úvodná stránka" />
              <ArrowDown className="text-blue-500" />
              
              {/* User Type Decision */}
              <FlowStep icon="👤" title="Typ užívateľa" variant="decision" />
              <div className="flex items-center space-x-8">
                <div className="flex flex-col items-center space-y-2">
                  <ArrowDown className="text-blue-500" />
                  <FlowStep icon="👨‍💼" title="Admin" />
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <ArrowDown className="text-blue-500" />
                  <FlowStep icon="🤝" title="Partner" />
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <ArrowDown className="text-blue-500" />
                  <FlowStep icon="📝" title="Nový contract" />
                </div>
              </div>
              
              {/* Merge to Onboarding */}
              <ArrowDown className="text-blue-500" />
              <FlowStep icon="➕" title="Nový onboarding" />
              <ArrowDown className="text-blue-500" />
              
              {/* Step 1 */}
              <FlowStep icon="📊" title="Krok 1" description="Základné informácie" />
              <ArrowDown className="text-blue-500" />
              <FlowStep icon="✅" title="Validácia údajov" variant="decision" />
              <ArrowDown className="text-blue-500" />
              
              {/* Step 2 */}
              <FlowStep icon="👥" title="Krok 2" description="Osoby a vlastníci" />
              <ArrowDown className="text-blue-500" />
              
              {/* Person Management Loop */}
              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-purple-300">
                <h4 className="font-semibold text-purple-800 mb-4 text-center">Správa osôb</h4>
                <div className="flex flex-col items-center space-y-2">
                  <FlowStep icon="➕" title="Pridať osobu" variant="decision" />
                  <ArrowDown className="text-purple-500" />
                  <FlowStep icon="📝" title="Formulár osoby" />
                  <ArrowDown className="text-purple-500" />
                  <div className="flex items-center space-x-4">
                    <FlowStep icon="👤" title="Kontakt" />
                    <FlowStep icon="📋" title="Oprávnená" />
                    <FlowStep icon="👑" title="Vlastník" />
                  </div>
                  <ArrowDown className="text-purple-500" />
                  <FlowStep icon="💾" title="Uloženie" />
                </div>
              </div>
              
              <ArrowDown className="text-blue-500" />
              <FlowStep icon="🔍" title="Validácia rolí" variant="decision" />
              <ArrowDown className="text-blue-500" />
              
              {/* Step 3 */}
              <FlowStep icon="🏢" title="Krok 3" description="Obchodné miesto" />
              <ArrowDown className="text-blue-500" />
              
              {/* Step 4 */}
              <FlowStep icon="📄" title="Krok 4" description="Dokumenty" />
              <ArrowDown className="text-blue-500" />
              <FlowStep icon="📤" title="Upload dokumentov" variant="decision" />
              <ArrowDown className="text-blue-500" />
              
              {/* Step 5 */}
              <FlowStep icon="📝" title="Krok 5" description="Podpis" />
              <ArrowDown className="text-blue-500" />
              <div className="flex items-center space-x-8">
                <FlowStep icon="🖊️" title="Canvas podpis" />
                <FlowStep icon="📁" title="Upload súboru" />
              </div>
              <ArrowDown className="text-blue-500" />
              
              {/* Step 6 */}
              <FlowStep icon="🎯" title="Krok 6" description="Progresívna selekcia" />
              <ArrowDown className="text-blue-500" />
              
              {/* Step 7 */}
              <FlowStep icon="📋" title="Krok 7" description="Zhrnutie" />
              <ArrowDown className="text-blue-500" />
              <FlowStep icon="✅" title="Kontrola údajov" variant="decision" />
              <ArrowDown className="text-blue-500" />
              
              {/* Final Steps */}
              <FlowStep icon="🎉" title="Dokončenie" variant="success" />
              <ArrowDown className="text-green-500" />
              <FlowStep icon="📧" title="Notifikácia" variant="success" />
              <ArrowDown className="text-green-500" />
              <FlowStep icon="📊" title="Štatistiky" variant="success" />
              
              {/* Final Actions */}
              <ArrowDown className="text-blue-500" />
              <div className="flex items-center space-x-8">
                <FlowStep icon="🔗" title="Zdieľať link" />
                <FlowStep icon="🗑️" title="Zmazať draft" />
                <FlowStep icon="📋" title="Správa contractov" />
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">🎯 Hlavné kroky</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>1. Základné informácie</li>
                <li>2. Osoby a vlastníci</li>
                <li>3. Obchodné miesto</li>
                <li>4. Dokumenty</li>
                <li>5. Podpis</li>
                <li>6. Progresívna selekcia</li>
                <li>7. Zhrnutie</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">✅ Validačné body</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Validácia základných údajov</li>
                <li>• Kontrola povinných rolí osôb</li>
                <li>• Validácia adresy</li>
                <li>• Kontrola nahraných dokumentov</li>
                <li>• Overenie podpisu</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">🔄 Možné akcie</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Pridanie/upravenie osôb</li>
                <li>• Nahratie dokumentov</li>
                <li>• Digitálny podpis</li>
                <li>• Zdieľanie linku</li>
                <li>• Vymazanie draftu</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h3 className="font-semibold text-amber-800 mb-2">⚠️ Dôležité poznámky</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Každý krok má svoju vlastnú validáciu</li>
              <li>• Užívateľ sa môže vrátiť na predchádzajúce kroky na opravu</li>
              <li>• Systém ukladá progress priebežne</li>
              <li>• Povinné sú minimálne: 1 kontaktná osoba, 1 oprávnená osoba, 1 vlastník</li>
              <li>• Dokumenty a podpis nie sú povinné, ale odporúčané</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OnboardingUserflowPage;