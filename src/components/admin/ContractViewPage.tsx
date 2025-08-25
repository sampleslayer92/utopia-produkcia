
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useContractData } from "@/hooks/useContractData";
import { useDisplayValue } from "@/utils/displayUtils";
import { User, Building } from "lucide-react";
import ContractHeader from "./contract-view/ContractHeader";
import { useTranslation } from 'react-i18next';

const ContractViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const contractDataResult = useContractData(id!);
  const displayValue = useDisplayValue();
  const { t } = useTranslation('common');

  if (contractDataResult.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
          <span>{t('status.loading')}</span>
        </div>
      </div>
    );
  }

  if (contractDataResult.isError || !contractDataResult.data) {
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

  const { contract, onboardingData } = contractDataResult.data;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <ContractHeader
        contract={contract}
        onBack={() => navigate('/admin')}
        onEdit={() => navigate(`/admin/contract/${id}/edit`)}
        onPrint={() => window.print()}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-8">
          {/* Client Information */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader className="border-b border-slate-200">
              <CardTitle className="text-xl text-blue-900 flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informácie o klientovi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Information Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Kontaktné údaje</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Meno a priezvisko</Label>
                        <p className="text-slate-900 mt-1">
                          {onboardingData.contactInfo.salutation && `${onboardingData.contactInfo.salutation} `}
                          {displayValue(onboardingData.contactInfo.firstName) || displayValue(null)} {displayValue(onboardingData.contactInfo.lastName) || displayValue(null)}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Email</Label>
                        <p className="text-slate-900 mt-1">{displayValue(onboardingData.contactInfo.email)}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Telefón</Label>
                        <p className="text-slate-900 mt-1">
                          {onboardingData.contactInfo.phone ? 
                            `${onboardingData.contactInfo.phonePrefix} ${onboardingData.contactInfo.phone}` : 
                            displayValue(null)
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Information Section */}
                <div className="space-y-6 border-t md:border-t-0 md:border-l border-slate-200 pt-6 md:pt-0 md:pl-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Building className="h-4 w-4 text-slate-600" />
                    <h3 className="font-semibold text-slate-900">Informácie o spoločnosti</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-sm font-medium text-slate-600">Názov spoločnosti</Label>
                        <p className="text-slate-900 mt-1">{displayValue(onboardingData.companyInfo.companyName)}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-600">IČO</Label>
                          <p className="text-slate-900 mt-1">{displayValue(onboardingData.companyInfo.ico)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-600">DIČ</Label>
                          <p className="text-slate-900 mt-1">{displayValue(onboardingData.companyInfo.dic)}</p>
                        </div>
                      </div>
                      {onboardingData.companyInfo.address && (
                        <div>
                          <Label className="text-sm font-medium text-slate-600">Adresa sídla</Label>
                          <p className="text-slate-900 mt-1">
                            {displayValue(onboardingData.companyInfo.address.street)}<br />
                            {displayValue(onboardingData.companyInfo.address.zipCode)} {displayValue(onboardingData.companyInfo.address.city)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Device Selection Summary */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
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
                  {t('status.none')}
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
