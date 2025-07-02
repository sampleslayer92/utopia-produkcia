
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
        return 'bg-red-100 text-red-700';
      case 'partner':
        return 'bg-blue-100 text-blue-700';
      case 'merchant':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={`w-full p-2 h-auto ${
            state === "collapsed" ? "justify-center" : "justify-start"
          }`}
        >
          <div className={`flex items-center w-full ${
            state === "collapsed" ? "justify-center" : "space-x-3"
          }`}>
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
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
