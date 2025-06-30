
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import MerchantAuthenticatedDashboard from "./MerchantAuthenticatedDashboard";
import { Loader2 } from "lucide-react";

const MerchantDashboard = () => {
  const navigate = useNavigate();
  const { user, userRole, isLoading } = useAuthRedirect();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/?role=merchant');
        return;
      }
      
      if (userRole && userRole !== 'merchant') {
        // Redirect based on actual role if not merchant
        switch (userRole) {
          case 'admin':
            navigate('/admin');
            break;
          case 'partner':
            navigate('/partner');
            break;
          default:
            navigate('/');
            break;
        }
      }
    }
  }, [user, userRole, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Načítavam...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  if (userRole !== 'merchant') {
    return null; // Will redirect
  }

  return <MerchantAuthenticatedDashboard />;
};

export default MerchantDashboard;
