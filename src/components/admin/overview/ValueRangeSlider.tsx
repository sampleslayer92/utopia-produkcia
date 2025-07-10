import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ValueRangeSliderProps {
  value: { min: number | null; max: number | null };
  onChange: (range: { min: number | null; max: number | null }) => void;
}

const ValueRangeSlider = ({ value, onChange }: ValueRangeSliderProps) => {
  const [minInput, setMinInput] = useState(value.min?.toString() || '');
  const [maxInput, setMaxInput] = useState(value.max?.toString() || '');

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMinInput(val);
    
    const numVal = val === '' ? null : parseFloat(val);
    if (numVal !== null && !isNaN(numVal)) {
      onChange({ ...value, min: numVal });
    } else if (val === '') {
      onChange({ ...value, min: null });
    }
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setMaxInput(val);
    
    const numVal = val === '' ? null : parseFloat(val);
    if (numVal !== null && !isNaN(numVal)) {
      onChange({ ...value, max: numVal });
    } else if (val === '') {
      onChange({ ...value, max: null });
    }
  };

  const clearRange = () => {
    setMinInput('');
    setMaxInput('');
    onChange({ min: null, max: null });
  };

  const setPreset = (min: number | null, max: number | null) => {
    setMinInput(min?.toString() || '');
    setMaxInput(max?.toString() || '');
    onChange({ min, max });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor="min-value" className="text-xs">Min €</Label>
          <Input
            id="min-value"
            type="number"
            placeholder="0"
            value={minInput}
            onChange={handleMinChange}
            className="h-8"
          />
        </div>
        <div>
          <Label htmlFor="max-value" className="text-xs">Max €</Label>
          <Input
            id="max-value"
            type="number"
            placeholder="∞"
            value={maxInput}
            onChange={handleMaxChange}
            className="h-8"
          />
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreset(null, 5000)}
          className="text-xs h-6"
        >
          Under 5K
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreset(5000, 20000)}
          className="text-xs h-6"
        >
          5K-20K
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreset(20000, 50000)}
          className="text-xs h-6"
        >
          20K-50K
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPreset(50000, null)}
          className="text-xs h-6"
        >
          50K+
        </Button>
      </div>
      
      {(value.min !== null || value.max !== null) && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearRange}
          className="w-full text-xs h-6"
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default ValueRangeSlider;