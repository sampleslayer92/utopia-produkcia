import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Building2, Users, BarChart3, Settings } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Nová zmluva",
      description: "Spustiť onboarding proces",
      icon: Plus,
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-white",
      onClick: () => navigate('/admin/onboarding')
    },
    {
      title: "Zmluvy",
      description: "Spravovať všetky zmluvy",
      icon: FileText,
      color: "bg-emerald-500 hover:bg-emerald-600",
      textColor: "text-white",
      onClick: () => navigate('/admin/merchants/contracts')
    },
    {
      title: "Merchanti",
      description: "Prehľad partnerov",
      icon: Building2,
      color: "bg-purple-500 hover:bg-purple-600",
      textColor: "text-white",
      onClick: () => navigate('/admin/merchants')
    },
    {
      title: "Prevádzky",
      description: "Správa lokácií",
      icon: BarChart3,
      color: "bg-orange-500 hover:bg-orange-600",
      textColor: "text-white",
      onClick: () => navigate('/admin/merchants/locations')
    },
    {
      title: "Tím",
      description: "Členovia tímu",
      icon: Users,
      color: "bg-cyan-500 hover:bg-cyan-600",
      textColor: "text-white",
      onClick: () => navigate('/admin/team/performance')
    }
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Rýchle akcie</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col items-center justify-center space-y-1 border-2 hover:scale-105 transition-all duration-200 ${action.color} border-transparent ${action.textColor}`}
              onClick={action.onClick}
            >
              <action.icon className="h-5 w-5" />
              <div className="text-center">
                <div className="font-medium text-xs">{action.title}</div>
                <div className="text-xs opacity-80">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;