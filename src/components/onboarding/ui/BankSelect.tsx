import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { banks, Bank, getBankName } from '@/data/banks';

interface BankSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const BankSelect: React.FC<BankSelectProps> = ({ 
  value, 
  onValueChange, 
  placeholder = "Vyberte banku alebo zadajte kód...",
  className 
}) => {
  const [open, setOpen] = useState(false);
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>(banks);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredBanks(banks);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = banks.filter(bank =>
        bank.name.toLowerCase().includes(query) ||
        bank.code.includes(query) ||
        bank.country.toLowerCase().includes(query)
      );
      setFilteredBanks(filtered);
    }
  }, [searchQuery]);

  const handleSelect = (bankCode: string) => {
    onValueChange(bankCode);
    setOpen(false);
  };

  const handleInputChange = (query: string) => {
    setSearchQuery(query);
  };

  const displayValue = value ? getBankName(value) : '';
  const selectedBank = banks.find(bank => bank.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between text-left font-normal", className)}
        >
          {displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder="Vyhľadajte banku podľa názvu alebo kódu..."
            value={searchQuery}
            onValueChange={handleInputChange}
          />
          <CommandList className="max-h-[200px]">
            <CommandEmpty>
              <div className="py-2 text-center text-sm">
                Žiadne výsledky.
                {searchQuery && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        onValueChange(searchQuery);
                        setOpen(false);
                      }}
                    >
                      Použiť "{searchQuery}" ako kód banky
                    </Button>
                  </div>
                )}
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredBanks.map((bank) => (
                <CommandItem
                  key={bank.code}
                  value={bank.code}
                  onSelect={() => handleSelect(bank.code)}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === bank.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{bank.code}</span>
                      <span className="text-sm text-muted-foreground">-</span>
                      <span className="flex-1">{bank.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {bank.country === 'SK' ? 'Slovensko' : 'Česká republika'}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default BankSelect;