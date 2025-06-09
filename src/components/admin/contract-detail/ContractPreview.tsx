
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
  const businessLocations = onboardingData.businessLocations || [];
  const authorizedPersons = onboardingData.authorizedPersons || [];
  const actualOwners = onboardingData.actualOwners || [];
  const consents = onboardingData.consents;
  
  const totalMonthlyRevenue = devices.reduce((sum: number, device: any) => {
    return sum + (device.count * device.monthlyFee);
  }, 0);

  // Find signing person
  const signingPerson = authorizedPersons.find(
    (person: any) => person.personId === consents?.signingPersonId
  );

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 text-sm" id="contract-preview">
      {/* Header with Logo */}
      <div className="text-center mb-8 border-b-2 border-blue-600 pb-6">
        <div className="mb-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
            <span className="text-white font-bold text-xl">PT</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">ZMLUVA O POSKYTOVANÍ SLUŽIEB</h1>
        <p className="text-xl font-semibold text-blue-600">{formattedContractNumber}</p>
        <p className="text-sm text-slate-600 mt-2">
          Uzavretá dňa: {format(new Date(contract.created_at), 'dd.MM.yyyy')}
        </p>
      </div>

      {/* Article I - Zmluvné strany */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Článok I. - ZMLUVNÉ STRANY</h2>
        
        <div className="grid grid-cols-2 gap-8">
          <div className="border p-4 rounded">
            <h3 className="font-semibold text-slate-900 mb-3">1.1 Poskytovateľ služieb</h3>
            <div className="space-y-1">
              <p className="font-medium text-lg">PayTech Solutions s.r.o.</p>
              <p><strong>Sídlo:</strong> Hlavná 123, 811 01 Bratislava</p>
              <p><strong>IČO:</strong> 12345678</p>
              <p><strong>DIČ:</strong> 2023456789</p>
              <p><strong>Zapísaná v OR:</strong> Okresný súd Bratislava I, oddiel Sro, vložka č. 12345/B</p>
              <p><strong>Bankové spojenie:</strong> SK89 1100 0000 0026 2840 1001</p>
            </div>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-semibold text-slate-900 mb-3">1.2 Objednávateľ</h3>
            <div className="space-y-1">
              <p className="font-medium text-lg">{onboardingData.companyInfo?.companyName || 'Neuvedené'}</p>
              <p><strong>Sídlo:</strong> {onboardingData.companyInfo?.addressStreet || ''}, {onboardingData.companyInfo?.addressCity || ''} {onboardingData.companyInfo?.addressZipCode || ''}</p>
              <p><strong>IČO:</strong> {onboardingData.companyInfo?.ico || 'Neuvedené'}</p>
              <p><strong>DIČ:</strong> {onboardingData.companyInfo?.dic || 'Neuvedené'}</p>
              {onboardingData.companyInfo?.isVatPayer && (
                <p><strong>IČ DPH:</strong> {onboardingData.companyInfo?.vatNumber || 'Neuvedené'}</p>
              )}
              {onboardingData.companyInfo?.registryType && (
                <p><strong>Zapísaná v:</strong> {onboardingData.companyInfo?.court}, {onboardingData.companyInfo?.section}, vložka č. {onboardingData.companyInfo?.insertNumber}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Article II - Kontaktné osoby */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Článok II. - KONTAKTNÉ OSOBY A ZASTÚPENIE</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">2.1 Hlavná kontaktná osoba objednávateľa</h3>
          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded">
            <div>
              <p><strong>Meno:</strong> {onboardingData.companyInfo?.contactPersonFirstName} {onboardingData.companyInfo?.contactPersonLastName}</p>
              <p><strong>Email:</strong> {onboardingData.companyInfo?.contactPersonEmail}</p>
              <p><strong>Telefón:</strong> {onboardingData.companyInfo?.contactPersonPhone}</p>
            </div>
            <div>
              {onboardingData.companyInfo?.contactPersonIsTechnical && (
                <Badge className="bg-blue-100 text-blue-700">Technická kontaktná osoba</Badge>
              )}
            </div>
          </div>
        </div>

        {authorizedPersons.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">2.2 Oprávnené osoby</h3>
            <div className="space-y-3">
              {authorizedPersons.map((person: any, index: number) => (
                <div key={index} className="p-3 border rounded bg-slate-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p><strong>Meno:</strong> {person.firstName} {person.lastName}</p>
                      <p><strong>Pozícia:</strong> {person.position}</p>
                    </div>
                    <div>
                      <p><strong>Email:</strong> {person.email}</p>
                      <p><strong>Telefón:</strong> {person.phone}</p>
                    </div>
                    <div>
                      <p><strong>Rodné číslo:</strong> {person.birthNumber}</p>
                      {person.isPoliticallyExposed && (
                        <Badge className="bg-red-100 text-red-700 text-xs">PEP</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {actualOwners.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">2.3 Skutočný majitelia (podľa zákona AML)</h3>
            <div className="space-y-3">
              {actualOwners.map((owner: any, index: number) => (
                <div key={index} className="p-3 border rounded bg-purple-50">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p><strong>Meno:</strong> {owner.firstName} {owner.lastName}</p>
                      {owner.maidenName && <p><strong>Rodné meno:</strong> {owner.maidenName}</p>}
                      <p><strong>Dátum narodenia:</strong> {owner.birthDate ? format(new Date(owner.birthDate), 'dd.MM.yyyy') : 'Neuvedené'}</p>
                    </div>
                    <div>
                      <p><strong>Miesto narodenia:</strong> {owner.birthPlace}</p>
                      <p><strong>Rodné číslo:</strong> {owner.birthNumber}</p>
                      <p><strong>Štátna príslušnosť:</strong> {owner.citizenship}</p>
                    </div>
                    <div>
                      <p><strong>Trvalý pobyt:</strong> {owner.permanentAddress}</p>
                      {owner.isPoliticallyExposed && (
                        <Badge className="bg-red-100 text-red-700 text-xs">Politicky exponovaná osoba</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Article III - Obchodné lokácie */}
      {businessLocations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Článok III. - OBCHODNÉ LOKÁCIE</h2>
          <div className="space-y-4">
            {businessLocations.map((location: any, index: number) => (
              <div key={index} className="border p-4 rounded">
                <h3 className="font-semibold text-slate-900 mb-3">3.{index + 1} {location.name}</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p><strong>Adresa:</strong> {location.addressStreet}, {location.addressCity} {location.addressZipCode}</p>
                    <p><strong>IBAN:</strong> {location.iban}</p>
                    <p><strong>Sektor podnikania:</strong> {location.businessSector}</p>
                    <p><strong>Sezónnosť:</strong> {location.seasonality === 'year-round' ? 'Celoročne' : `Sezónne (${location.seasonalWeeks} týždňov)`}</p>
                  </div>
                  <div>
                    <p><strong>Odhadovaný obrat:</strong> {formatCurrency(location.estimatedTurnover)}/mesiac</p>
                    <p><strong>Priemerná transakcia:</strong> {formatCurrency(location.averageTransaction)}</p>
                    <p><strong>POS systém:</strong> {location.hasPos ? 'Áno' : 'Nie'}</p>
                    <p><strong>Kontaktná osoba:</strong> {location.contactPersonName}</p>
                  </div>
                </div>
                {location.openingHours && (
                  <div className="mt-3 p-2 bg-slate-50 rounded">
                    <p><strong>Otváracie hodiny:</strong></p>
                    <div className="text-sm whitespace-pre-line">{location.openingHours}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="mb-6" />

      {/* Article IV - Zariadenia a služby */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Článok IV. - PREDMET ZMLUVY - ZARIADENIA A SLUŽBY</h2>
        {devices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border border-slate-300 p-3 text-left">Názov zariadenia/služby</th>
                  <th className="border border-slate-300 p-3 text-center">Počet</th>
                  <th className="border border-slate-300 p-3 text-right">Mesačný poplatok</th>
                  <th className="border border-slate-300 p-3 text-right">Celkom mesačne</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device: any, index: number) => (
                  <tr key={index}>
                    <td className="border border-slate-300 p-3">
                      <div>
                        <p className="font-medium">{device.name}</p>
                        {device.description && (
                          <p className="text-xs text-slate-600 mt-1">{device.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="border border-slate-300 p-3 text-center">{device.count}</td>
                    <td className="border border-slate-300 p-3 text-right">{formatCurrency(device.monthlyFee)}</td>
                    <td className="border border-slate-300 p-3 text-right font-medium">{formatCurrency(device.count * device.monthlyFee)}</td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td className="border border-slate-300 p-3" colSpan={3}>CELKOVÝ MESAČNÝ POPLATOK:</td>
                  <td className="border border-slate-300 p-3 text-right text-lg">{formatCurrency(totalMonthlyRevenue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-600 italic">Žiadne zariadenia neboli vybrané</p>
        )}
      </div>

      <Separator className="mb-6" />

      {/* Article V - Všeobecné podmienky */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Článok V. - VŠEOBECNÉ PODMIENKY</h2>
        <div className="space-y-3 text-sm">
          <div className="grid grid-cols-1 gap-2">
            <p><strong>5.1</strong> Zmluva nadobúda platnosť dňom podpísania oboma zmluvnými stranami a účinnosť dňom doručenia podpísanej zmluvy poskytovateľovi.</p>
            <p><strong>5.2</strong> Mesačné poplatky za poskytované služby sú splatné do 15. dňa nasledujúceho kalendárnego mesiaca.</p>
            <p><strong>5.3</strong> Zmluva sa uzatvára na dobu neurčitú s výpovednou lehotou 30 kalendárnych dní ku koncu kalendárneho mesiaca.</p>
            <p><strong>5.4</strong> Poskytovateľ zabezpečuje technickú podporu 24 hodín denne, 7 dní v týždni.</p>
            <p><strong>5.5</strong> Objednávateľ sa zaväzuje dodržiavať bezpečnostné štandardy PCI DSS a ostatné relevantné predpisy.</p>
            <p><strong>5.6</strong> Poskytovateľ má právo na úhradu všetkých oprávnených nákladov spojených s vymáhaním pohľadávok.</p>
            <p><strong>5.7</strong> Riešenie sporov sa riadi právom Slovenskej republiky. Príslušný je vecne a miestne príslušný súd v Bratislave.</p>
          </div>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Article VI - Záverečné ustanovenia */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Článok VI. - ZÁVEREČNÉ USTANOVENIA</h2>
        <div className="space-y-2 text-sm">
          <p><strong>6.1</strong> Zmluva je vyhotovená v elektronickej forme a je platná aj bez vlastnoručného podpisu.</p>
          <p><strong>6.2</strong> Neoddeliteľnou súčasťou tejto zmluvy sú Všeobecné obchodné podmienky poskytovateľa.</p>
          <p><strong>6.3</strong> Zmeny a doplnky zmluvy musia byť vykonané písomne vo forme dodatku podpísaného oboma zmluvnými stranami.</p>
          <p><strong>6.4</strong> V prípade neplatnosti niektorého ustanovenia zmluvy zostávajú ostatné ustanovenia v platnosti.</p>
        </div>
      </div>

      {/* Signatures Section */}
      <div className="mt-12 mb-8">
        <h2 className="text-lg font-bold text-slate-900 mb-6">PODPISY ZMLUVNÝCH STRÁN</h2>
        
        <div className="grid grid-cols-2 gap-12">
          <div className="text-center">
            <div className="mb-4">
              <p className="font-medium text-slate-900 mb-2">Za poskytovateľa:</p>
              <div className="h-20 border-b border-slate-400 mb-2 flex items-end justify-center">
                <div className="w-32 h-16 bg-blue-50 border border-blue-200 rounded flex items-center justify-center mb-1">
                  <span className="text-blue-600 text-xs">Elektronický podpis</span>
                </div>
              </div>
              <p className="font-medium">PayTech Solutions s.r.o.</p>
              <p className="text-sm text-slate-600">Konateľ</p>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-4">
              <p className="font-medium text-slate-900 mb-2">Za objednávateľa:</p>
              <div className="h-20 border-b border-slate-400 mb-2 flex items-end justify-center">
                {consents?.signatureUrl ? (
                  <img 
                    src={consents.signatureUrl} 
                    alt="Podpis" 
                    className="max-h-16 max-w-32 object-contain mb-1"
                  />
                ) : (
                  <div className="w-32 h-16 bg-amber-50 border border-amber-200 rounded flex items-center justify-center mb-1">
                    <span className="text-amber-600 text-xs">Čaká na podpis</span>
                  </div>
                )}
              </div>
              <p className="font-medium">{onboardingData.companyInfo?.companyName}</p>
              {signingPerson && (
                <p className="text-sm text-slate-600">{signingPerson.firstName} {signingPerson.lastName} - {signingPerson.position}</p>
              )}
            </div>
            
            {consents?.signatureDate && (
              <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded">
                <p className="text-sm font-medium text-emerald-900">Podpísané elektronicky</p>
                <p className="text-xs text-emerald-700">
                  Dátum: {format(new Date(consents.signatureDate), 'dd.MM.yyyy HH:mm')}
                </p>
                {contract.signature_ip && (
                  <p className="text-xs text-emerald-700 font-mono">
                    IP: {contract.signature_ip}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-slate-200 text-center text-xs text-slate-500">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p><strong>Zmluva vytvorená:</strong></p>
            <p>{format(new Date(contract.created_at), 'dd.MM.yyyy HH:mm')}</p>
          </div>
          <div>
            <p><strong>Číslo zmluvy:</strong></p>
            <p>{formattedContractNumber}</p>
          </div>
          <div>
            <p><strong>Verzia dokumentu:</strong></p>
            <p>2.0</p>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p>PayTech Solutions s.r.o. | www.paytech.sk | info@paytech.sk | +421 2 1234 5678</p>
        </div>
      </div>
    </div>
  );
};

export default ContractPreview;
