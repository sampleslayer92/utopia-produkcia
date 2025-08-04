import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Loader2,
  Download,
  Eye,
  ArrowLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMerchantContracts } from "@/hooks/useMerchantContracts";
import { format } from "date-fns";

const MerchantContractsPage = () => {
  const navigate = useNavigate();
  const { data: contracts, isLoading } = useMerchantContracts();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-slate-600">Loading contracts...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'signed':
        return 'border-emerald-200 text-emerald-700';
      case 'approved':
        return 'border-blue-200 text-blue-700';
      case 'submitted':
        return 'border-amber-200 text-amber-700';
      case 'draft':
        return 'border-slate-200 text-slate-700';
      default:
        return 'border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/merchant')}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-violet-600 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Contracts</h1>
                <p className="text-sm text-slate-600">Manage your contracts and documents</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                Merchant
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-slate-900">All Contracts</CardTitle>
            <CardDescription className="text-slate-600">
              View and manage all your contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contracts?.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-24 w-24 text-slate-400 mx-auto mb-6" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No contracts found</h3>
                <p className="text-slate-600">Your contracts will appear here once they are created</p>
              </div>
            ) : (
              <div className="space-y-4">
                {contracts?.map((contract, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        contract.status === 'signed' 
                          ? 'bg-emerald-100 text-emerald-600'
                          : contract.status === 'approved'
                          ? 'bg-blue-100 text-blue-600'
                          : contract.status === 'submitted'
                          ? 'bg-amber-100 text-amber-600'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        <FileText className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-slate-900">{contract.contract_number}</h3>
                        <p className="text-sm text-slate-600">
                          {contract.contract_items_count} items • €{contract.total_monthly_profit.toFixed(2)}/month
                        </p>
                        <p className="text-xs text-slate-500">
                          Created: {format(new Date(contract.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="outline"
                        className={getStatusColor(contract.status)}
                      >
                        {contract.status}
                      </Badge>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        {contract.status === 'signed' && (
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MerchantContractsPage;