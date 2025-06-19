
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro, FileText, Smartphone, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface MerchantStatsProps {
  statistics: {
    total_contracts: number;
    total_monthly_profit: number;
    total_devices: number;
    avg_contract_value: number;
    latest_contract_date: string | null;
  };
}

const MerchantStats = ({ statistics }: MerchantStatsProps) => {
  const stats = [
    {
      title: "Celkový mesačný zisk",
      value: `€${statistics.total_monthly_profit.toFixed(2)}`,
      icon: Euro,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Počet zmlúv",
      value: statistics.total_contracts.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Celkový počet zariadení",
      value: statistics.total_devices.toString(),
      icon: Smartphone,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Priemerná hodnota zmluvy",
      value: `€${statistics.avg_contract_value.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {statistics.latest_contract_date && (
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2 text-slate-600">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">
                Posledná zmluva vytvorená: {format(new Date(statistics.latest_contract_date), 'dd.MM.yyyy HH:mm')}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MerchantStats;
