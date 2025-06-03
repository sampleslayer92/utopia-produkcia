
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Printer } from "lucide-react";
import { format } from "date-fns";

interface ContractHeaderProps {
  contract: any;
  onBack: () => void;
  onEdit: () => void;
  onPrint: () => void;
}

const ContractHeader = ({ contract, onBack, onEdit, onPrint }: ContractHeaderProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Odoslané</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Schválené</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Zamietnuté</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Koncept</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="border-slate-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na zoznam
            </Button>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Zmluva #{contract.contract_number}
              </h1>
              <p className="text-sm text-slate-600">
                Vytvorená: {format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Stav:</span>
              {getStatusBadge(contract.status)}
            </div>
            
            <Button
              onClick={onEdit}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editovať
            </Button>
            
            <Button
              variant="outline"
              onClick={onPrint}
              className="border-slate-300"
            >
              <Printer className="h-4 w-4 mr-2" />
              Tlačiť
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ContractHeader;
