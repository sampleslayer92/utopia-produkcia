
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const AdminProfile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast.success('Úspešne odhlásený');
    } catch (error) {
      toast.error('Chyba pri odhlásení');
    }
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const getDisplayName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <Card className="p-3 bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2 h-auto">
            <div className="flex items-center space-x-3 w-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="" alt={getInitials(user?.email || '')} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {getInitials(user?.email || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="font-medium text-slate-900 text-sm">
                  {getDisplayName(user?.email || '')}
                </div>
                <div className="text-xs text-slate-600">Admin</div>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" />
            Profil
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Nastavenia
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Odhlásiť sa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
};

export default AdminProfile;
