
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface ContractTableFiltersProps {
  searchTerm: string;
  statusFilter: string;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
}

const ContractTableFilters = ({
  searchTerm,
  statusFilter,
  onSearchChange,
  onStatusFilterChange
}: ContractTableFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Vyhľadať zmluvu (číslo, meno, email, spoločnosť, IČO)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-slate-500" />
        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter stavu" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">Všetky stavy</SelectItem>
            <SelectItem value="draft">Koncept</SelectItem>
            <SelectItem value="submitted">Odoslané</SelectItem>
            <SelectItem value="approved">Schválené</SelectItem>
            <SelectItem value="rejected">Zamietnuté</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ContractTableFilters;
