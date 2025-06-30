
import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Filter, Search, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContractFiltersProps {
  filters: {
    status: string;
    contractType: string;
    source: string;
    salesPerson: string;
    dateFrom: string;
    dateTo: string;
    search: string;
  };
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  contractTypes?: string[];
  salesPersons?: string[];
  contractSources?: string[];
  onFilterChange: (key: string, value: string) => void;
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

const ContractFilters = ({
  filters,
  dateRange,
  contractTypes,
  salesPersons,
  contractSources,
  onFilterChange,
  onDateRangeChange
}: ContractFiltersProps) => {
  const { t } = useTranslation('admin');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
      {/* Search */}
      <div className="relative col-span-full md:col-span-2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder={t('table.search')}
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status Filter */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-slate-500" />
        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('table.filters.status')} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">{t('table.filters.allStatuses')}</SelectItem>
            <SelectItem value="draft">{t('status.draft')}</SelectItem>
            <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
            <SelectItem value="sent_to_client">{t('status.sent_to_client')}</SelectItem>
            <SelectItem value="email_viewed">{t('status.email_viewed')}</SelectItem>
            <SelectItem value="step_completed">{t('status.step_completed')}</SelectItem>
            <SelectItem value="contract_generated">{t('status.contract_generated')}</SelectItem>
            <SelectItem value="signed">{t('status.signed')}</SelectItem>
            <SelectItem value="waiting_for_signature">{t('status.waiting_for_signature')}</SelectItem>
            <SelectItem value="lost">{t('status.lost')}</SelectItem>
            <SelectItem value="submitted">{t('status.submitted')}</SelectItem>
            <SelectItem value="approved">{t('status.approved')}</SelectItem>
            <SelectItem value="rejected">{t('status.rejected')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Source Filter */}
      <Select value={filters.source} onValueChange={(value) => onFilterChange('source', value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('table.filters.source')} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">{t('table.filters.allSources')}</SelectItem>
          {contractSources?.map((source) => (
            <SelectItem key={source} value={source}>{t(`source.${source}`)}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Contract Type Filter */}
      <Select value={filters.contractType} onValueChange={(value) => onFilterChange('contractType', value)}>
        <SelectTrigger>
          <SelectValue placeholder={t('table.filters.contractType')} />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">{t('table.filters.allTypes')}</SelectItem>
          {contractTypes?.map((type) => (
            <SelectItem key={type} value={type}>{type}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Sales Person Filter */}
      <div className="flex items-center space-x-2">
        <Users className="h-4 w-4 text-slate-500" />
        <Select value={filters.salesPerson} onValueChange={(value) => onFilterChange('salesPerson', value)}>
          <SelectTrigger>
            <SelectValue placeholder={t('table.filters.salesPerson')} />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">{t('table.filters.allSalespeople')}</SelectItem>
            {salesPersons?.map((person) => (
              <SelectItem key={person} value={person}>{person}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal",
              !dateRange.from && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "dd.MM.yyyy")} -{" "}
                  {format(dateRange.to, "dd.MM.yyyy")}
                </>
              ) : (
                format(dateRange.from, "dd.MM.yyyy")
              )
            ) : (
              t('table.filters.dateRange')
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange.from}
            selected={{ from: dateRange.from, to: dateRange.to }}
            onSelect={(range) => onDateRangeChange({
              from: range?.from,
              to: range?.to
            })}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ContractFilters;
