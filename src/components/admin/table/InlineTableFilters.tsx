
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
          <div className="w-64 p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Vyhľadávanie</label>
              <Input
                placeholder={placeholder}
                value={(value as string) || ''}
                onChange={(e) => onValueChange(e.target.value || undefined)}
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={clearFilter} className="text-slate-600">
                <X className="h-3 w-3 mr-1" />
                Vymazať
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                Použiť
              </Button>
            </div>
          </div>
        );

      case 'select':
        return (
          <div className="w-64 p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Výber možnosti</label>
              <Select 
                value={(value as string) || 'all'} 
                onValueChange={(val) => onValueChange(val === 'all' ? undefined : val)}
              >
                <SelectTrigger className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-slate-200 shadow-lg">
                  <SelectItem value="all" className="text-slate-700">Všetky možnosti</SelectItem>
                  {options?.map(option => (
                    <SelectItem key={option.value} value={option.value} className="text-slate-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={clearFilter} className="text-slate-600">
                <X className="h-3 w-3 mr-1" />
                Vymazać
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                Použiť
              </Button>
            </div>
          </div>
        );

      case 'date-range':
        const dateValue = value as { from: string; to: string } | undefined;
        return (
          <div className="w-80 p-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Časové obdobie</label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Od</label>
                  <Input
                    type="date"
                    value={dateValue?.from || ''}
                    onChange={(e) => onValueChange({
                      from: e.target.value,
                      to: dateValue?.to || ''
                    })}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Do</label>
                  <Input
                    type="date"
                    value={dateValue?.to || ''}
                    onChange={(e) => onValueChange({
                      from: dateValue?.from || '',
                      to: e.target.value
                    })}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={clearFilter} className="text-slate-600">
                <X className="h-3 w-3 mr-1" />
                Vymazať
              </Button>
              <Button size="sm" onClick={() => setIsOpen(false)} className="bg-blue-600 hover:bg-blue-700">
                Použiť
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
          className={`h-8 w-8 p-0 hover:bg-slate-100 transition-colors duration-200 ${
            hasActiveFilter ? 'text-blue-600 bg-blue-50' : 'text-slate-400'
          }`}
        >
          {hasActiveFilter ? (
            <div className="relative">
              <Filter className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 h-2 w-2 bg-blue-600 rounded-full"></div>
            </div>
          ) : (
            <Filter className="h-4 w-4" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 bg-white border border-slate-200 shadow-xl" align="start">
        {renderFilterContent()}
      </PopoverContent>
    </Popover>
  );
};
