
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Calendar } from "lucide-react";
import { 
  Users, 
  Building, 
  CreditCard, 
  FileText
} from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    submitted: number;
    approved: number;
    draft: number;
    recentContracts: number;
  } | undefined;
  statsLoading: boolean;
}

const StatsCards = ({ stats, statsLoading }: StatsCardsProps) => {
  const { t } = useTranslation('admin');

  const statsCards = [
    {
      title: t('stats.totalContracts'),
      value: statsLoading ? "..." : (stats?.total.toString() || "0"),
      change: statsLoading ? "..." : t('stats.recentChange', { count: stats?.recentContracts || 0 }),
      icon: FileText,
      trend: "up",
      color: "emerald"
    },
    {
      title: t('stats.submittedContracts'),
      value: statsLoading ? "..." : (stats?.submitted.toString() || "0"),
      change: t('stats.waitingApproval'),
      icon: CreditCard,
      trend: "up",
      color: "blue"
    },
    {
      title: t('stats.approvedContracts'),
      value: statsLoading ? "..." : (stats?.approved.toString() || "0"),
      change: t('stats.activeContracts'),
      icon: Building,
      trend: "up",
      color: "green"
    },
    {
      title: t('stats.drafts'),
      value: statsLoading ? "..." : (stats?.draft.toString() || "0"),
      change: t('stats.incomplete'),
      icon: Users,
      trend: "neutral",
      color: "gray"
    }
  ];

  const getCardColorClasses = (color: string) => {
    switch (color) {
      case 'emerald':
        return "bg-emerald-100 text-emerald-600";
      case 'blue':
        return "bg-blue-100 text-blue-600";
      case 'green':
        return "bg-green-100 text-green-600";
      case 'gray':
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-emerald-100 text-emerald-600";
    }
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((stat, index) => (
        <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</p>
                <p className={`text-sm flex items-center ${
                  stat.trend === 'up' ? 'text-emerald-600' : 'text-slate-500'
                }`}>
                  {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {stat.trend === 'neutral' && <Calendar className="h-3 w-3 mr-1" />}
                  {stat.change}
                </p>
              </div>
              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${getCardColorClasses(stat.color)}`}>
                <stat.icon className="h-7 w-7" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;
