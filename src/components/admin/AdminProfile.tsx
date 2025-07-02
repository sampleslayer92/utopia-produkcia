
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, User, Settings, LogOut, Shield } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useSidebar } from "@/components/ui/sidebar";

const AdminProfile = () => {
  const { t } = useTranslation('admin');
  const { profile, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const { state } = useSidebar();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Úspešne odhlásený');
      navigate('/auth');
    } catch (error) {
      toast.error('Chyba pri odhlásení');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500 text-white border-0';
      case 'partner':
        return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0';
      case 'merchant':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0';
      default:
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0';
    }
  };

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full p-3 h-auto rounded-xl transition-all duration-200 hover:bg-blue-50/50 hover:shadow-md ${
            state === "collapsed" ? "justify-center" : "justify-start"
          }`}
        >
          <div className={`flex items-center w-full ${
            state === "collapsed" ? "justify-center" : "space-x-3"
          }`}>
            <Avatar className="h-10 w-10 shadow-lg">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-semibold">
                {profile.first_name?.[0]}{profile.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            {state === "expanded" && (
              <>
                <div className="flex-1 text-left">
                  <div className="font-medium text-sm">{profile.first_name} {profile.last_name}</div>
                  <div className="text-xs text-slate-500 truncate">{profile.email}</div>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center justify-between">
            <span>Môj účet</span>
            {userRole && (
              <Badge className={getRoleBadgeColor(userRole.role)} variant="outline">
                <Shield className="h-3 w-3 mr-1" />
                {userRole.role.toUpperCase()}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Nastavenia</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Odhlásiť sa</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminProfile;
