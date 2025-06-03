
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, FileText, Printer } from "lucide-react";
import { useContractData } from "@/hooks/useContractData";
import { format } from "date-fns";

const ContractViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contractData, isLoading, error } = useContractData(id!);

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
          <CardHeader>
            <CardTitle className="text-red-600">Chyba</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Zmluva nebola nájdená alebo sa nepodarilo načítať údaje.
            </p>
            <Button onClick={() => navigate('/admin')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na zoznam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { contract, onboardingData } = contractData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
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
                onClick={() => navigate(`/admin/contract/${id}/edit`)}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editovať
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="border-slate-300"
              >
                <Printer className="h-4 w-4 mr-2" />
                Tlačiť
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Kontaktné údaje</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
              {onboardingData.contactInfo.salesNote && (
                <div>
                  <label className="text-sm font-medium text-slate-600">Poznámka</label>
                  <p className="text-slate-900">{onboardingData.contactInfo.salesNote}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Informácie o spoločnosti</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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
              <div>
                <label className="text-sm font-medium text-slate-600">Adresa</label>
                <p className="text-slate-900">
                  {onboardingData.companyInfo.address.street}, {onboardingData.companyInfo.address.city} {onboardingData.companyInfo.address.zipCode}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-600">Kontaktná osoba</label>
                <p className="text-slate-900">{onboardingData.companyInfo.contactPerson.name}</p>
                <p className="text-sm text-slate-600">{onboardingData.companyInfo.contactPerson.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Business Locations */}
          {onboardingData.businessLocations.length > 0 && (
            <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-slate-900">Prevádzkové miesta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {onboardingData.businessLocations.map((location, index) => (
                    <div key={location.id} className="border rounded-lg p-4 bg-slate-50/50">
                      <h4 className="font-medium text-slate-900 mb-2">{location.name}</h4>
                      <p className="text-sm text-slate-600 mb-1">
                        {location.address.street}, {location.address.city} {location.address.zipCode}
                      </p>
                      <p className="text-sm text-slate-600">
                        Sektor: {location.businessSector}
                      </p>
                      <p className="text-sm text-slate-600">
                        Očakávaný obrat: {location.estimatedTurnover} €
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Device Selection Summary */}
          <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-slate-900">Výber zariadení</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {onboardingData.deviceSelection.terminals.paxA920Pro.count > 0 && (
                  <div className="text-center p-4 bg-slate-50/50 rounded-lg">
                    <h4 className="font-medium text-slate-900">PAX A920 Pro</h4>
                    <p className="text-2xl font-bold text-emerald-600">
                      {onboardingData.deviceSelection.terminals.paxA920Pro.count}
                    </p>
                    <p className="text-sm text-slate-600">
                      {onboardingData.deviceSelection.terminals.paxA920Pro.monthlyFee} €/mes
                    </p>
                  </div>
                )}
                {onboardingData.deviceSelection.terminals.paxA80.count > 0 && (
                  <div className="text-center p-4 bg-slate-50/50 rounded-lg">
                    <h4 className="font-medium text-slate-900">PAX A80</h4>
                    <p className="text-2xl font-bold text-emerald-600">
                      {onboardingData.deviceSelection.terminals.paxA80.count}
                    </p>
                    <p className="text-sm text-slate-600">
                      {onboardingData.deviceSelection.terminals.paxA80.monthlyFee} €/mes
                    </p>
                  </div>
                )}
                {(onboardingData.deviceSelection.tablets.tablet10.count + 
                  onboardingData.deviceSelection.tablets.tablet15.count + 
                  onboardingData.deviceSelection.tablets.tabletPro15.count) > 0 && (
                  <div className="text-center p-4 bg-slate-50/50 rounded-lg">
                    <h4 className="font-medium text-slate-900">Tablety</h4>
                    <p className="text-2xl font-bold text-emerald-600">
                      {onboardingData.deviceSelection.tablets.tablet10.count + 
                       onboardingData.deviceSelection.tablets.tablet15.count + 
                       onboardingData.deviceSelection.tablets.tabletPro15.count}
                    </p>
                    <p className="text-sm text-slate-600">Rôzne typy</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContractViewPage;
