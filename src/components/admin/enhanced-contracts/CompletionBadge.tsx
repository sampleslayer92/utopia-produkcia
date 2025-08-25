
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

interface CompletionBadgeProps {
  percentage: number;
  currentStep?: number | null;
}

const CompletionBadge = ({ percentage, currentStep }: CompletionBadgeProps) => {
  const { t } = useTranslation('admin');

  const getCompletionConfig = (percentage: number) => {
    if (percentage >= 100) {
      return {
        label: t('contracts.completion.complete'),
        className: 'bg-green-100 text-green-700 border-green-200'
      };
    } else if (percentage >= 75) {
      return {
        label: t('contracts.completion.nearComplete'),
        className: 'bg-blue-100 text-blue-700 border-blue-200'
      };
    } else if (percentage >= 50) {
      return {
        label: t('contracts.completion.inProgress'),
        className: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      };
    } else if (percentage > 0) {
      return {
        label: t('contracts.completion.started'),
        className: 'bg-orange-100 text-orange-700 border-orange-200'
      };
    } else {
      return {
        label: t('contracts.completion.notStarted'),
        className: 'bg-gray-100 text-gray-700 border-gray-200'
      };
    }
  };

  const config = getCompletionConfig(percentage);

  return (
    <div className="flex flex-col space-y-1">
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
      <div className="text-xs text-muted-foreground">
        {currentStep ? `${currentStep}/7` : '0/7'} {t('contracts.completion.steps')}
      </div>
    </div>
  );
};

export default CompletionBadge;
