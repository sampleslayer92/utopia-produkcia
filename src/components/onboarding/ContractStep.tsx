
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { FileText, Check, AlertCircle, Calendar, DollarSign } from "lucide-react";
import { OnboardingData } from "@/types";

interface ContractStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onComplete: () => void;
}

const ContractStep = ({ data, onComplete }: ContractStepProps) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  const [digitalSignature, setDigitalSignature] = useState('');

  const selectedPlan = data.servicePlan === 'basic' 
    ? { name: 'Basic', monthlyFee: 29, transactionFee: 2.9 }
    : data.servicePlan === 'premium'
    ? { name: 'Premium', monthlyFee: 79, transactionFee: 2.6 }
    : { name: 'Enterprise', monthlyFee: 199, transactionFee: 2.3 };

  const canComplete = agreedToTerms && agreedToPrivacy && digitalSignature.trim().length > 0;

  const handleComplete = () => {
    if (canComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Review & Sign Contract
          </CardTitle>
          <CardDescription className="text-slate-600">
            Please review your service agreement and provide your digital signature
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Contract Summary */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Contract Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Company:</span>
                <span className="font-medium text-slate-900">{data.company?.name || 'Not provided'}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Service Plan:</span>
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                  {selectedPlan.name}
                </Badge>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Fee:</span>
                <span className="font-medium text-slate-900">${selectedPlan.monthlyFee}/month</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Transaction Fee:</span>
                <span className="font-medium text-slate-900">{selectedPlan.transactionFee}%</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-600">Locations:</span>
                <span className="font-medium text-slate-900">{data.locations?.length || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Devices:</span>
                <span className="font-medium text-slate-900">{data.devices?.length || 0}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Contract Date:</span>
                <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-slate-600">Effective Date:</span>
                <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms and Conditions */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64 w-full border border-slate-200 rounded-lg p-4 bg-slate-50">
            <div className="space-y-4 text-sm text-slate-700">
              <h4 className="font-semibold text-slate-900">1. Payment Processing Services</h4>
              <p>
                PayFlow agrees to provide payment processing services according to the selected service plan. 
                Services include transaction processing, reporting, and customer support as outlined in your plan.
              </p>
              
              <h4 className="font-semibold text-slate-900">2. Fees and Pricing</h4>
              <p>
                Monthly fees are charged in advance and are non-refundable. Transaction fees are deducted 
                from each processed transaction. Additional fees may apply for chargebacks, disputes, and special services.
              </p>
              
              <h4 className="font-semibold text-slate-900">3. Settlement Terms</h4>
              <p>
                Funds will be settled to your designated bank account within 1-2 business days for most transactions. 
                Initial settlements may be subject to longer hold periods for new accounts.
              </p>
              
              <h4 className="font-semibold text-slate-900">4. Compliance Requirements</h4>
              <p>
                Merchant agrees to maintain PCI DSS compliance and follow all applicable regulations. 
                PayFlow reserves the right to audit compliance at any time.
              </p>
              
              <h4 className="font-semibold text-slate-900">5. Termination</h4>
              <p>
                Either party may terminate this agreement with 30 days written notice. PayFlow reserves 
                the right to terminate immediately for violations of terms or suspicious activity.
              </p>
              
              <h4 className="font-semibold text-slate-900">6. Limitation of Liability</h4>
              <p>
                PayFlow's liability is limited to the fees paid in the 12 months preceding any claim. 
                PayFlow is not liable for indirect, special, or consequential damages.
              </p>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Agreement Checkboxes */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
            />
            <div className="space-y-1">
              <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the Terms and Conditions
              </label>
              <p className="text-xs text-slate-600">
                By checking this box, you acknowledge that you have read and agree to the terms and conditions above.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Checkbox
              id="privacy"
              checked={agreedToPrivacy}
              onCheckedChange={(checked) => setAgreedToPrivacy(checked as boolean)}
            />
            <div className="space-y-1">
              <label htmlFor="privacy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the Privacy Policy
              </label>
              <p className="text-xs text-slate-600">
                I understand how my personal and business information will be used and protected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature */}
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg text-slate-900">Digital Signature</CardTitle>
          <CardDescription className="text-slate-600">
            Please type your full legal name as your digital signature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <input
                type="text"
                value={digitalSignature}
                onChange={(e) => setDigitalSignature(e.target.value)}
                placeholder="Type your full legal name"
                className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg text-lg font-cursive focus:border-blue-500 focus:outline-none bg-slate-50"
                style={{ fontFamily: 'cursive' }}
              />
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4" />
              <span>Signed on {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Status */}
      {canComplete ? (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-green-900">Ready to Complete</h3>
                <p className="text-sm text-green-700">
                  All requirements met. Click the button below to finalize your onboarding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-amber-600 flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-amber-900">Requirements Needed</h3>
                <p className="text-sm text-amber-700">
                  Please complete all requirements above before proceeding.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Button */}
      <div className="flex justify-center pt-6">
        <Button
          onClick={handleComplete}
          disabled={!canComplete}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl px-12 h-12"
        >
          <FileText className="mr-2 h-5 w-5" />
          Complete Onboarding
        </Button>
      </div>
    </div>
  );
};

export default ContractStep;
