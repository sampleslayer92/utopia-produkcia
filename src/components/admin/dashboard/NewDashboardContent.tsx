
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import TeamPerformance from "./TeamPerformance";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');

  return (
    <div className="space-y-6">
      {/* Business Metrics */}
      <BusinessMetrics />
      
      {/* Revenue Charts */}
      <RevenueChart />
      
      {/* Team Performance */}
      <TeamPerformance />
    </div>
  );
};

export default NewDashboardContent;
