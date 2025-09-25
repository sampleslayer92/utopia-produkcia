import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown } from 'lucide-react';
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

const getStatusConfig = (t: any) => [
  { value: 'draft', label: t('status.draft'), color: 'bg-slate-100 text-slate-700' },
  { value: 'submitted', label: t('status.submitted'), color: 'bg-blue-100 text-blue-700' },
  { value: 'approved', label: t('status.approved'), color: 'bg-green-100 text-green-700' },
  { value: 'rejected', label: t('status.rejected'), color: 'bg-red-100 text-red-700' },
  { value: 'in_progress', label: t('status.in_progress'), color: 'bg-yellow-100 text-yellow-700' },
  { value: 'sent_to_client', label: t('contracts.statusOptions.sent_to_client'), color: 'bg-purple-100 text-purple-700' },
  { value: 'email_viewed', label: t('status.email_viewed'), color: 'bg-indigo-100 text-indigo-700' },
  { value: 'step_completed', label: t('status.step_completed'), color: 'bg-teal-100 text-teal-700' },
  { value: 'contract_generated', label: t('status.contract_generated'), color: 'bg-orange-100 text-orange-700' },
  { value: 'signed', label: t('status.signed'), color: 'bg-green-100 text-green-700' },
  { value: 'waiting_for_signature', label: t('requests.status.waiting_for_signature'), color: 'bg-amber-100 text-amber-700' },
  { value: 'lost', label: t('status.lost'), color: 'bg-red-100 text-red-700' }
];

interface StatusMultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const StatusMultiSelect = ({ value, onChange }: StatusMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation('admin');
  
  const statuses = getStatusConfig(t);
  const selectedStatuses = statuses.filter(status => value.includes(status.value));
  
  const handleToggle = (statusValue: string) => {
    const newValue = value.includes(statusValue)
      ? value.filter(v => v !== statusValue)
      : [...value, statusValue];
    onChange(newValue);
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectAll = () => {
    onChange(statuses.map(s => s.value));
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
            {selectedStatuses.length === 0 ? (
              <span className="text-muted-foreground">{t('overview.filters.statusSelect.placeholder')}</span>
            ) : selectedStatuses.length === 1 ? (
              <Badge variant="outline" className={`text-xs ${selectedStatuses[0].color}`}>
                {selectedStatuses[0].label}
              </Badge>
            ) : (
              <span className="text-sm">
                {selectedStatuses.length} {t('overview.filters.statusSelect.selected')}
              </span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={t('overview.filters.statusSelect.search')} />
          <CommandList>
            <CommandEmpty>{t('overview.filters.statusSelect.noResults')}</CommandEmpty>
            <CommandGroup>
              <div className="flex items-center justify-between p-2 border-b">
                <Button variant="ghost" size="sm" onClick={selectAll}>
                  {t('overview.filters.statusSelect.selectAll')}
                </Button>
                <Button variant="ghost" size="sm" onClick={clearAll}>
                  {t('overview.filters.statusSelect.clearAll')}
                </Button>
              </div>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={() => handleToggle(status.value)}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value.includes(status.value) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <Badge variant="outline" className={`text-xs ${status.color}`}>
                    {status.label}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StatusMultiSelect;