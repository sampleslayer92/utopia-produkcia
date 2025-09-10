import { useTranslation } from 'react-i18next';
import AdminLayout from "@/components/admin/AdminLayout";

const OnboardingUserflowPage = () => {
  const { t } = useTranslation();

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

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="mermaid-diagram">
              <pre className="mermaid bg-white p-4 rounded-lg shadow-sm">
{`graph TD
    A["🏠 Start - Úvodná stránka"] --> B{"Typ užívateľa"}
    
    B -->|"Admin"| C["📋 Admin Dashboard"]
    B -->|"Partner"| D["🤝 Partner Dashboard"] 
    B -->|"Nový contract"| E["📝 Vytvorenie nového contractu"]
    
    C --> F["➕ Nový onboarding"]
    D --> F
    E --> G["📊 Krok 1: Základné informácie"]
    
    F --> G
    
    G --> H{"Validácia údajov"}
    H -->|"❌ Chyba"| G
    H -->|"✅ OK"| I["👥 Krok 2: Osoby a vlastníci"]
    
    I --> J{"Pridať osobu"}
    J -->|"➕ Áno"| K["📝 Formulár osoby"]
    K --> L{"Typ osoby"}
    L -->|"👤 Kontaktná osoba"| M["✅ Nastavenie roly: Kontakt"]
    L -->|"📋 Oprávnená osoba"| N["✅ Nastavenie roly: Oprávnená"]
    L -->|"👑 Skutočný vlastník"| O["✅ Nastavenie roly: Vlastník"]
    
    M --> P["💾 Uloženie osoby"]
    N --> P
    O --> P
    
    P --> Q{"Pridať ďalšiu osobu?"}
    Q -->|"✅ Áno"| J
    Q -->|"❌ Nie"| R{"Validácia rolí"}
    
    R -->|"❌ Chýbajú povinné roly"| I
    R -->|"✅ Všetky roly OK"| S["🏢 Krok 3: Obchodné miesto"]
    
    J -->|"❌ Nie"| R
    
    S --> T{"Validácia adresy"}
    T -->|"❌ Chyba"| S
    T -->|"✅ OK"| U["📄 Krok 4: Dokumenty"]
    
    U --> V{"Nahrať dokumenty"}
    V -->|"📤 Nahrať"| W["☁️ Upload do Supabase Storage"]
    W --> X{"Upload úspešný?"}
    X -->|"❌ Chyba"| V
    X -->|"✅ OK"| Y["📝 Krok 5: Podpis"]
    
    V -->|"⏭️ Preskočiť"| Y
    
    Y --> Z{"Spôsob podpisu"}
    Z -->|"✍️ Digitálny podpis"| AA["🖊️ Canvas podpis"]
    Z -->|"📤 Upload podpisu"| BB["📁 Nahratie súboru"]
    
    AA --> CC["💾 Uloženie podpisu"]
    BB --> CC
    
    CC --> DD{"Podpis uložený?"}
    DD -->|"❌ Chyba"| Y
    DD -->|"✅ OK"| EE["🎯 Krok 6: Progresívna selekcia"]
    
    EE --> FF{"Výber modulov"}
    FF --> GG["☑️ Označenie vybraných modulov"]
    GG --> HH{"Výber systému"}
    HH --> II["🖥️ Označenie vybraného systému"]
    II --> JJ["📋 Krok 7: Zhrnutie"]
    
    JJ --> KK{"Kontrola údajov"}
    KK -->|"❌ Chyba"| LL{"Ktorý krok opraviť?"}
    LL --> G
    LL --> I  
    LL --> S
    LL --> U
    LL --> Y
    LL --> EE
    
    KK -->|"✅ Všetko OK"| MM["✅ Dokončenie onboardingu"]
    
    MM --> NN["📧 Odoslanie notifikácie"]
    NN --> OO["📊 Aktualizácia štatistík"]
    OO --> PP["🎉 Úspešné dokončenie"]
    
    PP --> QQ{"Ďalšie akcie"}
    QQ -->|"🔗 Zdieľať link"| RR["📋 Kopírovanie linku"]
    QQ -->|"🗑️ Zmazať draft"| SS["❌ Vymazanie draftu"]
    QQ -->|"📋 Správa contractov"| TT["📊 Prechod na zoznam"]
    
    RR --> PP
    SS --> C
    TT --> UU["📋 Zoznam contractov"]

    style A fill:#e1f5fe
    style PP fill:#c8e6c9
    style G fill:#fff3e0
    style I fill:#fff3e0  
    style S fill:#fff3e0
    style U fill:#fff3e0
    style Y fill:#fff3e0
    style EE fill:#fff3e0
    style JJ fill:#fff3e0
    style MM fill:#a5d6a7`}
              </pre>
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