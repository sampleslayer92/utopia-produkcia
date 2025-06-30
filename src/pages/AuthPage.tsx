
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Mail, Lock, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { user, userRole, isLoading: authLoading, redirectBasedOnRole } = useAuthRedirect();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [loginField, setLoginField] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const requestedRole = searchParams.get('role');

  useEffect(() => {
    if (!authLoading && user && userRole) {
      redirectBasedOnRole();
    }
  }, [user, userRole, authLoading, redirectBasedOnRole]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        let actualEmail = email;
        let actualPassword = password;

        // Pre admin rolu - jednoduché mapovanie
        if (requestedRole === 'admin') {
          if (loginField.toLowerCase() === 'admin') {
            actualEmail = 'admin@example.com';
            actualPassword = password; // Použiť zadané heslo
          } else {
            // Ak niekto zadal priamo email, použiť to
            actualEmail = loginField.includes('@') ? loginField : `${loginField}@example.com`;
            actualPassword = password;
          }
        } else {
          // Pre ostatné role použiť štandardný email
          actualEmail = email;
          actualPassword = password;
        }

        console.log('Pokúšam sa prihlásiť s:', {
          actualEmail,
          passwordProvided: !!actualPassword,
          requestedRole
        });

        const { data, error } = await supabase.auth.signInWithPassword({
          email: actualEmail,
          password: actualPassword,
        });

        if (error) {
          console.error('Chyba pri prihlásení:', error);
          throw error;
        }

        console.log('Prihlásenie úspešné:', data);

        toast({
          title: "Prihlásenie úspešné",
          description: "Vitajte späť!",
        });
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl
          }
        });

        if (error) throw error;

        toast({
          title: "Registrácia úspešná",
          description: "Skontrolujte svoj email pre potvrdenie účtu.",
        });
      }
    } catch (error: any) {
      console.error('Chyba autentifikácie:', error);
      
      let errorMessage = "Nastala chyba pri autentifikácii.";
      
      if (error.message?.includes('Invalid login credentials')) {
        if (requestedRole === 'admin') {
          errorMessage = "Nesprávny login alebo heslo. Pre admin prístup zadajte login 'admin' a heslo 'Admin123'.";
        } else {
          errorMessage = "Nesprávny email alebo heslo.";
        }
      }
      
      toast({
        title: "Chyba",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-900">
              {isLogin ? 'Prihlásenie' : 'Registrácia'}
              {requestedRole && (
                <span className="block text-sm font-normal text-slate-600 mt-1">
                  {requestedRole === 'merchant' && 'Merchant Dashboard'}
                  {requestedRole === 'admin' && 'Admin Dashboard'}
                  {requestedRole === 'partner' && 'Partner Dashboard'}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              {/* Admin role má špeciálny login field */}
              {requestedRole === 'admin' && isLogin ? (
                <div className="space-y-2">
                  <Label htmlFor="login">Login</Label>
                  <div className="relative">
                    <User className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <Input
                      id="login"
                      type="text"
                      value={loginField}
                      onChange={(e) => setLoginField(e.target.value)}
                      className="pl-10"
                      placeholder="admin"
                      required
                    />
                  </div>
                  <div className="text-xs text-slate-500">
                    Zadajte: <strong>admin</strong>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      placeholder="vas.email@example.com"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="password">Heslo</Label>
                <div className="relative">
                  <Lock className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {requestedRole === 'admin' && isLogin && (
                  <div className="text-xs text-slate-500">
                    Zadajte: <strong>Admin123</strong>
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {isLogin ? 'Prihlásiť sa' : 'Registrovať sa'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-slate-600"
              >
                {isLogin ? 'Nemáte účet? Registrujte sa' : 'Už máte účet? Prihláste sa'}
              </Button>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Späť na hlavnú stránku
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
