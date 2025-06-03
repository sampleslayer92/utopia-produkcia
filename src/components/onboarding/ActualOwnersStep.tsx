
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingData } from "@/types/onboarding";

interface ActualOwnersStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ActualOwnersStep = ({ data, updateData }: ActualOwnersStepProps) => {
  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Skutoční majitelia</CardTitle>
        <CardDescription className="text-slate-600">
          Koneční beneficienti spoločnosti
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-12 text-slate-500">
          Krok v príprave - správa skutočných majiteľov bude doplnená
        </div>
      </CardContent>
    </Card>
  );
};

export default ActualOwnersStep;
