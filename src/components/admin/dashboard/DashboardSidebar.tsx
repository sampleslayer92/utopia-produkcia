
import SystemAlerts from "./SystemAlerts";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";

interface DashboardSidebarProps {
  stats: {
    total: number;
    submitted: number;
    approved: number;
    draft: number;
    recentContracts: number;
  } | undefined;
}

const DashboardSidebar = ({ stats }: DashboardSidebarProps) => {
  return (
    <div className="space-y-6">
      <SystemAlerts stats={stats} />
      <QuickActions />
      <RecentActivity stats={stats} />
    </div>
  );
};

export default DashboardSidebar;
