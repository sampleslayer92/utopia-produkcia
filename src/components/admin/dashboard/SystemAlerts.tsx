
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface SystemAlertsProps {
  stats: {
    submitted: number;
  } | undefined;
}

const SystemAlerts = ({ stats }: SystemAlertsProps) => {
  const systemAlerts = [
    { 
      type: "info", 
      message: `${stats?.submitted || 0} zmlúv čaká na schválenie`, 
      priority: "medium" 
    },
    { 
      type: "success", 
      message: "Systém funguje bez problémov", 
      priority: "low" 
    },
  ];

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 flex items-center text-lg">
          <AlertCircle className="h-5 w-5 mr-2 text-amber-600" />
          Upozornenia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {systemAlerts.map((alert, index) => (
            <div key={index} className={`p-3 rounded-lg border-l-4 ${
              alert.priority === 'high' 
                ? 'border-red-500 bg-red-50/50' 
                : alert.priority === 'medium'
                ? 'border-amber-500 bg-amber-50/50'
                : 'border-emerald-500 bg-emerald-50/50'
            }`}>
              <p className="text-sm text-slate-900 mb-2">{alert.message}</p>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  alert.priority === 'high' 
                    ? 'border-red-200 text-red-700' 
                    : alert.priority === 'medium'
                    ? 'border-amber-200 text-amber-700'
                    : 'border-emerald-200 text-emerald-700'
                }`}
              >
                {alert.priority === 'high' ? 'vysoká' : alert.priority === 'medium' ? 'stredná' : 'nízka'} priorita
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemAlerts;
