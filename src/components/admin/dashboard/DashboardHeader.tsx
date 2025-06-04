
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-sm text-slate-600">Prehľad systému a správa zmlúv</p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
              <Activity className="h-3 w-3 mr-1" />
              Online
            </Badge>
            <Button 
              onClick={() => navigate('/onboarding')}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nová zmluva
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="outline"
              className="border-slate-300"
            >
              Domovská stránka
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
