import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Globe } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const sources = [
  { value: 'web', label: 'Web', icon: '🌐' },
  { value: 'telesales', label: 'Telesales', icon: '📞' },
  { value: 'facebook', label: 'Facebook', icon: '📘' },
  { value: 'email', label: 'Email', icon: '📧' },
  { value: 'referral', label: 'Referral', icon: '👥' },
  { value: 'other', label: 'Other', icon: '📄' }
];

interface SourceMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SourceMultiSelect = ({ value, onChange }: SourceMultiSelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedSources = sources.filter(source => value.includes(source.value));
  
  const handleToggle = (sourceValue: string) => {
    const newValue = value.includes(sourceValue)
      ? value.filter(v => v !== sourceValue)
      : [...value, sourceValue];
    onChange(newValue);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(sources.map(s => s.value));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-1 flex-1 truncate">
            <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            {selectedSources.length === 0 ? (
              <span className="text-muted-foreground">Select sources...</span>
            ) : selectedSources.length === 1 ? (
              <div className="flex items-center gap-1">
                <span>{selectedSources[0].icon}</span>
                <span>{selectedSources[0].label}</span>
              </div>
            ) : (
              <span className="text-sm">
                {selectedSources.length} selected
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search sources..." />
          <CommandList>
            <CommandEmpty>No source found.</CommandEmpty>
            <CommandGroup>
              <div className="flex items-center justify-between p-2 border-b">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  Select All
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              </div>
              {sources.map((source) => (
                <CommandItem
                  key={source.value}
                  value={source.value}
                  onSelect={() => handleToggle(source.value)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value.includes(source.value) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <span className="mr-2">{source.icon}</span>
                  {source.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SourceMultiSelect;