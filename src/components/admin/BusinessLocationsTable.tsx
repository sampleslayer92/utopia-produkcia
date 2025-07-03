import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, MapPin, Euro, CreditCard, User, Phone, Mail } from "lucide-react";
import { useBusinessLocations } from "@/hooks/useBusinessLocations";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

interface BusinessLocationsTableProps {
  filters: {
    merchant?: string;
    sector?: string;
    hasPos?: string;
    search?: string;
  };
}

const BusinessLocationsTable = ({ filters }: BusinessLocationsTableProps) => {
  const { data: locations, isLoading, error } = useBusinessLocations(filters);
  const navigate = useNavigate();
  const { t } = useTranslation('ui');

  const handleRowClick = (locationId: string) => {
    navigate(`/admin/merchants/location/${locationId}/view`);
  };

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.businessLocations')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('table.loadingLocations')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.businessLocations')}</CardTitle>
          <CardDescription className="text-red-600">
            {t('table.errorLoadingLocations')}: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900">{t('table.businessLocations')}</CardTitle>
          <CardDescription className="text-slate-600">
            {t('table.noLocationsCreated')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
            <Building2 className="h-12 w-12 mb-4" />
            <p>{t('table.noBusinessLocations')}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">{t('table.businessLocations')}</CardTitle>
        <CardDescription className="text-slate-600">
          {t('table.locationsOverview', { count: locations.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">{t('table.location')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.merchant')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.address')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.sector')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.turnover')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.pos')}</TableHead>
                <TableHead className="font-medium text-slate-700">{t('table.contract')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow 
                  key={location.id} 
                  className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(location.id)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{location.name}</p>
                      <div className="flex items-center text-sm text-slate-600 mt-1">
                        <User className="h-3 w-3 mr-1" />
                        {location.contact_person_name}
                      </div>
                      {location.contact_person_email && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {location.contact_person_email}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-slate-500" />
                      <span className="font-medium text-slate-900">{location.merchant_name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-slate-500 mt-0.5" />
                      <div className="text-sm">
                        <p className="text-slate-900">{location.address_street}</p>
                        <p className="text-slate-600">
                          {location.address_zip_code} {location.address_city}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      {location.business_sector}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Euro className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-emerald-600">
                        €{(location.estimated_turnover || 0).toLocaleString()}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                      <Badge 
                        variant={location.has_pos ? "default" : "secondary"}
                        className={location.has_pos ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}
                      >
                        {location.has_pos ? t('table.yes') : t('table.no')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium text-slate-900">{location.contract_number}</p>
                      <Badge 
                        variant="outline" 
                        className={
                          location.contract_status === 'submitted' 
                            ? "border-green-200 text-green-700 bg-green-50" 
                            : "border-yellow-200 text-yellow-700 bg-yellow-50"
                        }
                      >
                        {location.contract_status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default BusinessLocationsTable;