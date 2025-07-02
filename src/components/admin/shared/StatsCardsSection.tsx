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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 bg-slate-200 rounded-lg" />
                  <div className="h-4 w-20 bg-slate-200 rounded" />
                </div>
                <div className="h-8 w-16 bg-slate-200 rounded mb-2" />
                <div className="h-3 w-24 bg-slate-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${stat.iconColor}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-medium text-slate-700">{stat.title}</h3>
            </div>
            
            <div className="space-y-1">
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              {stat.subtitle && (
                <p className="text-sm text-slate-600">{stat.subtitle}</p>
              )}
              {stat.trend && (
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-medium ${
                    stat.trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.trend.isPositive ? '+' : ''}{stat.trend.value}
                  </span>
                  <span className="text-xs text-slate-500">oproti minulému mesiacu</span>
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