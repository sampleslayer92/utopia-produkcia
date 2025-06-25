
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import OnboardingInput from '@/components/onboarding/ui/OnboardingInput';
import OnboardingSelect from '@/components/onboarding/ui/OnboardingSelect';

const InputsSection = () => {
  return (
    <div className="max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Form Controls</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          Kompletná kolekcia input komponentov pre formuláre a užívateľské vstupy.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Standard Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="standard-input">Standard Input</Label>
            <Input id="standard-input" placeholder="Enter text..." />
          </div>
          
          <div>
            <Label htmlFor="textarea">Textarea</Label>
            <Textarea id="textarea" placeholder="Enter longer text..." />
          </div>
          
          <div>
            <OnboardingInput 
              label="Onboarding Input"
              placeholder="Custom styled input..."
            />
          </div>
          
          <div>
            <OnboardingSelect
              label="Onboarding Select"
              placeholder="Choose option..."
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputsSection;
