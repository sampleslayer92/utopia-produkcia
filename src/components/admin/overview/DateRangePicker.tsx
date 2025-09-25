import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('admin');

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
      return `${t('overview.filters.dateRange.from')} ${format(value.from, 'dd.MM.yyyy')}`;
    } else if (value.to) {
      return `${t('overview.filters.dateRange.until')} ${format(value.to, 'dd.MM.yyyy')}`;
    }
    return t('overview.filters.dateRange.placeholder');
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
            {t('overview.filters.dateRange.clear')}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;