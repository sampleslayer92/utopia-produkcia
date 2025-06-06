
import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { searchCompanySuggestions, CompanyRecognitionResult } from "../services/mockCompanyRecognition";

interface CompanyAutocompleteProps {
  value: string;
  onValueChange: (value: string) => void;
  onCompanySelect: (company: CompanyRecognitionResult) => void;
  placeholder?: string;
  className?: string;
}

const CompanyAutocomplete = ({
  value,
  onValueChange,
  onCompanySelect,
  placeholder = "Začnite písať názov spoločnosti...",
  className
}: CompanyAutocompleteProps) => {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CompanyRecognitionResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchCompanySuggestions(searchQuery);
          setSuggestions(results);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelect = (selectedCompany: CompanyRecognitionResult) => {
    onValueChange(selectedCompany.companyName);
    onCompanySelect(selectedCompany);
    setOpen(false);
    setSearchQuery(selectedCompany.companyName);
  };

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    onValueChange(inputValue);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        Obchodné meno spoločnosti *
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between h-11 px-3 border-slate-300 focus:border-blue-500",
              !value && "text-muted-foreground",
              className
            )}
          >
            <div className="flex items-center gap-2 truncate">
              <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <span className="truncate">
                {value || placeholder}
              </span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 bg-white border-slate-200" align="start">
          <Command className="bg-white">
            <CommandInput
              placeholder="Vyhľadajte spoločnosť..."
              value={searchQuery}
              onValueChange={handleInputChange}
              className="border-0 focus:ring-0"
            />
            <CommandList className="max-h-[200px]">
              {isLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm text-slate-600">Vyhľadávam...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <CommandGroup>
                  {suggestions.map((company) => (
                    <CommandItem
                      key={company.companyName}
                      value={company.companyName}
                      onSelect={() => handleSelect(company)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Building2 className="h-4 w-4 text-slate-400" />
                        <div className="flex flex-col gap-1 flex-1">
                          <span className="font-medium text-slate-900">
                            {company.companyName}
                          </span>
                          <div className="text-xs text-slate-500 flex gap-4">
                            <span>IČO: {company.ico}</span>
                            <span>{company.registryType}</span>
                          </div>
                        </div>
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === company.companyName ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : searchQuery.length >= 2 ? (
                <CommandEmpty className="py-6 text-center text-sm text-slate-600">
                  Žiadne výsledky pre "{searchQuery}"
                </CommandEmpty>
              ) : (
                <div className="py-6 text-center text-sm text-slate-500">
                  Zadajte aspoň 2 znaky pre vyhľadávanie
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompanyAutocomplete;
