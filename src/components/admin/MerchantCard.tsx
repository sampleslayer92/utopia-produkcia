import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Calendar, Mail, User, Euro, FileText, Phone, MapPin } from "lucide-react";
import { Merchant } from "@/hooks/useMerchantsData";
import { format } from "date-fns";

interface MerchantCardProps {
  merchant: Merchant;
  onClick: (merchantId: string) => void;
}

const MerchantCard = ({ merchant, onClick }: MerchantCardProps) => {
  const { t } = useTranslation('admin');

  return (
    <Card 
      className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-200"
      onClick={() => onClick(merchant.id)}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <Building2 className="h-5 w-5 text-slate-500 flex-shrink-0" />
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 truncate">{merchant.company_name}</h3>
              {merchant.address_city && (
                <div className="flex items-center text-sm text-slate-600 mt-1">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{merchant.address_city}</span>
                </div>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700 ml-2 flex-shrink-0">
            {t('merchants.table.contractsCount', { count: merchant.contract_count || 0 })}
          </Badge>
        </div>

        {/* Contact Person */}
        <div className="mb-3">
          <div className="flex items-center space-x-2 mb-1">
            <User className="h-4 w-4 text-slate-500 flex-shrink-0" />
            <span className="font-medium text-slate-900 truncate">{merchant.contact_person_name}</span>
          </div>
          <div className="ml-6 space-y-1">
            <div className="flex items-center text-sm text-slate-600">
              <Mail className="h-3 w-3 mr-1 flex-shrink-0" />
              <span className="truncate">{merchant.contact_person_email}</span>
            </div>
            {merchant.contact_person_phone && (
              <div className="flex items-center text-sm text-slate-600">
                <Phone className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">{merchant.contact_person_phone}</span>
              </div>
            )}
          </div>
        </div>

        {/* ICO and Profit */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-slate-600">
            <span className="font-medium">ICO:</span> {merchant.ico || 'N/A'}
          </div>
          <div className="flex items-center space-x-1">
            <Euro className="h-4 w-4 text-emerald-600" />
            <span className="font-semibold text-emerald-600">
              €{(merchant.total_monthly_profit || 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center text-xs text-slate-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{format(new Date(merchant.created_at), 'dd.MM.yyyy')}</span>
          </div>
          <div className="flex items-center text-xs text-slate-500">
            <FileText className="h-3 w-3 mr-1" />
            <span>{merchant.contract_count || 0} {t('merchants.table.contracts')}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MerchantCard;