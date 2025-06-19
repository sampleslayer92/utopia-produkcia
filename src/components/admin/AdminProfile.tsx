
import { Button } from "@/components/ui/button";
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

const AdminProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored auth data if needed
    navigate('/');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start p-3 h-auto hover:bg-slate-50">
          <div className="flex items-center space-x-3 w-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" alt="ML" />
              <AvatarFallback className="bg-blue-600 text-white">ML</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <div className="font-medium text-slate-900 text-sm">Marián Lapoš</div>
              <div className="text-xs text-slate-600">Iso organizácia Onepos</div>
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
  );
};

export default AdminProfile;
