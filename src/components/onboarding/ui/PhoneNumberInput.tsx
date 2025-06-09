
import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Check } from 'lucide-react';

interface CountryOption {
  code: string;
  prefix: string;
  name: string;
}

interface PhoneNumberInputProps {
  label?: string;
  phoneValue: string;
  prefixValue: string;
  onPhoneChange: (value: string) => void;
  onPrefixChange: (value: string) => void;
  placeholder?: string;
  isCompleted?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
}

const countries: CountryOption[] = [
  { code: 'sk', prefix: '+421', name: 'Slovensko' },
  { code: 'cz', prefix: '+420', name: 'Česká republika' },
  { code: 'at', prefix: '+43', name: 'Rakúsko' },
  { code: 'hu', prefix: '+36', name: 'Maďarsko' },
  { code: 'pl', prefix: '+48', name: 'Poľsko' },
  { code: 'de', prefix: '+49', name: 'Nemecko' },
  { code: 'gb', prefix: '+44', name: 'Veľká Británia' },
  { code: 'fr', prefix: '+33', name: 'Francúzsko' },
  { code: 'it', prefix: '+39', name: 'Taliansko' },
  { code: 'es', prefix: '+34', name: 'Španielsko' },
  { code: 'ro', prefix: '+40', name: 'Rumunsko' },
  { code: 'bg', prefix: '+359', name: 'Bulharsko' },
  { code: 'hr', prefix: '+385', name: 'Chorvátsko' },
  { code: 'si', prefix: '+386', name: 'Slovinsko' },
  { code: 'ua', prefix: '+380', name: 'Ukrajina' },
  { code: 'us', prefix: '+1', name: 'USA' },
];

const PhoneNumberInput = ({
  label = "Telefónne číslo",
  phoneValue,
  prefixValue,
  onPhoneChange,
  onPrefixChange,
  placeholder = "123 456 789",
  isCompleted,
  error,
  className = "",
  required = false
}: PhoneNumberInputProps) => {
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  
  const selectedCountry = countries.find(country => country.prefix === prefixValue) || countries[0];

  const handleImageError = (countryCode: string) => {
    setImageErrors(prev => new Set(prev).add(countryCode));
  };

  const getFlagImageUrl = (countryCode: string) => {
    return `https://hampusborgos.github.io/country-flags/png100px/${countryCode}.png`;
  };

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers, spaces, and common phone number characters
    const value = e.target.value.replace(/[^\d\s\-\(\)]/g, '');
    onPhoneChange(value);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center gap-2 text-slate-700">
          <Phone className="h-4 w-4 text-blue-500" />
          <Label className="text-sm font-medium">
            {label} {required && "*"}
          </Label>
        </div>
      )}
      
      <div className="flex gap-2">
        {/* Country Code Selector */}
        <Select value={prefixValue} onValueChange={onPrefixChange}>
          <SelectTrigger className="w-32 h-12 border-2 border-slate-200 bg-white/80 hover:border-slate-300 focus:border-blue-500">
            <SelectValue>
              <div className="flex items-center gap-2">
                {!imageErrors.has(selectedCountry.code) ? (
                  <img
                    src={getFlagImageUrl(selectedCountry.code)}
                    alt={selectedCountry.name}
                    className="w-5 h-5 rounded-full object-cover"
                    onError={() => handleImageError(selectedCountry.code)}
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                    {selectedCountry.code.toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium">{selectedCountry.prefix}</span>
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="bg-white border border-slate-200 shadow-lg z-50">
            {countries.map((country) => (
              <SelectItem key={country.code} value={country.prefix} className="hover:bg-slate-50">
                <div className="flex items-center gap-3 py-1">
                  {!imageErrors.has(country.code) ? (
                    <img
                      src={getFlagImageUrl(country.code)}
                      alt={country.name}
                      className="w-5 h-5 rounded-full object-cover"
                      onError={() => handleImageError(country.code)}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs">
                      {country.code.toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium">{country.prefix}</span>
                  <span className="text-sm text-slate-600">{country.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Phone Number Input */}
        <div className="relative flex-1">
          <Input
            type="tel"
            value={phoneValue}
            onChange={handlePhoneInputChange}
            placeholder={placeholder}
            className={`h-12 border-2 transition-all duration-200 ${
              error
                ? 'border-red-300 bg-red-50'
                : 'border-slate-200 bg-white/80 hover:border-slate-300 focus:border-blue-500 focus:shadow-md focus:shadow-blue-500/20'
            }`}
          />
          {isCompleted && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Check className="h-4 w-4 text-green-500" />
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
