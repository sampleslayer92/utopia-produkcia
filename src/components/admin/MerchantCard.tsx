
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Mail, User, Euro, FileText, Phone, MapPin } from "lucide-react";
import { Merchant } from "@/hooks/useMerchantsData";
import { format } from "date-fns";

interface MerchantCardProps {
  merchant: Merchant;
  onClick: (merchant: Merchant) => void;
}

const MerchantCard = ({ merchant, onClick }: MerchantCardProps) => {
  const { t } = useTranslation('admin');

  return (
    <Card 
      className="group border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300/60 hover:bg-white/90 hover:-translate-y-0.5"
      onClick={() => onClick(merchant)}
    >
      <CardContent className="p-5">
        {/* Header with gradient background */}
        <div className="flex items-start justify-between mb-4 p-3 -m-3 rounded-lg bg-gradient-to-r from-slate-50/50 to-blue-50/30">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate text-lg">{merchant.company_name}</h3>
              {merchant.address_city && (
                <div className="flex items-center text-sm text-slate-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{merchant.address_city}</span>
                </div>
              )}
            </div>
          </div>
          <Badge 
            variant="secondary" 
            className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-200 ml-3 flex-shrink-0 font-medium"
          >
            {merchant.contract_count || 0}
          </Badge>
        </div>

        {/* Contact Person with enhanced styling */}
        <div className="mb-4 p-3 rounded-lg bg-slate-50/50 border border-slate-100">
          <div className="flex items-center space-x-2 mb-2">
            <User className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-900 truncate">{merchant.contact_person_name}</span>
          </div>
          <div className="ml-6 space-y-1.5">
            <div className="flex items-center text-sm text-slate-600">
              <Mail className="h-3 w-3 mr-2 flex-shrink-0 text-slate-400" />
              <span className="truncate hover:text-blue-600 transition-colors">{merchant.contact_person_email}</span>
            </div>
            {merchant.contact_person_phone && (
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-3 w-3 mr-2 flex-shrink-0 text-slate-400" />
                <span className="truncate">{merchant.contact_person_phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* ICO and Profit with enhanced visual hierarchy */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50/50 to-emerald-50/30 border border-slate-100">
          <div className="text-sm">
            <span className="text-slate-500 font-medium">ICO:</span> 
            <span className="text-slate-700 ml-1 font-mono">{merchant.ico || 'N/A'}</span>
          </div>
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-emerald-200 border border-emerald-200">
            <Euro className="h-4 w-4 text-emerald-700" />
            <span className="font-semibold text-emerald-800">
              €{(merchant.total_monthly_profit || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer with improved spacing */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-500">
            <Calendar className="h-3 w-3 mr-1.5" />
            <span>{format(new Date(merchant.created_at), 'dd.MM.yyyy')}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <FileText className="h-3 w-3 mr-1.5" />
            <span>{merchant.contract_count || 0} {t('merchants.table.contracts')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantCard;
