import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Building2, 
  MapPin, 
  CreditCard, 
  Euro, 
  Users,
  FileText,
  Copy,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface Contract {
  id: string;
  contract_number: string;
  status: string;
  total_monthly_profit: number;
  created_at: string;
}

interface ContractCopyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contracts: Contract[];
  merchantId: string;
}

interface CopySegment {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  dataCount?: number;
}

const ContractCopyModal = ({ 
  open, 
  onOpenChange, 
  contracts, 
  merchantId 
}: ContractCopyModalProps) => {
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const copySegments: CopySegment[] = [
    {
      id: 'contactInfo',
      label: 'Kontaktné údaje',
      description: 'Meno, email, telefón, tituly',
      icon: User,
    },
    {
      id: 'companyInfo',
      label: 'Údaje o spoločnosti',
      description: 'IČO, DIČ, názov, adresa, registre',
      icon: Building2,
    },
    {
      id: 'businessLocations',
      label: 'Prevádzky',
      description: 'Prevádzkovacie miesta a ich údaje',
      icon: MapPin,
    },
    {
      id: 'deviceSelection',
      label: 'Zariadenia a služby',
      description: 'Vybraté zariadenia, služby, doplnky',
      icon: CreditCard,
    },
    {
      id: 'fees',
      label: 'Poplatky',
      description: 'Nastavenia poplatkov a sadzieb',
      icon: Euro,
    },
    {
      id: 'personsAndOwners',
      label: 'Osoby a vlastníci',
      description: 'Oprávnené osoby a skutoční vlastníci',
      icon: Users,
    },
  ];

  const selectedContractData = contracts.find(c => c.id === selectedContract);

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId)
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const handleStartWithCopy = () => {
    if (!selectedContract || selectedSegments.length === 0) {
      toast.error('Vyberte zmluvu a aspoň jeden segment na kopírovanie');
      return;
    }

    // Store copy configuration in localStorage
    const copyConfig = {
      sourceContractId: selectedContract,
      segments: selectedSegments,
      merchantId,
      timestamp: Date.now()
    };
    
    localStorage.setItem('contract_copy_config', JSON.stringify(copyConfig));
    
    toast.success(`Kopírujem ${selectedSegments.length} segmentov z zmluvy ${selectedContractData?.contract_number}`);
    
    // Navigate to admin onboarding
    navigate('/admin/onboarding');
    onOpenChange(false);
  };

  const handleStartClean = () => {
    // Clear any existing copy config
    localStorage.removeItem('contract_copy_config');
    
    toast.success('Začínam s novou čistou zmluvou');
    
    // Navigate to admin onboarding
    navigate('/admin/onboarding');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5" />
            Nová zmluva pre merchanta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Vyberte zmluvu na kopírovanie (voliteľné)</h3>
            <div className="grid gap-3 max-h-48 overflow-y-auto">
              {contracts.map((contract) => (
                <Card 
                  key={contract.id}
                  className={`cursor-pointer transition-colors ${
                    selectedContract === contract.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedContract(contract.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedContract === contract.id
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground'
                        }`} />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{contract.contract_number}</span>
                            <Badge variant="outline">{contract.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Vytvorená: {new Date(contract.created_at).toLocaleDateString('sk-SK')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          €{contract.total_monthly_profit.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">mesačne</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Segment Selection */}
          {selectedContract && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Vyberte segmenty na kopírovanie</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {copySegments.map((segment) => (
                  <Card 
                    key={segment.id}
                    className={`cursor-pointer transition-colors ${
                      selectedSegments.includes(segment.id)
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleSegmentToggle(segment.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Checkbox 
                          checked={selectedSegments.includes(segment.id)}
                          onChange={() => handleSegmentToggle(segment.id)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <segment.icon className="h-4 w-4 text-primary" />
                            <span className="font-medium">{segment.label}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {segment.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedSegments.length > 0 && (
                <Card className="mt-4 border-primary/20 bg-primary/5">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Náhľad kopírovania
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Skopíruje sa <span className="font-semibold">{selectedSegments.length}</span> segmentov 
                      zo zmluvy <span className="font-semibold">{selectedContractData?.contract_number}</span>:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSegments.map(segmentId => {
                        const segment = copySegments.find(s => s.id === segmentId);
                        return (
                          <Badge key={segmentId} variant="secondary" className="text-xs">
                            {segment?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Zrušiť
          </Button>
          <Button variant="outline" onClick={handleStartClean}>
            <FileText className="h-4 w-4 mr-2" />
            Začať s čistou zmluvou
          </Button>
          {selectedContract && selectedSegments.length > 0 && (
            <Button onClick={handleStartWithCopy}>
              <Copy className="h-4 w-4 mr-2" />
              Kopírovať vybrané údaje
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractCopyModal;