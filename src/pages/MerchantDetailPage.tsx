
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Loader2, Building2, User, Mail, Phone, MapPin } from "lucide-react";
import { useMerchantDetail } from "@/hooks/useMerchantDetail";
import MerchantStats from "@/components/admin/MerchantStats";
import MerchantContracts from "@/components/admin/MerchantContracts";

const MerchantDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: merchantData, isLoading, error } = useMerchantDetail(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Načítavam detail merchanta...</span>
        </div>
      </div>
    );
  }

  if (error || !merchantData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Chyba</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Nepodarilo sa načítať detail merchanta.
            </p>
            <Button onClick={() => navigate('/admin/merchants')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na zoznam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { merchant, statistics } = merchantData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin/merchants')}
                className="border-slate-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Späť na zoznam
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900 flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  {merchant.company_name}
                </h1>
                <p className="text-sm text-slate-600">
                  IČO: {merchant.ico || 'N/A'} • {statistics.total_contracts} zmlúv
                </p>
              </div>
            </div>
            
            <Button 
              onClick={() => navigate('/onboarding')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nová zmluva
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6 space-y-6">
        {/* Merchant Basic Info */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Základné informácie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Názov spoločnosti</label>
                  <p className="text-slate-900 font-medium">{merchant.company_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">IČO</label>
                  <p className="text-slate-900">{merchant.ico || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">DIČ</label>
                  <p className="text-slate-900">{merchant.dic || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Kontaktná osoba
                  </label>
                  <p className="text-slate-900 font-medium">{merchant.contact_person_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </label>
                  <p className="text-slate-900">{merchant.contact_person_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <Phone className="h-4 w-4 mr-1" />
                    Telefón
                  </label>
                  <p className="text-slate-900">{merchant.contact_person_phone || 'N/A'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Adresa
                  </label>
                  <div className="text-slate-900">
                    {merchant.address_street && <p>{merchant.address_street}</p>}
                    {merchant.address_city && (
                      <p>
                        {merchant.address_zip_code && `${merchant.address_zip_code} `}
                        {merchant.address_city}
                      </p>
                    )}
                    {!merchant.address_street && !merchant.address_city && <p>N/A</p>}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <MerchantStats statistics={statistics} />

        {/* Contracts */}
        <MerchantContracts contracts={merchantData.contracts} />
      </div>
    </div>
  );
};

export default MerchantDetailPage;
