import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  Sparkles,
  CheckSquare,
  Square
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
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);

  const copySegments: CopySegment[] = [
    {
      id: 'contactInfo',
      label: t('contractCopyModal.segments.contactInfo.label'),
      description: t('contractCopyModal.segments.contactInfo.description'),
      icon: User,
    },
    {
      id: 'companyInfo',
      label: t('contractCopyModal.segments.companyInfo.label'),
      description: t('contractCopyModal.segments.companyInfo.description'),
      icon: Building2,
    },
    {
      id: 'businessLocations',
      label: t('contractCopyModal.segments.businessLocations.label'),
      description: t('contractCopyModal.segments.businessLocations.description'),
      icon: MapPin,
    },
    {
      id: 'deviceSelection',
      label: t('contractCopyModal.segments.deviceSelection.label'),
      description: t('contractCopyModal.segments.deviceSelection.description'),
      icon: CreditCard,
    },
    {
      id: 'fees',
      label: t('contractCopyModal.segments.fees.label'),
      description: t('contractCopyModal.segments.fees.description'),
      icon: Euro,
    },
    {
      id: 'personsAndOwners',
      label: t('contractCopyModal.segments.personsAndOwners.label'),
      description: t('contractCopyModal.segments.personsAndOwners.description'),
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

  const handleSelectAll = () => {
    setSelectedSegments(copySegments.map(segment => segment.id));
  };

  const handleDeselectAll = () => {
    setSelectedSegments([]);
  };

  const handleStartWithCopy = () => {
    if (!selectedContract || selectedSegments.length === 0) {
      toast.error(t('contractCopyModal.validation.selectContractAndSegments'));
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
    
    toast.success(t('contractCopyModal.success.copyingSegments', { 
      count: selectedSegments.length, 
      contractNumber: selectedContractData?.contract_number 
    }));
    
    // Navigate to admin onboarding
    navigate('/admin/onboarding');
    onOpenChange(false);
  };

  const handleStartClean = () => {
    // Clear any existing copy config
    localStorage.removeItem('contract_copy_config');
    
    toast.success(t('contractCopyModal.success.startingClean'));
    
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
            {t('contractCopyModal.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Contract Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">{t('contractCopyModal.selectContract')}</h3>
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
                            {t('contractCopyModal.contractDetails.created')} {new Date(contract.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          €{contract.total_monthly_profit.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">{t('contractCopyModal.contractDetails.monthly')}</p>
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
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">{t('contractCopyModal.selectSegments')}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {t('contractCopyModal.segmentsSelected', { 
                      count: selectedSegments.length, 
                      total: copySegments.length 
                    })}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={selectedSegments.length === copySegments.length ? handleDeselectAll : handleSelectAll}
                    className="flex items-center gap-1"
                  >
                    {selectedSegments.length === copySegments.length ? (
                      <>
                        <Square className="h-3 w-3" />
                        {t('contractCopyModal.deselectAllSegments')}
                      </>
                    ) : (
                      <>
                        <CheckSquare className="h-3 w-3" />
                        {t('contractCopyModal.selectAllSegments')}
                      </>
                    )}
                  </Button>
                </div>
              </div>
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
                      {t('contractCopyModal.previewTitle')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('contractCopyModal.previewDescription', { 
                        count: selectedSegments.length, 
                        contractNumber: selectedContractData?.contract_number 
                      })}
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
            {t('common:buttons.cancel')}
          </Button>
          <Button variant="outline" onClick={handleStartClean}>
            <FileText className="h-4 w-4 mr-2" />
            {t('contractCopyModal.startClean')}
          </Button>
          {selectedContract && selectedSegments.length > 0 && (
            <Button onClick={handleStartWithCopy}>
              <Copy className="h-4 w-4 mr-2" />
              {t('contractCopyModal.copySelected')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContractCopyModal;