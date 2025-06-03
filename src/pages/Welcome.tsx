
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Users, Building2, User, ArrowRight, UserCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();
  const [showRoleSelection, setShowRoleSelection] = useState(false);

  const handleRoleSelect = (role: 'admin' | 'partner' | 'merchant') => {
    localStorage.setItem('utopia_user_role', role);
    
    switch (role) {
      case 'admin':
        navigate('/admin');
        break;
      case 'partner':
        navigate('/partner');
        break;
      case 'merchant':
        navigate('/merchant');
        break;
    }
  };

  const handleNewClient = () => {
    navigate('/onboarding');
  };

  if (showRoleSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-4">
              <CreditCard className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              PayFlow
            </h1>
            <p className="text-slate-600 mt-2">Vyberte svoju rolu</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300"
              onClick={() => handleRoleSelect('admin')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Admin (ISO organizácia)</h3>
                    <p className="text-sm text-slate-600">Plný prístup k systému</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300"
              onClick={() => handleRoleSelect('partner')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Obchodný partner</h3>
                    <p className="text-sm text-slate-600">Správa vlastných klientov</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card 
              className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300"
              onClick={() => handleRoleSelect('merchant')}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Klient (merchant)</h3>
                    <p className="text-sm text-slate-600">Zobrazenie vlastných dát</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Button 
              variant="outline" 
              onClick={() => setShowRoleSelection(false)}
              className="text-slate-600 border-slate-300"
            >
              Späť
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6">
            <CreditCard className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-3">
            PayFlow
          </h1>
          <p className="text-slate-600 text-lg">
            Platobná platforma pre ISO organizácie, obchodných partnerov a klientov
          </p>
        </div>

        {/* Main Options */}
        <div className="space-y-4">
          <Card 
            className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-blue-300 group"
            onClick={() => setShowRoleSelection(true)}
          >
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UserCheck className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-1">
                    Prihlásiť sa ako existujúci používateľ
                  </h2>
                  <p className="text-slate-600">
                    Vyberte svoju rolu a pokračujte do systému
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:border-emerald-300 group"
            onClick={handleNewClient}
          >
            <CardContent className="p-8">
              <div className="flex items-center space-x-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <CreditCard className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-slate-900 mb-1">
                    Nový klient – Začať onboarding
                  </h2>
                  <p className="text-slate-600">
                    Registrácia novej spoločnosti do systému
                  </p>
                </div>
                <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all duration-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-slate-500">
          Demo verzia - bez skutočného prihlásenia
        </div>
      </div>
    </div>
  );
};

export default Welcome;
