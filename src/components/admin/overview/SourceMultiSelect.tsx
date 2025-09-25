import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

const getSourceConfig = (t: any) => [
  { value: 'web', label: t('contracts.sourceOptions.web'), icon: '🌐' },
  { value: 'telesales', label: t('overview.filters.source.telesales'), icon: '📞' },
  { value: 'facebook', label: t('overview.filters.source.facebook'), icon: '📘' },
  { value: 'email', label: t('overview.filters.source.email'), icon: '📧' },
  { value: 'referral', label: t('contracts.sourceOptions.referral'), icon: '👥' },
  { value: 'partner', label: t('contracts.sourceOptions.partner'), icon: '🤝' },
  { value: 'direct', label: t('contracts.sourceOptions.direct'), icon: '📞' },
  { value: 'other', label: t('overview.filters.source.other'), icon: '📄' }
];

interface SourceMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SourceMultiSelect = ({ value, onChange }: SourceMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('admin');
  
  const sources = getSourceConfig(t);
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
              <span className="text-muted-foreground">{t('overview.filters.source.placeholder')}</span>
            ) : selectedSources.length === 1 ? (
              <div className="flex items-center gap-1">
                <span>{selectedSources[0].icon}</span>
                <span>{selectedSources[0].label}</span>
              </div>
            ) : (
              <span className="text-sm">
                {selectedSources.length} {t('overview.filters.statusSelect.selected')}
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={t('overview.filters.source.search')} />
          <CommandList>
            <CommandEmpty>{t('overview.filters.source.noResults')}</CommandEmpty>
            <CommandGroup>
              <div className="flex items-center justify-between p-2 border-b">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  {t('overview.filters.statusSelect.selectAll')}
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  {t('overview.filters.statusSelect.clearAll')}
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