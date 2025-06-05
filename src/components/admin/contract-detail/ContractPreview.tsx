
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/components/onboarding/utils/currencyUtils";
import { format } from "date-fns";

interface ContractPreviewProps {
  contract: any;
  onboardingData: any;
}

const ContractPreview = ({ contract, onboardingData }: ContractPreviewProps) => {
  const formattedContractNumber = `CON-2024-${String(contract.contract_number).padStart(3, '0')}`;
  
  const devices = onboardingData.deviceSelection?.dynamicCards || [];
  const totalMonthlyRevenue = devices.reduce((sum: number, device: any) => {
    return sum + (device.count * device.monthlyFee);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 text-sm" id="contract-preview">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">ZMLUVA O POSKYTOVANÍ SLUŽIEB</h1>
        <p className="text-lg font-semibold text-slate-700">{formattedContractNumber}</p>
      </div>

      <Separator className="mb-6" />

      {/* Contract Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Poskytovateľ služieb</h3>
          <div className="space-y-1">
            <p className="font-medium">PayTech Solutions s.r.o.</p>
            <p>IČO: 12345678</p>
            <p>DIČ: 2023456789</p>
            <p>Adresa: Hlavná 123, 811 01 Bratislava</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 mb-3">Objednávateľ</h3>
          <div className="space-y-1">
            <p className="font-medium">{onboardingData.companyInfo?.companyName || 'Neuvedené'}</p>
            <p>IČO: {onboardingData.companyInfo?.ico || 'Neuvedené'}</p>
            <p>DIČ: {onboardingData.companyInfo?.dic || 'Neuvedené'}</p>
            <p>Adresa: {onboardingData.companyInfo?.addressStreet || ''}, {onboardingData.companyInfo?.addressCity || ''} {onboardingData.companyInfo?.addressZipCode || ''}</p>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Contact Person */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Kontaktná osoba</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Meno:</span> {onboardingData.companyInfo?.contactPersonFirstName} {onboardingData.companyInfo?.contactPersonLastName}</p>
            <p><span className="font-medium">Email:</span> {onboardingData.companyInfo?.contactPersonEmail}</p>
          </div>
          <div>
            <p><span className="font-medium">Telefón:</span> {onboardingData.companyInfo?.contactPersonPhone}</p>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Devices and Services */}
      <div className="mb-6">
        <h3 className="font-semibold text-slate-900 mb-3">Zariadenia a služby</h3>
        {devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-2 text-left">Názov</th>
                  <th className="border border-slate-300 p-2 text-center">Počet</th>
                  <th className="border border-slate-300 p-2 text-right">Mesačný poplatok</th>
                  <th className="border border-slate-300 p-2 text-right">Celkom</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-slate-300 p-2">{device.name}</td>
                    <td className="border border-slate-300 p-2 text-center">{device.count}</td>
                    <td className="border border-slate-300 p-2 text-right">{formatCurrency(device.monthlyFee)}</td>
                    <td className="border border-slate-300 p-2 text-right">{formatCurrency(device.count * device.monthlyFee)}</td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold">
                  <td className="border border-slate-300 p-2" colSpan={3}>Celkový mesačný poplatok:</td>
                  <td className="border border-slate-300 p-2 text-right">{formatCurrency(totalMonthlyRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-600">Žiadne zariadenia neboli vybrané</p>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Authorized Persons */}
      {onboardingData.authorizedPersons && onboardingData.authorizedPersons.length > 0 && (
        <>
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Oprávnené osoby</h3>
            <div className="space-y-2">
              {onboardingData.authorizedPersons.map((person: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-2 bg-slate-50 rounded">
                  <span>{person.firstName} {person.lastName}</span>
                  <span className="text-sm text-slate-600">{person.email}</span>
                </div>
              ))}
            </div>
          </div>
          <Separator className="mb-6" />
        </>
      )}

      {/* Contract Terms */}
      <div className="mb-8">
        <h3 className="font-semibold text-slate-900 mb-3">Podmienky zmluvy</h3>
        <div className="space-y-2 text-sm">
          <p>• Zmluva nadobúda platnosť dňom podpísania oboma stranami.</p>
          <p>• Mesačné poplatky sú splatné do 15. dňa nasledujúceho mesiaca.</p>
          <p>• Zmluva sa uzatvára na dobu neurčitú s výpovednou lehotou 30 dní.</p>
          <p>• Poskytovateľ zabezpečuje technickú podporu 24/7.</p>
        </div>
      </div>

      {/* Signatures */}
      <div className="mt-12">
        <div className="grid grid-cols-2 gap-8">
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mt-16">
              <p className="font-medium">Za poskytovateľa</p>
              <p className="text-sm text-slate-600">PayTech Solutions s.r.o.</p>
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-slate-400 pt-2 mt-16">
              <p className="font-medium">Za objednávateľa</p>
              <p className="text-sm text-slate-600">{onboardingData.companyInfo?.companyName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-slate-500">
        <p>Zmluva vytvorená dňa: {format(new Date(contract.created_at), 'dd.MM.yyyy')}</p>
        <p>Verzia dokumentu: 1.0</p>
      </div>
    </div>
  );
};

export default ContractPreview;
