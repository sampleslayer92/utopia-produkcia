
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import MerchantOverview from "./MerchantOverview";
import QuickActions from "./QuickActions";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-6">
      {/* Quick Actions Header */}
      <QuickActions />
      
      {/* Business Metrics */}
      <section>
        <div className="mb-3">
          <h2 className="text-xl font-bold text-foreground mb-1">{t('dashboard.sections.businessMetrics')}</h2>
        </div>
        <BusinessMetrics />
      </section>
      
      {/* Revenue Charts */}
      <section>
        <div className="mb-3">
          <h2 className="text-xl font-bold text-foreground mb-1">{t('dashboard.sections.revenueAnalytics')}</h2>
        </div>
        <RevenueChart />
      </section>
      
      {/* Merchant Overview */}
      <section>
        <div className="mb-3">
          <h2 className="text-xl font-bold text-foreground mb-1">{t('dashboard.sections.merchantOverview')}</h2>
        </div>
        <MerchantOverview />
      </section>
    </div>
  );
};

export default NewDashboardContent;
