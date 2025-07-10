
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import MerchantOverview from "./MerchantOverview";
import QuickActions from "./QuickActions";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Business Metrics */}
      <BusinessMetrics />
      
      {/* Revenue Charts */}
      <RevenueChart />
      
      {/* Merchant Overview */}
      <MerchantOverview />
    </div>
  );
};

export default NewDashboardContent;
