
import { useState } from "react";
import { TableHead } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface FilterableTableHeadProps {
  title: string;
  filterType?: 'select' | 'text' | 'date' | 'none';
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  options?: { value: string; label: string }[];
  className?: string;
}

const FilterableTableHead = ({
  title,
  filterType = 'none',
  filterValue = '',
  onFilterChange,
  options = [],
  className
}: FilterableTableHeadProps) => {
  const [showFilter, setShowFilter] = useState(false);
  const [date, setDate] = useState<Date>();

  const renderFilter = () => {
    if (filterType === 'none') return null;

    switch (filterType) {
      case 'select':
        return (
          <Select value={filterValue} onValueChange={onFilterChange}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Všetky" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">Všetky</SelectItem>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'text':
        return (
          <Input
            placeholder="Filter..."
            value={filterValue}
            onChange={(e) => onFilterChange?.(e.target.value)}
            className="h-8 text-xs"
          />
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 w-full justify-start text-left font-normal text-xs",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {date ? format(date, "dd.MM.yyyy") : "Dátum"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate);
                  if (selectedDate) {
                    onFilterChange?.(format(selectedDate, "yyyy-MM-dd"));
                  }
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <TableHead className={cn("space-y-2", className)}>
      <div className="flex items-center space-x-2">
        <span className="font-medium text-slate-700">{title}</span>
        {filterType !== 'none' && (
          <Filter 
            className="h-3 w-3 text-slate-400 cursor-pointer" 
            onClick={() => setShowFilter(!showFilter)}
          />
        )}
      </div>
      {(showFilter || filterType !== 'none') && (
        <div className="mt-2">
          {renderFilter()}
        </div>
      )}
    </TableHead>
  );
};

export default FilterableTableHead;
