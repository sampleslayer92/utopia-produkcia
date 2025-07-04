
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'sk', name: 'Slovensky', flag: 'https://flagcdn.com/sk.svg' },
  { code: 'en', name: 'English', flag: 'https://flagcdn.com/gb.svg' },
];

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <img 
            src={currentLanguage.flag} 
            alt={currentLanguage.name}
            className="w-4 h-3 object-cover"
          />
          <span className="hidden sm:inline">{currentLanguage.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className={`gap-2 ${i18n.language === language.code ? 'bg-accent' : ''}`}
          >
            <img 
              src={language.flag} 
              alt={language.name}
              className="w-4 h-3 object-cover"
            />
            <span>{language.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
