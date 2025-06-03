
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Zap, Globe, Users, CreditCard, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Secure Processing",
      description: "Bank-grade security with PCI DSS compliance"
    },
    {
      icon: Zap,
      title: "Instant Setup",
      description: "Get started in minutes with our streamlined onboarding"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Accept payments from customers worldwide"
    },
    {
      icon: Users,
      title: "Multi-Role Access",
      description: "Manage partners, merchants, and clients seamlessly"
    },
    {
      icon: CreditCard,
      title: "All Payment Types",
      description: "Cards, ACH, digital wallets, and more"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Real-time insights and detailed reporting"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Header */}
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                PayFlow
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">
                Sign In
              </Button>
              <Button 
                onClick={() => navigate('/onboarding')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0">
              New
            </Badge>
            <span className="text-sm text-blue-700">Multi-role payment platform</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent leading-tight">
            Payment Processing
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Reimagined
            </span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Streamline your payment operations with our comprehensive platform designed for ISO organizations, business partners, and merchants.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl shadow-blue-500/25 h-12 px-8"
            >
              Start Onboarding
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 px-8"
            >
              View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Everything you need to manage payments
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From onboarding to analytics, our platform provides all the tools you need for efficient payment processing management.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-slate-200/60 hover:border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-slate-900">{feature.title}</CardTitle>
                <CardDescription className="text-slate-600">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Role-Based Access Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Built for every role in your organization
          </h2>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50/50">
            <CardHeader>
              <Badge className="w-fit bg-emerald-100 text-emerald-700 border-emerald-200">
                Admin
              </Badge>
              <CardTitle className="text-emerald-900">ISO Organization</CardTitle>
              <CardDescription className="text-emerald-700">
                Complete platform oversight with full access to all merchants, partners, and system settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-emerald-700">
                <li>• Manage all partners and merchants</li>
                <li>• System-wide analytics and reporting</li>
                <li>• Platform configuration and settings</li>
                <li>• Revenue tracking and commissions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/50">
            <CardHeader>
              <Badge className="w-fit bg-blue-100 text-blue-700 border-blue-200">
                Partner
              </Badge>
              <CardTitle className="text-blue-900">Business Partner</CardTitle>
              <CardDescription className="text-blue-700">
                Manage your merchant portfolio with dedicated tools for client relationship management.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-blue-700">
                <li>• Onboard new merchant clients</li>
                <li>• Monitor client transactions</li>
                <li>• Access partner-specific reporting</li>
                <li>• Manage support tickets</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50/50">
            <CardHeader>
              <Badge className="w-fit bg-purple-100 text-purple-700 border-purple-200">
                Merchant
              </Badge>
              <CardTitle className="text-purple-900">Merchant Client</CardTitle>
              <CardDescription className="text-purple-700">
                Access your payment data, transaction history, and account management tools.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-purple-700">
                <li>• View transaction history</li>
                <li>• Monitor device status</li>
                <li>• Access billing information</li>
                <li>• Submit support requests</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 border-0 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to streamline your payment operations?
            </h2>
            <p className="text-blue-100 mb-8 text-lg max-w-2xl mx-auto">
              Join hundreds of organizations already using PayFlow to manage their payment processing ecosystem.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/onboarding')}
              className="bg-white text-blue-600 hover:bg-blue-50 h-12 px-8 shadow-xl"
            >
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50/50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <CreditCard className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold text-slate-900">PayFlow</span>
            </div>
            <p className="text-sm text-slate-600">
              © 2025 PayFlow. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
