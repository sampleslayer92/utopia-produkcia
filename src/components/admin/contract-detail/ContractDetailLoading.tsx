
import { useTranslation } from 'react-i18next';

const ContractDetailLoading = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="flex items-center space-x-2">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <span>{t('table.loading')}</span>
      </div>
    </div>
  );
};

export default ContractDetailLoading;
