
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Calendar, User, Globe } from "lucide-react";
import EditableSection from "./EditableSection";
import { format } from "date-fns";

interface ContractNotesSectionProps {
  contract: any;
  onboardingData: any;
  isEditMode: boolean;
  onSave: (data: any) => void;
}

const ContractNotesSection = ({ contract, onboardingData, isEditMode, onSave }: ContractNotesSectionProps) => {
  const contactInfo = onboardingData.contactInfo;

  return (
    <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-blue-50/50 backdrop-blur-sm">
      <CardHeader className="border-b border-indigo-200/60">
        <CardTitle className="flex items-center text-slate-900">
          <FileText className="h-5 w-5 mr-2 text-indigo-600" />
          Poznámky a technické údaje
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Poznámky */}
          <div className="space-y-4">
            <h4 className="font-medium text-indigo-900 border-b border-indigo-200 pb-2">
              Poznámky
            </h4>
            
            <EditableSection isEditMode={isEditMode}>
              <div>
                <Label className="text-sm font-medium text-slate-600">Poznámky k zmluve</Label>
                {isEditMode ? (
                  <Textarea 
                    defaultValue={contract?.notes || ''} 
                    className="mt-1"
                    rows={4}
                    placeholder="Poznámky k zmluve..."
                  />
                ) : (
                  <div className="mt-1 p-3 bg-slate-50 rounded border min-h-[100px]">
                    <p className="text-slate-900 whitespace-pre-wrap">
                      {contract?.notes || 'Žiadne poznámky'}
                    </p>
                  </div>
                )}
              </div>
            </EditableSection>

            <EditableSection isEditMode={isEditMode}>
              <div>
                <Label className="text-sm font-medium text-slate-600">Sales poznámky</Label>
                {isEditMode ? (
                  <Textarea 
                    defaultValue={contactInfo?.salesNote || ''} 
                    className="mt-1"
                    rows={3}
                    placeholder="Sales poznámky..."
                  />
                ) : (
                  <div className="mt-1 p-3 bg-slate-50 rounded border min-h-[80px]">
                    <p className="text-slate-900 whitespace-pre-wrap">
                      {contactInfo?.salesNote || 'Žiadne sales poznámky'}
                    </p>
                  </div>
                )}
              </div>
            </EditableSection>
          </div>

          {/* Technické údaje */}
          <div className="space-y-4">
            <h4 className="font-medium text-indigo-900 border-b border-indigo-200 pb-2">
              Technické údaje
            </h4>
            
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-slate-600 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Vytvorená
                </Label>
                <p className="text-slate-900 mt-1">
                  {contract?.created_at ? format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm:ss') : 'Neuvedené'}
                </p>
              </div>

              {contract?.submitted_at && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Odoslaná
                  </Label>
                  <p className="text-slate-900 mt-1">
                    {format(new Date(contract.submitted_at), 'dd.MM.yyyy HH:mm:ss')}
                  </p>
                </div>
              )}

              {contract?.signed_at && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Podpísaná
                  </Label>
                  <p className="text-slate-900 mt-1">
                    {format(new Date(contract.signed_at), 'dd.MM.yyyy HH:mm:ss')}
                  </p>
                </div>
              )}

              {contract?.signed_by && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Podpísal
                  </Label>
                  <p className="text-slate-900 mt-1">{contract.signed_by}</p>
                </div>
              )}

              {contract?.signature_ip && (
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    IP adresa podpisu
                  </Label>
                  <p className="text-slate-900 mt-1 font-mono">{contract.signature_ip}</p>
                </div>
              )}

              <EditableSection isEditMode={isEditMode}>
                <div>
                  <Label className="text-sm font-medium text-slate-600 flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Predajca
                  </Label>
                  {isEditMode ? (
                    <Input defaultValue={contract?.salesperson || ''} className="mt-1" />
                  ) : (
                    <p className="text-slate-900 mt-1">{contract?.salesperson || 'Neuvedené'}</p>
                  )}
                </div>
              </EditableSection>

              <div>
                <Label className="text-sm font-medium text-slate-600">Typ zmluvy</Label>
                <p className="text-slate-900 mt-1">{contract?.contract_type || 'Štandardná'}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContractNotesSection;
