import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useContractData } from "@/hooks/useContractData";
import { useContractUpdate } from "@/hooks/useContractUpdate";
import OnboardingStepRenderer from "@/components/onboarding/components/OnboardingStepRenderer";
import OnboardingSidebar from "@/components/onboarding/ui/OnboardingSidebar";
import { onboardingSteps } from "@/components/onboarding/config/onboardingSteps";
import { OnboardingData } from "@/types/onboarding";
import { Database } from "@/integrations/supabase/types";

type ContractStatus = Database['public']['Enums']['contract_status'];

const ContractEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus>("draft");

  const { data: contractData, isLoading, error } = useContractData(id!);
  const updateContract = useContractUpdate(id!);

  const [editData, setEditData] = useState<OnboardingData | null>(null);

  // Initialize edit data when contract data loads
  if (contractData?.onboardingData && !editData) {
    setEditData(contractData.onboardingData);
    setSelectedStatus(contractData.contract.status);
  }

  const handleSave = () => {
    if (!editData) return;
    
    updateContract.mutate({
      data: editData,
      status: selectedStatus !== contractData?.contract.status ? selectedStatus : undefined
    });
  };

  const handleDataUpdate = (data: Partial<OnboardingData>) => {
    if (!editData) return;
    setEditData(prev => ({ ...prev!, ...data }));
  };

  const statusOptions = [
    { value: 'draft', label: 'Koncept' },
    { value: 'submitted', label: 'Odoslané' },
    { value: 'approved', label: 'Schválené' },
    { value: 'rejected', label: 'Zamietnuté' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Odoslané</Badge>;
      case 'approved':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Schválené</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Zamietnuté</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Koncept</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Načítavam zmluvu...</span>
        </div>
      </div>
    );
  }

  if (error || !contractData || !editData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Chyba</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              {error ? 'Nepodarilo sa načítať zmluvu.' : 'Zmluva nebola nájdená.'}
            </p>
            <Button onClick={() => navigate('/admin')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Späť na zoznam
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => navigate('/admin')}
                className="border-slate-300"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Späť na zoznam
              </Button>
              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Editácia zmluvy #{contractData.contract.contract_number}
                </h1>
                <p className="text-sm text-slate-600">
                  Vytvorená: {new Date(contractData.contract.created_at).toLocaleDateString('sk-SK')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-600">Stav:</span>
                {getStatusBadge(contractData.contract.status)}
              </div>
              
              <Select value={selectedStatus} onValueChange={(value: ContractStatus) => setSelectedStatus(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Zmeniť stav" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={handleSave}
                disabled={updateContract.isPending}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {updateContract.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ukladám...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Uložiť zmeny
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <OnboardingSidebar
          currentStep={currentStep}
          steps={onboardingSteps}
          onStepClick={setCurrentStep}
        />
        
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <OnboardingStepRenderer
              currentStep={currentStep}
              data={editData}
              updateData={handleDataUpdate}
              onNext={() => setCurrentStep(prev => Math.min(prev + 1, onboardingSteps.length - 1))}
              onPrev={() => setCurrentStep(prev => Math.max(prev - 1, 0))}
              onComplete={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractEditPage;
