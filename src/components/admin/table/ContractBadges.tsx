
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";

export const useContractBadges = () => {
  const { t } = useTranslation('admin');

  const getStatusBadge = (status: string, currentStep?: number) => {
    const statusMap = {
      'draft': 'bg-gray-100 text-gray-700 border-gray-200',
      'in_progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'sent_to_client': 'bg-blue-100 text-blue-700 border-blue-200',
      'email_viewed': 'bg-cyan-100 text-cyan-700 border-cyan-200',
      'step_completed': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'contract_generated': 'bg-purple-100 text-purple-700 border-purple-200',
      'signed': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'waiting_for_signature': 'bg-orange-100 text-orange-700 border-orange-200',
      'lost': 'bg-red-100 text-red-700 border-red-200',
      'submitted': 'bg-blue-100 text-blue-700 border-blue-200',
      'approved': 'bg-emerald-100 text-emerald-700 border-emerald-200',
      'rejected': 'bg-red-100 text-red-700 border-red-200'
    };

    const statusKey = status as keyof typeof statusMap;
    let displayText = t(`status.${status}`);
    
    if (status === 'in_progress' && currentStep) {
      displayText += ` (${currentStep}/7)`;
    } else if (status === 'step_completed' && currentStep) {
      displayText += ` ${currentStep}`;
    }

    return (
      <Badge className={statusMap[statusKey] || 'bg-gray-100 text-gray-700 border-gray-200'}>
        {displayText}
      </Badge>
    );
  };

  const getSourceBadge = (source: string) => {
    const sourceMap = {
      'telesales': 'bg-green-100 text-green-700 border-green-200',
      'facebook': 'bg-blue-100 text-blue-700 border-blue-200',
      'web': 'bg-purple-100 text-purple-700 border-purple-200',
      'email': 'bg-orange-100 text-orange-700 border-orange-200',
      'referral': 'bg-pink-100 text-pink-700 border-pink-200',
      'other': 'bg-gray-100 text-gray-700 border-gray-200'
    };

    const sourceKey = source as keyof typeof sourceMap;
    return (
      <Badge variant="outline" className={sourceMap[sourceKey] || 'bg-gray-100 text-gray-700 border-gray-200'}>
        {t(`source.${source}`)}
      </Badge>
    );
  };

  return { getStatusBadge, getSourceBadge };
};
