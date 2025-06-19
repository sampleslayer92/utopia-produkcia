
import { useTranslation } from 'react-i18next';

const ContractDetailError = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="max-w-md text-center p-6">
        <p className="text-slate-600 mb-4">
          {t('table.error', { message: 'Contract not found' })}
        </p>
      </div>
    </div>
  );
};

export default ContractDetailError;
