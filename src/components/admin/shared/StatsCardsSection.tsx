import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

interface StatsCardsSectionProps {
  stats: StatCard[];
  isLoading?: boolean;
}

const StatsCardsSection = ({ stats, isLoading = false }: StatsCardsSectionProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3">
              <div className="animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 bg-slate-200 rounded-lg" />
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
                <div className="h-5 w-12 bg-slate-200 rounded mb-1" />
                <div className="h-2 w-20 bg-slate-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {stats.map((stat, index) => (
        <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-lg ${stat.iconColor}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-xs font-medium text-slate-700 truncate">{stat.title}</h3>
            </div>
            
            <div className="space-y-0.5">
              <p className="text-lg font-bold text-slate-900">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-xs text-slate-600 truncate">{stat.subtitle}</p>
              )}
              {stat.trend && (
                <div className="flex items-center gap-1">
                  <span className={`text-xs font-medium ${
                    stat.trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.trend.isPositive ? '+' : ''}{stat.trend.value}
                  </span>
                  <span className="text-xs text-slate-500 truncate">oproti minulému mesiacu</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsCardsSection;