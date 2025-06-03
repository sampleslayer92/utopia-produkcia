
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Building, Shield } from "lucide-react";
import { OnboardingData } from "@/types";

interface BillingStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const BillingStep = ({ data, updateData }: BillingStepProps) => {
  const handleInputChange = (field: string, value: string) => {
    updateData({
      billing: {
        ...data.billing,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-slate-900 flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-blue-600" />
            Billing & Banking Information
          </CardTitle>
          <CardDescription className="text-slate-600">
            Set up your billing information and bank account for settlements
          </CardDescription>
          
          <div className="flex items-center space-x-2 mt-4">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-sm text-green-700">
              All financial information is encrypted and secure
            </span>
          </div>
        </CardHeader>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Building className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-900">
                Bank Account Information
              </CardTitle>
              <CardDescription className="text-slate-600">
                Where you'd like to receive your payment settlements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bankName">Bank Name *</Label>
              <Input
                id="bankName"
                value={data.billing?.bankName || ''}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
                placeholder="Bank of America, Chase, etc."
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountType">Account Type *</Label>
              <Select
                value={data.billing?.accountType || ''}
                onValueChange={(value) => handleInputChange('accountType', value)}
              >
                <SelectTrigger className="border-slate-300 focus:border-blue-500">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200">
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name *</Label>
            <Input
              id="accountHolderName"
              value={data.billing?.accountHolderName || ''}
              onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
              placeholder="Name on the bank account"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="routingNumber">Routing Number *</Label>
              <Input
                id="routingNumber"
                value={data.billing?.routingNumber || ''}
                onChange={(e) => handleInputChange('routingNumber', e.target.value)}
                placeholder="9-digit routing number"
                maxLength={9}
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number *</Label>
              <Input
                id="accountNumber"
                value={data.billing?.accountNumber || ''}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                placeholder="Bank account number"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-slate-900">
                Billing Address
              </CardTitle>
              <CardDescription className="text-slate-600">
                Address for billing and statements
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="billingAddress">Street Address *</Label>
            <Input
              id="billingAddress"
              value={data.billing?.billingAddress || ''}
              onChange={(e) => handleInputChange('billingAddress', e.target.value)}
              placeholder="123 Main Street"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="billingCity">City *</Label>
              <Input
                id="billingCity"
                value={data.billing?.billingCity || ''}
                onChange={(e) => handleInputChange('billingCity', e.target.value)}
                placeholder="City"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingState">State *</Label>
              <Input
                id="billingState"
                value={data.billing?.billingState || ''}
                onChange={(e) => handleInputChange('billingState', e.target.value)}
                placeholder="State"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="billingZipCode">ZIP Code *</Label>
              <Input
                id="billingZipCode"
                value={data.billing?.billingZipCode || ''}
                onChange={(e) => handleInputChange('billingZipCode', e.target.value)}
                placeholder="12345"
                className="border-slate-300 focus:border-blue-500"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-3">
            <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center mt-0.5">
              <Shield className="h-4 w-4 text-white" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium text-blue-900">Security & Compliance</h3>
              <p className="text-sm text-blue-700">
                Your banking information is protected with bank-level encryption and is never stored in plain text. 
                We are PCI DSS Level 1 compliant and follow strict security protocols to protect your data.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  PCI DSS Level 1
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  256-bit Encryption
                </Badge>
                <Badge variant="outline" className="border-blue-200 text-blue-700">
                  SOC 2 Compliant
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingStep;
