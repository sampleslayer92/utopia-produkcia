import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { User, Mail, Phone, Upload, Key, Save } from 'lucide-react';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

const ProfileSettingsTab = () => {
  const { t } = useTranslation('admin');
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    avatar_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfileData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || user.email || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Chyba pri načítaní profilu');
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          email: profileData.email,
          phone: profileData.phone,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('Profil bol úspešne aktualizovaný');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Chyba pri aktualizácii profilu');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Nové heslá sa nezhodujú');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Nové heslo musí mať aspoň 6 znakov');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast.success('Heslo bolo úspešne zmenené');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Chyba pri zmene hesla');
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Osobné údaje
          </CardTitle>
          <CardDescription>
            Spravujte svoje osobné informácie a kontaktné údaje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profileData.avatar_url} />
                <AvatarFallback className="text-lg">
                  {getInitials(profileData.first_name, profileData.last_name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" size="sm" className="mb-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Nahrať fotku
                </Button>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG alebo GIF. Max. 5MB.
                </p>
              </div>
            </div>

            <Separator />

            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Krstné meno</Label>
                <Input
                  id="firstName"
                  value={profileData.first_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, first_name: e.target.value }))}
                  placeholder="Vaše krstné meno"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Priezvisko</Label>
                <Input
                  id="lastName"
                  value={profileData.last_name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, last_name: e.target.value }))}
                  placeholder="Vaše priezvisko"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">
                  <Mail className="h-4 w-4 inline mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="vas@email.com"
                />
              </div>
              <div>
                <Label htmlFor="phone">
                  <Phone className="h-4 w-4 inline mr-2" />
                  Telefón
                </Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+421 XXX XXX XXX"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Ukladám...' : 'Uložiť zmeny'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Zmena hesla
          </CardTitle>
          <CardDescription>
            Zmeňte si heslo pre váš účet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Súčasné heslo</Label>
              <Input
                id="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                placeholder="Vaše súčasné heslo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="newPassword">Nové heslo</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  placeholder="Nové heslo"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Potvrdiť nové heslo</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Potvrdiť heslo"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                <Key className="h-4 w-4 mr-2" />
                {isLoading ? 'Mením heslo...' : 'Zmeniť heslo'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Nastavenia účtu</CardTitle>
          <CardDescription>
            Ďalšie možnosti správy účtu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            <p>Notifikácie, preferenciemi jazyka a ďalšie nastavenia budú pridané v budúcich verziách</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettingsTab;