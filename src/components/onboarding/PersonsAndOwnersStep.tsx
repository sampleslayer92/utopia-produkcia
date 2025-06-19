
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingData } from "@/types/onboarding";
import { Users, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import AuthorizedPersonsStep from "./AuthorizedPersonsStep";
import ActualOwnersStep from "./ActualOwnersStep";
import InfoBanner from "./ui/InfoBanner";
import InfoModal from "./ui/InfoModal";
import MobileOptimizedCard from "./ui/MobileOptimizedCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface PersonsAndOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const PersonsAndOwnersStep = ({ data, updateData, onNext, onPrev }: PersonsAndOwnersStepProps) => {
  const { t } = useTranslation(['steps', 'forms']);
  const isMobile = useIsMobile();
  const [showInfoModal, setShowInfoModal] = useState(false);

  const keyPoints = [
    "Oprávnené osoby a skutoční majitelia",
    "Auto-vyplnenie z kontaktu",
    "Právne požiadavky AML"
  ];

  const infoModalData = {
    title: "Osoby a majitelia",
    description: "Zadanie oprávnených osôb a skutočných majiteľov spoločnosti podľa právnych požiadaviek.",
    features: [
      "Automatické vyplnenie z kontaktných údajov",
      "Validácia povinných polí",
      "Export do PDF dokumentov",
      "Bezpečné uloženie osobných údajov"
    ],
    tips: [
      "Oprávnené osoby môžu konať v mene spoločnosti",
      "Skutoční majitelia sú osoby s viac ako 25% podielom",
      "Kontaktná osoba sa môže automaticky pridať do oboch kategórií"
    ],
    helpInfo: [
      "Každá spoločnosť musí mať aspoň jednu oprávnenú osobu",
      "Skutočný majiteľ je povinný pre AML compliance",
      "Všetky údaje sú chránené GDPR"
    ]
  };

  if (isMobile) {
    return (
      <MobileOptimizedCard
        title="Osoby a majitelia"
        icon={<Users className="h-4 w-4 text-blue-600" />}
        infoTooltip={infoModalData}
      >
        <Tabs defaultValue="authorized-persons" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="authorized-persons" className="text-xs">
              <UserCheck className="h-3 w-3 mr-1" />
              Oprávnené
            </TabsTrigger>
            <TabsTrigger value="actual-owners" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Majitelia
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="authorized-persons" className="mt-0">
            <AuthorizedPersonsStep 
              data={data} 
              updateData={updateData} 
              onNext={onNext} 
              onPrev={onPrev} 
            />
          </TabsContent>
          
          <TabsContent value="actual-owners" className="mt-0">
            <ActualOwnersStep 
              data={data} 
              updateData={updateData} 
              onNext={onNext} 
              onPrev={onPrev} 
            />
          </TabsContent>
        </Tabs>
      </MobileOptimizedCard>
    );
  }

  return (
    <div className="space-y-6">
      <InfoBanner
        title="Osoby a majitelia"
        keyPoints={keyPoints}
        onShowDetails={() => setShowInfoModal(true)}
      />
      
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm">
        <CardContent className="p-6">
          <Tabs defaultValue="authorized-persons" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="authorized-persons">
                <UserCheck className="h-4 w-4 mr-2" />
                {t('steps:authorizedPersons.title')}
              </TabsTrigger>
              <TabsTrigger value="actual-owners">
                <Users className="h-4 w-4 mr-2" />
                {t('steps:actualOwners.title')}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="authorized-persons" className="mt-0">
              <AuthorizedPersonsStep 
                data={data} 
                updateData={updateData} 
                onNext={onNext} 
                onPrev={onPrev} 
              />
            </TabsContent>
            
            <TabsContent value="actual-owners" className="mt-0">
              <ActualOwnersStep 
                data={data} 
                updateData={updateData} 
                onNext={onNext} 
                onPrev={onPrev} 
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        title={infoModalData.title}
        description={infoModalData.description}
        features={infoModalData.features}
        tips={infoModalData.tips}
        helpInfo={infoModalData.helpInfo}
      />
    </div>
  );
};

export default PersonsAndOwnersStep;
