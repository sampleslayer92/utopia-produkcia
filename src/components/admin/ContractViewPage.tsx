
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useContractData } from "@/hooks/useContractData";
import ContractHeader from "./contract-view/ContractHeader";

const ContractViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contractData, isLoading, error } = useContractData(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
          <span>Načítavam zmluvu...</span>
        </div>
      </div>
    );
  }

  if (error || !contractData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6">
            <p className="text-slate-600 mb-4">
              Zmluva nebola nájdená alebo sa nepodarilo načítať údaje.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { contract, onboardingData } = contractData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onBack={() => navigate('/admin')}
        onEdit={() => navigate(`/admin/contract/${id}/edit`)}
        onPrint={() => window.print()}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Kontaktné údaje</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Meno a priezvisko</label>
                  <p className="text-slate-900">
                    {onboardingData.contactInfo.salutation && `${onboardingData.contactInfo.salutation} `}
                    {onboardingData.contactInfo.firstName} {onboardingData.contactInfo.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Email</label>
                  <p className="text-slate-900">{onboardingData.contactInfo.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600">Telefón</label>
                  <p className="text-slate-900">
                    {onboardingData.contactInfo.phonePrefix} {onboardingData.contactInfo.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Informácie o spoločnosti</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-slate-600">Názov spoločnosti</label>
                  <p className="text-slate-900">{onboardingData.companyInfo.companyName}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">IČO</label>
                    <p className="text-slate-900">{onboardingData.companyInfo.ico}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600">DIČ</label>
                    <p className="text-slate-900">{onboardingData.companyInfo.dic}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Selection Summary */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-900 mb-4">Výber zariadení a služieb</h3>
              {onboardingData.deviceSelection.dynamicCards.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {onboardingData.deviceSelection.dynamicCards
                    .filter(card => card.type === 'device')
                    .map((card, index) => (
                      <div key={index} className="text-center p-4 bg-slate-50/50 rounded-lg">
                        <h4 className="font-medium text-slate-900">{card.name}</h4>
                        <p className="text-2xl font-bold text-emerald-600">
                          {card.count}
                        </p>
                        <p className="text-sm text-slate-600">
                          {card.monthlyFee} €/mes
                        </p>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-slate-600 text-center py-4">
                  Žiadne zariadenia neboli vybrané
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractViewPage;
