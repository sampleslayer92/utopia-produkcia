
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { OnboardingData } from "@/types/onboarding";
import { FileText, Calendar, User, Building, CreditCard } from "lucide-react";

interface ContractPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSign: () => void;
  data: OnboardingData;
  isLoading?: boolean;
}

const ContractPreviewModal = ({ isOpen, onClose, onSign, data, isLoading }: ContractPreviewModalProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('sk-SK', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTotalMonthlyFee = () => {
    return data.deviceSelection.dynamicCards.reduce((total, card) => {
      return total + (card.monthlyFee * card.count);
    }, 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Náhľad zmluvy - Číslo {data.contractNumber}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6 text-sm">
            {/* Contract Header */}
            <div className="text-center border-b pb-4">
              <h2 className="text-xl font-bold text-slate-900">ZMLUVA O POSKYTOVANÍ PLATOBNÝCH SLUŽIEB</h2>
              <p className="text-slate-600 mt-2">Číslo zmluvy: {data.contractNumber}</p>
              <p className="text-slate-600">Dátum vytvorenia: {new Date().toLocaleDateString('sk-SK')}</p>
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Kontaktná osoba
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p><strong>Meno:</strong> {data.contactInfo.salutation} {data.contactInfo.firstName} {data.contactInfo.lastName}</p>
                  <p><strong>Email:</strong> {data.contactInfo.email}</p>
                  <p><strong>Telefón:</strong> {data.contactInfo.phonePrefix} {data.contactInfo.phone}</p>
                  <p><strong>Pozícia:</strong> {data.contactInfo.userRole}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Spoločnosť
                </h3>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p><strong>Názov:</strong> {data.companyInfo.companyName}</p>
                  <p><strong>IČO:</strong> {data.companyInfo.ico}</p>
                  <p><strong>DIČ:</strong> {data.companyInfo.dic}</p>
                  <p><strong>Adresa:</strong> {data.companyInfo.address.street}, {data.companyInfo.address.city} {data.companyInfo.address.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Business Locations */}
            {data.businessLocations.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Prevádzky</h3>
                <div className="space-y-2">
                  {data.businessLocations.map((location, index) => (
                    <div key={location.id} className="bg-slate-50 p-4 rounded-lg">
                      <p><strong>{index + 1}. {location.name}</strong></p>
                      <p>Adresa: {location.address.street}, {location.address.city} {location.address.zipCode}</p>
                      <p>Sektor: {location.businessSector}</p>
                      <p>Odhadovaný obrat: {formatCurrency(location.estimatedTurnover)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Devices and Services */}
            {data.deviceSelection.dynamicCards.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Zariadenia a služby
                </h3>
                <div className="space-y-2">
                  {data.deviceSelection.dynamicCards.map((card, index) => (
                    <div key={card.id} className="bg-slate-50 p-4 rounded-lg flex justify-between items-start">
                      <div>
                        <p><strong>{card.name}</strong></p>
                        <p className="text-slate-600">{card.description}</p>
                        <p>Počet: {card.count}x</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(card.monthlyFee * card.count)}/mes.</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-lg font-bold text-center">
                    Celkový mesačný poplatok: {formatCurrency(getTotalMonthlyFee())}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Processing Fees */}
            <div className="space-y-3">
              <h3 className="font-semibold">Poplatky za spracovanie platieb</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p>MIF regulované karty: {data.fees.regulatedCards}%</p>
                <p>MIF neregulované karty: {data.fees.unregulatedCards}%</p>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-3">
              <h3 className="font-semibold">Všeobecné obchodné podmienky</h3>
              <div className="bg-slate-50 p-4 rounded-lg text-xs leading-relaxed">
                <p className="mb-3">
                  <strong>1. Predmet zmluvy:</strong> Poskytovateľ sa zaväzuje poskytovať klientovi platobné služby 
                  v súlade s podmienkami uvedenými v tejto zmluve a platnou legislatívou Slovenskej republiky.
                </p>
                <p className="mb-3">
                  <strong>2. Doba platnosti:</strong> Zmluva sa uzatvára na neurčitý čas s výpovednou lehotou 
                  3 mesiace od doručenia písomnej výpovede.
                </p>
                <p className="mb-3">
                  <strong>3. Platobné podmienky:</strong> Mesačné poplatky sú splatné do 15 dní od vystavenia faktúry. 
                  Pri omeškaní platby môže poskytovateľ účtovať úroky z omeškania.
                </p>
                <p className="mb-3">
                  <strong>4. Zodpovednosť:</strong> Poskytovateľ nezodpovedá za škody vzniknuté nesprávnym 
                  používaním zariadení alebo služieb klientom.
                </p>
                <p>
                  <strong>5. Záverečné ustanovenia:</strong> Táto zmluva nadobúda účinnosť dňom podpisu 
                  oboma zmluvnými stranami.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Späť
          </Button>
          <Button 
            onClick={onSign} 
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <>
                <Calendar className="h-4 w-4 mr-2 animate-spin" />
                Podpisujem...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Podpísať zmluvu
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContractPreviewModal;
