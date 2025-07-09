
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import MerchantOverview from "./MerchantOverview";
import QuickActions from "./QuickActions";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto space-y-12 p-8">
        {/* Quick Actions */}
        <section>
          <QuickActions />
        </section>
        
        {/* Business Metrics */}
        <section>
          <BusinessMetrics />
        </section>
        
        {/* Revenue Charts */}
        <section>
          <RevenueChart />
        </section>
        
        {/* Merchant Overview */}
        <section>
          <MerchantOverview />
        </section>
      </div>
    </div>
  );
};

export default NewDashboardContent;
