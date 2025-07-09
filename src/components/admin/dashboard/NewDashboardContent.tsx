
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import MerchantOverview from "./MerchantOverview";
import QuickActions from "./QuickActions";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-12 p-2">
      {/* Quick Actions */}
      <section className="animate-fade-in">
        <QuickActions />
      </section>
      
      {/* Business Metrics */}
      <section className="animate-fade-in-up">
        <BusinessMetrics />
      </section>
      
      {/* Revenue Charts */}
      <section className="animate-fade-in">
        <RevenueChart />
      </section>
      
      {/* Merchant Overview */}
      <section className="animate-fade-in-up">
        <MerchantOverview />
      </section>
    </div>
  );
};

export default NewDashboardContent;
