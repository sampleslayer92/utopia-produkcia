
import { Card, CardContent } from "@/components/ui/card";
import { Euro, FileText, Smartphone, TrendingUp } from "lucide-react";
import type { MerchantContract } from "@/hooks/useMerchantContracts";

interface MerchantStatsCardsProps {
  contracts: MerchantContract[];
}

const MerchantStatsCards = ({ contracts }: MerchantStatsCardsProps) => {
  const totalContracts = contracts.length;
  const totalMonthlyProfit = contracts.reduce((sum, contract) => 
    sum + contract.total_monthly_profit, 0);
  const totalDevices = contracts.reduce((sum, contract) => 
    sum + contract.total_devices, 0);
  const avgContractValue = totalContracts > 0 ? totalMonthlyProfit / totalContracts : 0;

  const stats = [
    {
      title: "Celkový mesačný zisk",
      value: `€${totalMonthlyProfit.toFixed(2)}`,
      icon: Euro,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      title: "Počet zmlúv",
      value: totalContracts.toString(),
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Celkový počet zariadení",
      value: totalDevices.toString(),
      icon: Smartphone,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      title: "Priemerná hodnota zmluvy",
      value: `€${avgContractValue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    }
  ];

  return (
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
  );
};

export default MerchantStatsCards;
