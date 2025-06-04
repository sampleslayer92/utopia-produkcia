
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900 text-lg">Rýchle akcie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          onClick={() => navigate('/onboarding')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Vytvoriť novú zmluvu
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          disabled
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Generovať reporty
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          disabled
        >
          <Users className="h-4 w-4 mr-2" />
          Spravovať používateľov
        </Button>
        <Button 
          variant="outline" 
          className="w-full justify-start border-slate-300 hover:bg-slate-50"
          disabled
        >
          <Settings className="h-4 w-4 mr-2" />
          Nastavenia systému
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
