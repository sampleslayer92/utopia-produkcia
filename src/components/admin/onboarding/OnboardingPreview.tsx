import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Play, Eye } from "lucide-react";
import ConfigurableOnboardingFlow from "@/components/onboarding/dynamic/ConfigurableOnboardingFlow";
import type { OnboardingStep } from '@/pages/OnboardingConfigPage';

interface OnboardingPreviewProps {
  steps: OnboardingStep[];
  onClose: () => void;
}

const OnboardingPreview = ({ steps, onClose }: OnboardingPreviewProps) => {
  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Náhľad onboarding procesu
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Náhľad aktuálnej konfigurácie onboarding procesu s {steps.filter(s => s.isEnabled).length} aktívnymi krokmi
              </p>
            </div>
            <Button variant="outline" onClick={onClose}>
              <X className="h-4 w-4 mr-2" />
              Zavrieť náhľad
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {steps.map((step, index) => (
              <Badge 
                key={step.id} 
                variant={step.isEnabled ? "default" : "secondary"}
                className="text-xs"
              >
                {index + 1}. {step.title}
                {!step.isEnabled && " (deaktivovaný)"}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Onboarding Preview */}
      <Card className="border-2 border-dashed border-blue-200">
        <CardContent className="p-0">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden">
            <ConfigurableOnboardingFlow 
              isAdminMode={true}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Poznámka:</strong> Toto je náhľad onboarding procesu v admin režime. 
              Skutočná verzia pre používateľov bude mať iný dizajn a rozloženie.
            </p>
            <p>
              Konfigurácia obsahuje <strong>{steps.length}</strong> krokov, 
              z ktorých je <strong>{steps.filter(s => s.isEnabled).length}</strong> aktívnych 
              a <strong>{steps.filter(s => !s.isEnabled).length}</strong> deaktivovaných.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPreview;