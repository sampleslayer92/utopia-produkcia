
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const QuantityStepper = ({ value, onChange, min = 1, max = 99, className = "" }: QuantityStepperProps) => {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, newValue));
    onChange(clampedValue);
  };

  return (
    <div className={`flex items-center border rounded-lg ${className}`}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleDecrease}
        disabled={value <= min}
        className="h-10 w-10 rounded-none border-none hover:bg-slate-100"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="h-10 text-center border-none focus:ring-0 focus:border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        style={{ borderRadius: 0 }}
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleIncrease}
        disabled={value >= max}
        className="h-10 w-10 rounded-none border-none hover:bg-slate-100"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantityStepper;
