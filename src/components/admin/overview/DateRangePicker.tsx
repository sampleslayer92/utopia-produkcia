import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value: { from: Date | null; to: Date | null };
  onChange: (range: { from: Date | null; to: Date | null }) => void;
}

const DateRangePicker = ({ value, onChange }: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    if (range) {
      onChange({
        from: range.from || null,
        to: range.to || null
      });
    }
  };

  const formatDateRange = () => {
    if (value.from && value.to) {
      return `${format(value.from, 'dd.MM.yyyy')} - ${format(value.to, 'dd.MM.yyyy')}`;
    } else if (value.from) {
      return `From ${format(value.from, 'dd.MM.yyyy')}`;
    } else if (value.to) {
      return `Until ${format(value.to, 'dd.MM.yyyy')}`;
    }
    return 'Select date range';
  };

  const clearRange = () => {
    onChange({ from: null, to: null });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal ${
            !value.from && !value.to ? 'text-muted-foreground' : ''
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value.from || new Date()}
          selected={{ from: value.from || undefined, to: value.to || undefined }}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
        <div className="p-3 border-t">
          <Button
            variant="outline"
            className="w-full"
            onClick={clearRange}
          >
            Clear
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;