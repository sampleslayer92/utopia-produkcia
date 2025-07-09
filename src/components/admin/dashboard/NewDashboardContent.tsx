
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import MerchantOverview from "./MerchantOverview";
import QuickActions from "./QuickActions";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-8 p-6 bg-gray-50/30">
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
  );
};

export default NewDashboardContent;
