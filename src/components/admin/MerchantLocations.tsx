
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MapPin, CreditCard, Building2, Euro, Clock, Mail, Phone, User } from "lucide-react";
import { BusinessLocation } from "@/hooks/useMerchantDetail";

interface MerchantLocationsProps {
  locations: BusinessLocation[];
}

const MerchantLocations = ({ locations }: MerchantLocationsProps) => {
  if (!locations || locations.length === 0) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Prevádzky
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-slate-500">
            <Building2 className="h-12 w-12 mb-4" />
            <p>Žiadne prevádzky</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Prevádzky ({locations.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="font-medium text-slate-700">Názov prevádzky</TableHead>
                <TableHead className="font-medium text-slate-700">Adresa</TableHead>
                <TableHead className="font-medium text-slate-700">Sektor</TableHead>
                <TableHead className="font-medium text-slate-700">Obrat</TableHead>
                <TableHead className="font-medium text-slate-700">POS</TableHead>
                <TableHead className="font-medium text-slate-700">Zmluva</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id} className="hover:bg-slate-50/50">
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
                      {location.contact_person_phone && (
                        <div className="flex items-center text-sm text-slate-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {location.contact_person_phone}
                        </div>
                      )}
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
                        {location.has_pos ? "Áno" : "Nie"}
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
        
        {locations.length > 0 && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <Building2 className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-slate-600">Celkom prevádzkových miest:</span>
                <span className="font-medium text-slate-900 ml-1">{locations.length}</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-slate-600">S POS terminálom:</span>
                <span className="font-medium text-slate-900 ml-1">
                  {locations.filter(l => l.has_pos).length}
                </span>
              </div>
              <div className="flex items-center">
                <Euro className="h-4 w-4 text-slate-500 mr-2" />
                <span className="text-slate-600">Celkový plánovaný obrat:</span>
                <span className="font-medium text-slate-900 ml-1">
                  €{locations.reduce((sum, l) => sum + (l.estimated_turnover || 0), 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MerchantLocations;
