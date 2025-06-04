
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RecentActivityProps {
  stats: {
    total: number;
  } | undefined;
}

const RecentActivity = ({ stats }: RecentActivityProps) => {
  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 text-lg">Posledná aktivita</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 text-sm">
            <div className="h-2 w-2 bg-emerald-500 rounded-full"></div>
            <span className="text-slate-600">Systém spustený</span>
            <span className="text-slate-400 ml-auto">práve teraz</span>
          </div>
          {stats?.total && stats.total > 0 && (
            <div className="flex items-center space-x-3 text-sm">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">Načítané {stats.total} zmlúv</span>
              <span className="text-slate-400 ml-auto">pred chvíľou</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
