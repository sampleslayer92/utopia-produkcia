
import { Badge } from "@/components/ui/badge";

interface ContractStatusBadgeProps {
  status: string;
}

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

const ContractStatusBadge = ({ status }: ContractStatusBadgeProps) => {
  return getStatusBadge(status);
};

export default ContractStatusBadge;
