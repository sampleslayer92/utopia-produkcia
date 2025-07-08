
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, User, Settings } from 'lucide-react';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentUser, setShowCurrentUser] = useState(false);
  
  const { user, profile, userRole, signIn, signUp, signOut, clearSession } = useAuth();
  const navigate = useNavigate();

  // Debug current auth state
  useEffect(() => {
    if (user) {
      console.log('🔍 [AuthPage Debug] Current user:', user.email);
      console.log('🔍 [AuthPage Debug] Current profile:', profile);
      console.log('🔍 [AuthPage Debug] Current role:', userRole?.role);
    }
  }, [user, profile, userRole]);

  // Don't auto-redirect - let user choose what to do
  useEffect(() => {
    if (user && userRole && !showCurrentUser) {
      console.log('🔍 [AuthPage Debug] User is logged in, showing current user info');
      setShowCurrentUser(true);
    }
  }, [user, userRole, showCurrentUser]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signIn(email, password);
    
    if (error) {
      setError(error.message);
    } else {
      // Navigate based on role
      setTimeout(() => {
        if (userRole?.role === 'admin') {
          navigate('/admin');
        } else if (userRole?.role === 'partner') {
          navigate('/partner');
        } else if (userRole?.role === 'merchant') {
          navigate('/merchant');
        }
      }, 100);
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { error } = await signUp(email, password, firstName, lastName);
    
    if (error) {
      setError(error.message);
    } else {
      setError('');
      alert('Registrácia úspešná! Skontrolujte email pre potvrdenie účtu.');
    }
    
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowCurrentUser(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleClearSession = async () => {
    await clearSession();
    setShowCurrentUser(false);
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleContinueAsCurrent = () => {
    if (userRole?.role === 'admin') {
      navigate('/admin');
    } else if (userRole?.role === 'partner') {
      navigate('/partner');
    } else if (userRole?.role === 'merchant') {
      navigate('/merchant');
    }
  };

  // If user is logged in, show current user options
  if (showCurrentUser && user && userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardHeader className="text-center">
              <User className="mx-auto h-12 w-12 text-blue-600" />
              <CardTitle className="text-2xl">Aktuálny používateľ</CardTitle>
              <CardDescription>
                Ste už prihlásený do systému
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Email:</p>
                <p className="font-medium">{user.email}</p>
                
                <p className="text-sm text-gray-600 mb-1 mt-3">Meno:</p>
                <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                
                <p className="text-sm text-gray-600 mb-1 mt-3">Rola:</p>
                <p className="font-medium capitalize">{userRole.role}</p>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={handleContinueAsCurrent}
                  className="w-full"
                  size="lg"
                >
                  Pokračovať ako {profile?.first_name || user.email}
                </Button>
                
                <Button 
                  onClick={() => setShowCurrentUser(false)}
                  variant="outline"
                  className="w-full"
                >
                  Prihlásiť iný účet
                </Button>
                
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="w-full"
                >
                  Odhlásiť sa
                </Button>
              </div>

              <div className="border-t pt-4">
                <Button 
                  onClick={handleClearSession}
                  variant="destructive"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Vyčistiť session (debug)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Prihlásiť sa do účtu
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Alebo si vytvorte nový účet
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Prihlásenie</TabsTrigger>
                <TabsTrigger value="signup">Registrácia</TabsTrigger>
              </TabsList>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="vas@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Heslo</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Prihlasuje sa...' : 'Prihlásiť sa'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Meno</Label>
                      <Input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        placeholder="Ján"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Priezvisko</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        placeholder="Novák"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="vas@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="signupPassword">Heslo</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      minLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Vytvára sa účet...' : 'Vytvoriť účet'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
