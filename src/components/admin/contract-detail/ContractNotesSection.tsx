
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Calendar, User, Globe } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { useDisplayValue, formatDateValue } from "@/utils/displayUtils";
import EditableSection from "./EditableSection";
import { format } from "date-fns";

interface ContractNotesSectionProps {
  contract: any;
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const ContractNotesSection = ({ contract, onboardingData, isEditMode, onSave }: ContractNotesSectionProps) => {
  const { t } = useTranslation('admin');
  const displayValue = useDisplayValue();
  const contactInfo = onboardingData.contactInfo;

  const formatDisplayDate = (dateValue: any): string => {
    const cleanDate = formatDateValue(dateValue);
    if (!cleanDate) return displayValue(null);
    try {
      return format(new Date(cleanDate), 'dd.MM.yyyy HH:mm:ss');
    } catch {
      return displayValue(null);
    }
  };

  return (
    <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 backdrop-blur-sm">
      <CardHeader className="border-b border-indigo-200/60">
        <CardTitle className="flex items-center text-slate-900">
          <FileText className="h-5 w-5 mr-2 text-indigo-600" />
          {t('contractNotes.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Notes */}
          <div className="space-y-4">
            <h4 className="font-medium text-indigo-900 border-b border-indigo-200 pb-2">
              {t('contractNotes.notes')}
            </h4>
            
            <EditableSection isEditMode={isEditMode}>
              <div>
                <Label className="text-sm font-medium text-slate-600">{t('contractNotes.contractNotes')}</Label>
                {isEditMode ? (
                  <Textarea 
                    defaultValue={contract?.notes || ''} 
                    className="mt-1"
                    rows={4}
                    placeholder={t('contractNotes.contractNotesPlaceholder')}
                  />
                ) : (
                  <div className="mt-1 p-3 bg-slate-50 rounded border min-h-[100px]">
                    <p className="text-slate-900 whitespace-pre-wrap">
                      {displayValue(contract?.notes, 'contractNotes.noNotes')}
                    </p>
                  </div>
                )}
              </div>
            </EditableSection>

            <EditableSection isEditMode={isEditMode}>
              <div>
                <Label className="text-sm font-medium text-slate-600">{t('contractNotes.salesNotes')}</Label>
                {isEditMode ? (
                  <Textarea 
                    defaultValue={contactInfo?.salesNote || ''} 
                    className="mt-1"
                    rows={3}
                    placeholder={t('contractNotes.salesNotesPlaceholder')}
                  />
                ) : (
                  <div className="mt-1 p-3 bg-slate-50 rounded border min-h-[80px]">
                    <p className="text-slate-900 whitespace-pre-wrap">
                      {displayValue(contactInfo?.salesNote, 'contractNotes.noSalesNotes')}
                    </p>
                  </div>
                )}
              </div>
            </EditableSection>
          </div>

          {/* Technical Data */}
          <div className="space-y-4">
            <h4 className="font-medium text-indigo-900 border-b border-indigo-200 pb-2">
              {t('contractNotes.technicalData')}
            </h4>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {t('contractNotes.created')}
                </Label>
                <p className="text-slate-900 mt-1">
                  {formatDisplayDate(contract?.created_at)}
                </p>
              </div>

              {contract?.submitted_at && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {t('contractNotes.submitted')}
                  </Label>
                  <p className="text-slate-900 mt-1">
                    {formatDisplayDate(contract.submitted_at)}
                  </p>
                </div>
              )}

              {contract?.signed_at && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {t('contractNotes.signed')}
                  </Label>
                  <p className="text-slate-900 mt-1">
                    {formatDisplayDate(contract.signed_at)}
                  </p>
                </div>
              )}

              {contract?.signed_by && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {t('contractNotes.signedBy')}
                  </Label>
                  <p className="text-slate-900 mt-1">{displayValue(contract.signed_by)}</p>
                </div>
              )}

              {contract?.signature_ip && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {t('contractNotes.signatureIp')}
                  </Label>
                  <p className="text-slate-900 mt-1 font-mono">{displayValue(contract.signature_ip)}</p>
                </div>
              )}

              <EditableSection isEditMode={isEditMode}>
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {t('contractNotes.salesperson')}
                  </Label>
                  {isEditMode ? (
                    <Input defaultValue={contract?.salesperson || ''} className="mt-1" />
                  ) : (
                    <p className="text-slate-900 mt-1">{displayValue(contract?.salesperson)}</p>
                  )}
                </div>
              </EditableSection>

              <div>
                <Label className="text-sm font-medium text-slate-600">{t('contractNotes.contractType')}</Label>
                <p className="text-slate-900 mt-1">{displayValue(contract?.contract_type, 'contractNotes.standardContract')}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractNotesSection;
