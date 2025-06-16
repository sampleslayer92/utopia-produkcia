
import { Link, Link2Off } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface LinkedPersonIndicatorProps {
  isLinked: boolean;
  onToggleLink: () => void;
  compact?: boolean;
}

const LinkedPersonIndicator = ({ isLinked, onToggleLink, compact = false }: LinkedPersonIndicatorProps) => {
  const { t } = useTranslation('forms');

  if (compact) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onToggleLink}
        className={`p-1 h-auto ${isLinked ? 'text-blue-600 hover:text-blue-700' : 'text-slate-400 hover:text-slate-600'}`}
        title={isLinked ? 'Odpojená osoba od kontaktných údajov' : 'Prepojiť osobu s kontaktnými údajmi'}
      >
        {isLinked ? <Link className="h-4 w-4" /> : <Link2Off className="h-4 w-4" />}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs">
      {isLinked ? (
        <>
          <div className="flex items-center gap-1 text-blue-600">
            <Link className="h-3 w-3" />
            <span>Prepojené s kontaktom</span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onToggleLink}
            className="h-auto p-1 text-blue-600 hover:text-blue-700"
          >
            Odpojiť
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onToggleLink}
          className="h-auto p-1 text-slate-500 hover:text-blue-600 flex items-center gap-1"
        >
          <Link2Off className="h-3 w-3" />
          Prepojiť s kontaktom
        </Button>
      )}
    </div>
  );
};

export default LinkedPersonIndicator;
