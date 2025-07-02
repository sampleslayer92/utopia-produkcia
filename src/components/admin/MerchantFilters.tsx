import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface MerchantFiltersProps {
  filters: {
    search: string;
    city: string;
    hasContracts: string;
    profitRange: string;
  };
  onFiltersChange: (filters: any) => void;
}

const MerchantFilters = ({ filters, onFiltersChange }: MerchantFiltersProps) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === 'all' ? '' : value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      city: 'all',
      hasContracts: 'all',
      profitRange: 'all'
    });
  };

  const cities = [
    'Bratislava',
    'Košice', 
    'Prešov',
    'Žilina',
    'Banská Bystrica',
    'Nitra',
    'Trnava',
    'Trenčín'
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
                placeholder="Názov, IČO, kontaktná osoba..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="city">Mesto</Label>
            <Select value={filters.city || 'all'} onValueChange={(value) => handleFilterChange('city', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Všetky mestá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky mestá</SelectItem>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="hasContracts">Zmluvy</Label>
            <Select value={filters.hasContracts || 'all'} onValueChange={(value) => handleFilterChange('hasContracts', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Všetci merchanti" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetci merchanti</SelectItem>
                <SelectItem value="true">So zmluvami</SelectItem>
                <SelectItem value="false">Bez zmlúv</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="profitRange">Mesačný zisk</Label>
            <Select value={filters.profitRange || 'all'} onValueChange={(value) => handleFilterChange('profitRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Všetky hodnoty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Všetky hodnoty</SelectItem>
                <SelectItem value="0-100">€0 - €100</SelectItem>
                <SelectItem value="100-500">€100 - €500</SelectItem>
                <SelectItem value="500-1000">€500 - €1000</SelectItem>
                <SelectItem value="1000+">€1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(filters.search || filters.city || filters.hasContracts || filters.profitRange) && (
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

export default MerchantFilters;