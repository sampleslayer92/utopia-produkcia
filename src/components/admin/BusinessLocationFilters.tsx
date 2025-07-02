import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useMerchantsData } from "@/hooks/useMerchantsData";

interface BusinessLocationFiltersProps {
  filters: {
    merchant: string;
    sector: string;
    hasPos: string;
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}

const BusinessLocationFilters = ({ filters, onFiltersChange }: BusinessLocationFiltersProps) => {
  const { data: merchants } = useMerchantsData();

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      merchant: 'all',
      sector: 'all',
      hasPos: 'all',
      search: ''
    });
  };

  const businessSectors = [
    'Reštaurácia',
    'Kaviareň',
    'Maloobchod',
    'Veľkoobchod',
    'Služby',
    'Hotel',
    'Penzión',
    'Iné'
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="search">Hľadať</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="search"
                placeholder="Názov prevádzky, adresa..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="merchant">Merchant</Label>
            <Select value={filters.merchant || 'all'} onValueChange={(value) => handleFilterChange('merchant', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Všetci merchanti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetci merchanti</SelectItem>
                {merchants?.map((merchant) => (
                  <SelectItem key={merchant.id} value={merchant.id}>
                    {merchant.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sector">Sektor</Label>
            <Select value={filters.sector || 'all'} onValueChange={(value) => handleFilterChange('sector', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Všetky sektory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky sektory</SelectItem>
                {businessSectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hasPos">POS terminál</Label>
            <Select value={filters.hasPos || 'all'} onValueChange={(value) => handleFilterChange('hasPos', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Všetky prevádzky" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky prevádzky</SelectItem>
                <SelectItem value="true">S POS terminálom</SelectItem>
                <SelectItem value="false">Bez POS terminálu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(filters.merchant || filters.sector || filters.hasPos || filters.search) && (
          <div className="mt-4 flex justify-end">
            <Button variant="outline" onClick={clearFilters} size="sm">
              <X className="h-4 w-4 mr-2" />
              Vyčistiť filtre
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BusinessLocationFilters;