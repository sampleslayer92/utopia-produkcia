import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, User, Calendar, Activity } from "lucide-react";

interface ContractHistoryTabProps {
  contractId: string;
}

const ContractHistoryTab = ({ contractId }: ContractHistoryTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            História zmien
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>História zmien bude dostupná čoskoro</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Aktivita používateľov
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aktivita používateľov bude dostupná čoskoro</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Timeline udalostí
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Timeline udalostí bude dostupný čoskoro</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractHistoryTab;