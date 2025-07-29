import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  GripVertical,
  Edit,
  Trash2,
  Copy,
  Settings,
  Eye,
  EyeOff
} from "lucide-react";
import type { OnboardingStep } from '@/pages/OnboardingConfigPage';

interface OnboardingStepCardProps {
  step: OnboardingStep;
  index: number;
  onEdit: (step: OnboardingStep) => void;
  onDelete: (stepId: string) => void;
  onDuplicate: (stepId: string) => void;
  onToggleEnabled: (stepId: string, enabled: boolean) => void;
}

const OnboardingStepCard = ({
  step,
  index,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleEnabled
}: OnboardingStepCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`transition-all hover:shadow-md ${isDragging ? 'shadow-lg' : ''} ${
        !step.isEnabled ? 'opacity-60' : ''
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab hover:cursor-grabbing p-1 hover:bg-slate-100 rounded"
            >
              <GripVertical className="h-4 w-4 text-slate-400" />
            </button>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {index + 1}
              </Badge>
              <div>
                <h3 className="font-medium text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Aktívny</span>
              <Switch
                checked={step.isEnabled}
                onCheckedChange={(enabled) => onToggleEnabled(step.id, enabled)}
              />
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(step)}
            >
              <Edit className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(step.id)}
            >
              <Copy className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(step.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {showDetails && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Kľúč kroku:</span>
                <p className="text-muted-foreground">{step.stepKey}</p>
              </div>
              <div>
                <span className="font-medium">Pozícia:</span>
                <p className="text-muted-foreground">{step.position}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">Polia ({step.fields.length})</span>
                <Button variant="outline" size="sm" onClick={() => onEdit(step)}>
                  <Settings className="h-3 w-3 mr-1" />
                  Upraviť polia
                </Button>
              </div>
              
              {step.fields.length > 0 ? (
                <div className="space-y-1">
                  {step.fields.slice(0, 3).map((field) => (
                    <div key={field.id} className="flex items-center justify-between text-xs bg-slate-50 rounded p-2">
                      <span>{field.fieldLabel}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {field.fieldType}
                        </Badge>
                        {field.isRequired && (
                          <Badge variant="destructive" className="text-xs">
                            Povinné
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {step.fields.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center">
                      ... a ďalších {step.fields.length - 3} polí
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Žiadne polia nie sú nakonfigurované
                </div>
              )}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default OnboardingStepCard;