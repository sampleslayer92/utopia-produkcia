
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InlineFilterProps {
  type: 'text' | 'select' | 'date-range';
  options?: { value: string; label: string }[];
  value?: string | { from: string; to: string };
  onValueChange: (value: string | { from: string; to: string } | undefined) => void;
  placeholder?: string;
  hasActiveFilter?: boolean;
}

export const InlineTableFilter = ({ 
  type, 
  options, 
  value, 
  onValueChange, 
  placeholder,
  hasActiveFilter = false 
}: InlineFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const clearFilter = () => {
    onValueChange(undefined);
    setIsOpen(false);
  };

  const renderFilterContent = () => {
    switch (type) {
      case 'text':
        return (
          <div className="w-60 p-3">
            <Input
              placeholder={placeholder}
              value={(value as string) || ''}
              onChange={(e) => onValueChange(e.target.value || undefined)}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilter}>
                Vymazať
              </Button>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="w-60 p-3">
            <Select 
              value={(value as string) || 'all'} 
              onValueChange={(val) => onValueChange(val === 'all' ? undefined : val)}
            >
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">Všetky</SelectItem>
                {options?.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end mt-3">
              <Button variant="outline" size="sm" onClick={clearFilter}>
                Vymazať
              </Button>
            </div>
          </div>
        );

      case 'date-range':
        const dateValue = value as { from: string; to: string } | undefined;
        return (
          <div className="w-80 p-3">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Input
                type="date"
                placeholder="Od"
                value={dateValue?.from || ''}
                onChange={(e) => onValueChange({
                  from: e.target.value,
                  to: dateValue?.to || ''
                })}
              />
              <Input
                type="date"
                placeholder="Do"
                value={dateValue?.to || ''}
                onChange={(e) => onValueChange({
                  from: dateValue?.from || '',
                  to: e.target.value
                })}
              />
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilter}>
                Vymazať
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-6 w-6 p-0 hover:bg-slate-100 ${hasActiveFilter ? 'text-blue-600' : 'text-slate-400'}`}
        >
          {hasActiveFilter ? (
            <Badge variant="secondary" className="h-4 w-4 p-0 flex items-center justify-center">
              <Filter className="h-3 w-3" />
            </Badge>
          ) : (
            <Filter className="h-3 w-3" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white border border-slate-200" align="start">
        {renderFilterContent()}
      </PopoverContent>
    </Popover>
  );
};
