
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import MerchantOverview from "./MerchantOverview";
import QuickActions from "./QuickActions";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-12">
      {/* Quick Actions */}
      <section>
        <QuickActions />
      </section>
      
      {/* Business Metrics */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('dashboard.sections.businessMetrics')}</h2>
          <p className="text-muted-foreground">Key performance indicators for your business</p>
        </div>
        <BusinessMetrics />
      </section>
      
      {/* Revenue Charts */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('dashboard.sections.revenueAnalytics')}</h2>
          <p className="text-muted-foreground">Financial performance and trends</p>
        </div>
        <RevenueChart />
      </section>
      
      {/* Merchant Overview */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">{t('dashboard.sections.merchantOverview')}</h2>
          <p className="text-muted-foreground">Top performing merchants and geographic insights</p>
        </div>
        <MerchantOverview />
      </section>
    </div>
  );
};

export default NewDashboardContent;
