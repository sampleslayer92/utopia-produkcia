
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingData } from "@/types/onboarding";

interface DeviceSelectionStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const DeviceSelectionStep = ({ data, updateData }: DeviceSelectionStepProps) => {
  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Výber zariadení, licencií a služieb</CardTitle>
        <CardDescription className="text-slate-600">
          Vyberte si potrebné technické vybavenie a služby
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-12 text-slate-500">
          Krok v príprave - detailný výber zariadení bude doplnený
        </div>
      </CardContent>
    </Card>
  );
};

export default DeviceSelectionStep;
