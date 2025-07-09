
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import MerchantOverview from "./MerchantOverview";
import QuickActions from "./QuickActions";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Business Metrics */}
      <BusinessMetrics />
      
      {/* Revenue Charts & Merchant Overview */}
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <MerchantOverview />
        </div>
      </div>
    </div>
  );
};

export default NewDashboardContent;
