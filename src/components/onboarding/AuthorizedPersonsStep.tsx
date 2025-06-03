
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingData } from "@/types/onboarding";

interface AuthorizedPersonsStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AuthorizedPersonsStep = ({ data, updateData }: AuthorizedPersonsStepProps) => {
  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Oprávnené osoby</CardTitle>
        <CardDescription className="text-slate-600">
          Osoby oprávnené konať v mene spoločnosti
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center py-12 text-slate-500">
          Krok v príprave - správa oprávnených osôb bude doplnená
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorizedPersonsStep;
