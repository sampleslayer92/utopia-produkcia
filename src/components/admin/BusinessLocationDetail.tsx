import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Euro, 
  CreditCard, 
  Clock, 
  Calendar,
  FileText,
  Banknote
} from "lucide-react";
import { useBusinessLocationDetail } from "@/hooks/useBusinessLocationDetail";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

interface BusinessLocationDetailProps {
  locationId: string;
}

const BusinessLocationDetail = ({ locationId }: BusinessLocationDetailProps) => {
  const { data: location, isLoading, error } = useBusinessLocationDetail(locationId);
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !location) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-red-600">{t('status.error')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-600">
            {error?.message || "Prevádzka nebola nájdená"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            {location.name}
          </CardTitle>
          <div className="flex items-center space-x-4 text-sm text-slate-600">
            <span>Vytvorené: {format(new Date(location.created_at), 'dd.MM.yyyy')}</span>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {location.business_sector}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Adresa
              </h3>
              <div className="space-y-1 text-slate-600">
                <p>{location.address_street}</p>
                <p>{location.address_zip_code} {location.address_city}</p>
              </div>
            </div>

            {/* Contact Person */}
            <div>
              <h3 className="font-medium text-slate-900 mb-3 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Kontaktná osoba
              </h3>
              <div className="space-y-2">
                <p className="font-medium text-slate-900">{location.contact_person_name}</p>
                <div className="flex items-center text-sm text-slate-600">
                  <Mail className="h-3 w-3 mr-2" />
                  {location.contact_person_email}
                </div>
                {location.contact_person_phone && (
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-3 w-3 mr-2" />
                    {location.contact_person_phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Details */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Euro className="h-5 w-5 mr-2" />
            Obchodné údaje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-slate-600 mb-1">Plánovaný obrat</p>
              <div className="flex items-center">
                <Euro className="h-4 w-4 text-emerald-600 mr-2" />
                <span className="font-medium text-emerald-600">
                  €{location.estimated_turnover.toLocaleString()}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-1">Priemerná transakcia</p>
              <div className="flex items-center">
                <Euro className="h-4 w-4 text-emerald-600 mr-2" />
                <span className="font-medium text-emerald-600">
                  €{location.average_transaction.toFixed(2)}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-slate-600 mb-1">POS terminál</p>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-slate-500 mr-2" />
                <Badge 
                  variant={location.has_pos ? "default" : "secondary"}
                  className={location.has_pos ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                >
                  {location.has_pos ? "Áno" : "Nie"}
                </Badge>
              </div>
            </div>
          </div>

          {location.iban && (
            <div className="mt-6">
              <p className="text-sm text-slate-600 mb-1">IBAN</p>
              <div className="flex items-center">
                <Banknote className="h-4 w-4 text-slate-500 mr-2" />
                <span className="font-mono text-slate-900">{location.iban}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Opening Hours */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Otváracie hodiny
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line text-slate-700">
            {location.opening_hours}
          </div>
          
          {location.seasonality !== 'year-round' && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center text-amber-800">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="font-medium">Sezónnosť: {location.seasonality}</span>
              </div>
              {location.seasonal_weeks && (
                <p className="text-sm text-amber-700 mt-1">
                  Počet týždňov: {location.seasonal_weeks}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Merchant & Contract Info */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Informácie o zmluve a merchantovi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-slate-900 mb-3">Merchant</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Názov:</span>
                  <span className="font-medium text-slate-900">{location.contract.merchant.company_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">IČO:</span>
                  <span className="text-slate-900">{location.contract.merchant.ico || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Kontakt:</span>
                  <span className="text-slate-900">{location.contract.merchant.contact_person_name}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/admin/merchant/${location.contract.merchant_id}/view`)}
                  className="w-full mt-2"
                >
                  Detail merchanta
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-slate-900 mb-3">Zmluva</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Číslo zmluvy:</span>
                  <span className="font-medium text-slate-900">{location.contract.contract_number}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status:</span>
                  <Badge 
                    variant="outline" 
                    className={
                      location.contract.status === 'submitted' 
                        ? "border-green-200 text-green-700 bg-green-50" 
                        : "border-yellow-200 text-yellow-700 bg-yellow-50"
                    }
                  >
                    {location.contract.status}
                  </Badge>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate(`/admin/contract/${location.contract.id}/view`)}
                  className="w-full mt-2"
                >
                  Detail zmluvy
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessLocationDetail;