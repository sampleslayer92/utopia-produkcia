
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingData } from "@/types";

interface CompanyInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const CompanyInfoStep = ({ data, updateData }: CompanyInfoStepProps) => {
  const handleInputChange = (field: string, value: string) => {
    updateData({
      company: {
        ...data.company,
        [field]: value
      }
    });
  };

  return (
    <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-slate-900">Company Information</CardTitle>
        <CardDescription className="text-slate-600">
          Tell us about your business to get started with payment processing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="companyName">Legal Business Name *</Label>
            <Input
              id="companyName"
              value={data.company.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter your legal business name"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ein">EIN (Tax ID) *</Label>
            <Input
              id="ein"
              value={data.company.ein || ''}
              onChange={(e) => handleInputChange('ein', e.target.value)}
              placeholder="XX-XXXXXXX"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="dba">DBA (Doing Business As)</Label>
            <Input
              id="dba"
              value={data.company.dba || ''}
              onChange={(e) => handleInputChange('dba', e.target.value)}
              placeholder="If different from legal name"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={data.company.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.example.com"
              className="border-slate-300 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select
              value={data.company.industry || ''}
              onValueChange={(value) => handleInputChange('industry', value)}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
                <SelectItem value="professional_services">Professional Services</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="non_profit">Non-Profit</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type *</Label>
            <Select
              value={data.company.businessType || ''}
              onValueChange={(value) => handleInputChange('businessType', value)}
            >
              <SelectTrigger className="border-slate-300 focus:border-blue-500">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="corporation">Corporation</SelectItem>
                <SelectItem value="llc">LLC</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="sole_proprietorship">Sole Proprietorship</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="yearEstablished">Year Established *</Label>
          <Input
            id="yearEstablished"
            type="number"
            value={data.company.yearEstablished || ''}
            onChange={(e) => handleInputChange('yearEstablished', e.target.value)}
            placeholder="YYYY"
            min="1900"
            max={new Date().getFullYear()}
            className="border-slate-300 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Business Description</Label>
          <Textarea
            id="description"
            value={data.company.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Briefly describe your business and what you sell..."
            rows={4}
            className="border-slate-300 focus:border-blue-500"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoStep;
