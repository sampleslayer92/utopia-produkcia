
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

const OnboardingHeader = () => {
  return (
    <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Utopia
            </span>
          </div>
          <Badge variant="outline" className="border-blue-200 text-blue-700">
            Registrácia obchodníka
          </Badge>
        </div>
      </div>
    </header>
  );
};

export default OnboardingHeader;
