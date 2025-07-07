
import { useTranslation } from 'react-i18next';
import { useState, useCallback } from 'react';
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
  const [isChanging, setIsChanging] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = useCallback(async (languageCode: string) => {
    if (isChanging || i18n.language === languageCode) return;
    
    try {
      setIsChanging(true);
      console.log('Changing language from', i18n.language, 'to', languageCode);
      
      await i18n.changeLanguage(languageCode);
      
      // Force a small delay to ensure DOM updates are complete
      setTimeout(() => {
        setIsChanging(false);
        console.log('Language change completed successfully');
        
        // Dispatch a custom event to notify components about language change
        window.dispatchEvent(new CustomEvent('languageChanged', { 
          detail: { newLanguage: languageCode, oldLanguage: i18n.language }
        }));
      }, 100);
      
    } catch (error) {
      console.error('Error changing language:', error);
      setIsChanging(false);
      
      // Fallback: refresh the page if language change fails
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [i18n, isChanging]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          disabled={isChanging}
        >
          <img 
            src={currentLanguage.flag} 
            alt={currentLanguage.name}
            className="w-4 h-3 object-cover"
          />
          <span className="hidden sm:inline">
            {isChanging ? 'Changing...' : currentLanguage.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            disabled={isChanging || i18n.language === language.code}
            className={`gap-2 ${i18n.language === language.code ? 'bg-accent' : ''}`}
          >
            <img 
              src={language.flag} 
              alt={language.name}
              className="w-4 h-3 object-cover"
            />
            <span>{language.name}</span>
            {i18n.language === language.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
