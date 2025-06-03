
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Shield } from "lucide-react";
import { OnboardingData } from "@/types";

interface ServicesStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const ServicesStep = ({ data, updateData }: ServicesStepProps) => {
  const servicePlans = [
    {
      id: 'basic',
      name: 'Základný',
      monthlyFee: 29,
      transactionFee: 2.9,
      icon: Shield,
      popular: false,
      description: 'Ideálny pre malé firmy, ktoré začínajú',
      features: [
        'Spracovanie platieb',
        'Základné reporty',
        'Email podpora',
        'Do 2 lokalít',
        'Štandardné zariadenia',
        'Základná ochrana proti podvodom'
      ]
    },
    {
      id: 'premium',
      name: 'Prémiový',
      monthlyFee: 79,
      transactionFee: 2.6,
      icon: Star,
      popular: true,
      description: 'Najpopulárnejší pre rastúce firmy',
      features: [
        'Všetko zo Základného',
        'Pokročilé analýzy',
        'Prioritná telefonická podpora',
        'Do 10 lokalít',
        'Prémiové zariadenia',
        'Pokročilá ochrana proti podvodom',
        'Vlastné reporty',
        'API prístup'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyFee: 199,
      transactionFee: 2.3,
      icon: Zap,
      popular: false,
      description: 'Pre veľké organizácie s komplexnými potrebami',
      features: [
        'Všetko z Prémiového',
        'Dedikovaný account manager',
        '24/7 telefonická podpora',
        'Neobmedzené lokality',
        'Vlastné integrácie',
        'White-label možnosti',
        'Zľavy za objem',
        'SLA záruky'
      ]
    }
  ];

  const selectPlan = (planId: string) => {
    updateData({ servicePlan: planId });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-slate-900 text-2xl">Vyberte si servisný balík</CardTitle>
          <CardDescription className="text-slate-600">
            Zvoľte balík, ktorý najlepšie vyhovuje potrebám vašej firmy. Kedykoľvek môžete zmeniť balík.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {servicePlans.map((plan) => {
          const IconComponent = plan.icon;
          const isSelected = data.servicePlan === plan.id;
          
          return (
            <Card
              key={plan.id}
              className={`relative transition-all duration-300 cursor-pointer ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-lg shadow-blue-500/20'
                  : 'border-slate-200/60 bg-white/80 backdrop-blur-sm hover:border-blue-300 hover:shadow-md'
              }`}
              onClick={() => selectPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1">
                    Najpopulárnejší
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl text-slate-900 mb-2">
                  {plan.name}
                </CardTitle>
                
                <div className="text-center mb-4">
                  <span className="text-3xl font-bold text-slate-900">
                    {plan.monthlyFee}€
                  </span>
                  <span className="text-slate-600">/mesiac</span>
                  <div className="text-sm text-slate-600 mt-1">
                    + {plan.transactionFee}% za transakciu
                  </div>
                </div>
                
                <CardDescription className="text-slate-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Button
                  className={`w-full mb-6 ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectPlan(plan.id);
                  }}
                >
                  {isSelected ? 'Vybraný' : 'Vybrať balík'}
                </Button>
                
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`h-5 w-5 rounded-full flex items-center justify-center mt-0.5 ${
                        isSelected ? 'bg-blue-600' : 'bg-green-100'
                      }`}>
                        <Check className={`h-3 w-3 ${
                          isSelected ? 'text-white' : 'text-green-600'
                        }`} />
                      </div>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {data.servicePlan && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">
                  {servicePlans.find(p => p.id === data.servicePlan)?.name} balík vybraný
                </h3>
                <p className="text-sm text-green-700">
                  Môžete skontrolovať a upraviť svoj výber pred dokončením zmluvy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ServicesStep;
