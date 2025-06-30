
import { Loader2 } from "lucide-react";
import { useMerchantAuth } from "@/hooks/useMerchantAuth";
import { useMerchantContracts } from "@/hooks/useMerchantContracts";
import MerchantHeader from "@/components/merchant/MerchantHeader";
import MerchantStatsCards from "@/components/merchant/MerchantStatsCards";
import MerchantContractsTable from "@/components/merchant/MerchantContractsTable";

const MerchantAuthenticatedDashboard = () => {
  const { data: merchantAuth, isLoading: isAuthLoading, error: authError } = useMerchantAuth();
  const { data: contracts = [], isLoading: isContractsLoading } = useMerchantContracts(
    merchantAuth?.merchant.id
  );

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Načítavam dashboard...</span>
        </div>
      </div>
    );
  }

  if (authError || !merchantAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Prístup zamietnutý
          </h2>
          <p className="text-slate-600 mb-4">
            Nemáte oprávnenie na prístup k merchant dashboard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <MerchantHeader merchantData={merchantAuth} />
      
      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <MerchantStatsCards contracts={contracts} />

        {/* Contracts Table */}
        {isContractsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Načítavam zmluvy...</span>
          </div>
        ) : (
          <MerchantContractsTable contracts={contracts} />
        )}
      </div>
    </div>
  );
};

export default MerchantAuthenticatedDashboard;
