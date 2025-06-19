
import { useTranslation } from 'react-i18next';
import BusinessMetrics from "./BusinessMetrics";
import RevenueChart from "./RevenueChart";
import TeamPerformance from "./TeamPerformance";
import DashboardSidebar from "./DashboardSidebar";
import { useContractsStats } from "@/hooks/useContractsData";

const NewDashboardContent = () => {
  const { t } = useTranslation('admin');
  const { data: stats } = useContractsStats();

  return (
    <div className="grid lg:grid-cols-4 gap-6">
      {/* Main Content - Business Metrics and Charts */}
      <div className="lg:col-span-3 space-y-6">
        <BusinessMetrics />
        <RevenueChart />
      </div>

      {/* Sidebar - Team Performance and Quick Actions */}
      <div className="lg:col-span-1 space-y-6">
        <TeamPerformance />
        <DashboardSidebar stats={stats} />
      </div>
    </div>
  );
};

export default NewDashboardContent;
