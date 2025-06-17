
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PenTool, Clock, CheckCircle, Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { format } from "date-fns";

interface SignatureSectionProps {
  contract: any;
  onboardingData: any;
  onSave: (data: any) => void;
}

const SignatureSection = ({ contract, onboardingData, onSave }: SignatureSectionProps) => {
  const { t } = useTranslation('admin');
  const consents = onboardingData.consents;
  const signedDate = consents?.signatureDate;
  const signingPersonId = consents?.signingPersonId;
  
  // Find the signing person from authorized persons
  const signingPerson = onboardingData.authorizedPersons?.find(
    (person: any) => person.personId === signingPersonId
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'signed':
        return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'submitted':
        return <Mail className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">{t('signature.signed')}</Badge>;
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">{t('signature.sentByEmail')}</Badge>;
      case 'approved':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">{t('signature.approved')}</Badge>;
      default:
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">{t('signature.waitingForSignature')}</Badge>;
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 backdrop-blur-sm">
      <CardHeader className="border-b border-purple-200/60">
        <CardTitle className="flex items-center text-slate-900">
          <PenTool className="h-5 w-5 mr-2 text-purple-600" />
          {t('signature.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Signature Status */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              {getStatusIcon(contract.status)}
              <div className="flex-1">
                <h4 className="font-medium text-slate-900">{t('signature.contractStatus')}</h4>
                <div className="mt-1">
                  {getStatusBadge(contract.status)}
                </div>
              </div>
            </div>

            {signedDate && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h5 className="font-medium text-emerald-900 mb-2">{t('signature.signed')}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">{t('signature.signatureDate')}:</span>
                    <span className="font-medium text-emerald-900">
                      {format(new Date(signedDate), 'dd.MM.yyyy HH:mm')}
                    </span>
                  </div>
                  
                  {signingPerson && (
                    <div className="flex justify-between">
                      <span className="text-emerald-700">{t('signature.signedBy')}:</span>
                      <span className="font-medium text-emerald-900">
                        {signingPerson.firstName} {signingPerson.lastName}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-emerald-700">{t('signature.ipAddress')}:</span>
                    <span className="font-medium text-emerald-900 font-mono">
                      192.168.1.100 {/* This would come from signature log */}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {!signedDate && contract.status !== 'signed' && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h5 className="font-medium text-amber-900 mb-2">{t('signature.waitingForSign')}</h5>
                <p className="text-sm text-amber-700">
                  {t('signature.contractSent')}
                </p>
              </div>
            )}
          </div>

          {/* Consent Summary */}
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-4">{t('signature.consentSummary')}</h4>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    consents?.termsConsent ? 'bg-emerald-100 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {consents?.termsConsent && (
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-sm text-slate-700">
                    {t('signature.termsConsent')}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    consents?.gdprConsent ? 'bg-emerald-100 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {consents?.gdprConsent && (
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-sm text-slate-700">
                    {t('signature.gdprConsent')}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    consents?.electronicCommunicationConsent ? 'bg-emerald-100 border-emerald-500' : 'border-slate-300'
                  }`}>
                    {consents?.electronicCommunicationConsent && (
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    )}
                  </div>
                  <span className="text-sm text-slate-700">
                    {t('signature.electronicCommunicationConsent')}
                  </span>
                </div>
              </div>
            </div>

            {/* Signature Actions */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-900">{t('signature.signatureActions')}</h4>
              
              {contract.status === 'draft' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('signature.sendForSignature')}
                </Button>
              )}
              
              {contract.status === 'submitted' && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t('signature.markAsSigned')}
                </Button>
              )}
              
              <Button variant="outline" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                {t('signature.sendReminder')}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureSection;
