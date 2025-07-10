import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Building2 } from 'lucide-react';
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

// Mock merchant data - replace with actual data from your API
const merchants = [
  { id: 'all', name: 'All Merchants' },
  { id: '1', name: 'ABC Company s.r.o.' },
  { id: '2', name: 'XYZ Business Ltd.' },
  { id: '3', name: 'Tech Solutions Inc.' },
  { id: '4', name: 'Global Trade Corp.' },
  { id: '5', name: 'Local Services LLC' }
];

interface MerchantSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const MerchantSelect = ({ value, onChange }: MerchantSelectProps) => {
  const [open, setOpen] = useState(false);

  const selectedMerchant = merchants.find(merchant => merchant.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2 flex-1 truncate">
            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              {selectedMerchant?.name || 'Select merchant...'}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search merchants..." />
          <CommandList>
            <CommandEmpty>No merchant found.</CommandEmpty>
            <CommandGroup>
              {merchants.map((merchant) => (
                <CommandItem
                  key={merchant.id}
                  value={merchant.id}
                  onSelect={() => {
                    onChange(merchant.id);
                    setOpen(false);
                  }}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span className={merchant.id === 'all' ? 'font-medium' : ''}>
                    {merchant.name}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MerchantSelect;