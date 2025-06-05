
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CountryOption {
  code: string;
  prefix: string;
  flag: string;
  name: string;
}

interface CountryFlagSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

const countries: CountryOption[] = [
  { code: 'SK', prefix: '+421', flag: '🇸🇰', name: 'Slovensko' },
  { code: 'CZ', prefix: '+420', flag: '🇨🇿', name: 'Česká republika' },
  { code: 'AT', prefix: '+43', flag: '🇦🇹', name: 'Rakúsko' },
  { code: 'HU', prefix: '+36', flag: '🇭🇺', name: 'Maďarsko' },
  { code: 'PL', prefix: '+48', flag: '🇵🇱', name: 'Poľsko' },
  { code: 'DE', prefix: '+49', flag: '🇩🇪', name: 'Nemecko' },
  { code: 'GB', prefix: '+44', flag: '🇬🇧', name: 'Veľká Británia' },
  { code: 'FR', prefix: '+33', flag: '🇫🇷', name: 'Francúzsko' },
  { code: 'IT', prefix: '+39', flag: '🇮🇹', name: 'Taliansko' },
  { code: 'ES', prefix: '+34', flag: '🇪🇸', name: 'Španielsko' },
  { code: 'RO', prefix: '+40', flag: '🇷🇴', name: 'Rumunsko' },
  { code: 'BG', prefix: '+359', flag: '🇧🇬', name: 'Bulharsko' },
  { code: 'HR', prefix: '+385', flag: '🇭🇷', name: 'Chorvátsko' },
  { code: 'SI', prefix: '+386', flag: '🇸🇮', name: 'Slovinsko' },
  { code: 'UA', prefix: '+380', flag: '🇺🇦', name: 'Ukrajina' },
  { code: 'US', prefix: '+1', flag: '🇺🇸', name: 'USA' },
];

const CountryFlagSelect = ({ value, onValueChange, className }: CountryFlagSelectProps) => {
  const selectedCountry = countries.find(country => country.prefix === value) || countries[0];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-24 ${className}`}>
        <SelectValue>
          <div className="flex items-center gap-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm">{selectedCountry.prefix}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.prefix}>
            <div className="flex items-center gap-3 py-1">
              <span className="text-lg">{country.flag}</span>
              <span className="text-sm font-medium">{country.prefix}</span>
              <span className="text-sm text-slate-600">{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountryFlagSelect;
