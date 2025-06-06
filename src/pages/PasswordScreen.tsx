
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PasswordScreen = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const correctPassword = "9211";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate a brief loading period
    setTimeout(() => {
      if (password === correctPassword) {
        localStorage.setItem('utopia_password_verified', 'true');
        navigate('/home');
      } else {
        setError("Nesprávne heslo. Skúste znova.");
        setPassword("");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-12">
          <img 
            src="https://famouscreative.eu/wp-content/uploads/2025/06/logo_utopia_svg.svg" 
            alt="Utopia Logo" 
            className="h-20 w-auto mx-auto mb-8 animate-fade-in"
          />
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent leading-tight animate-fade-in">
              Chránený prístup
            </h1>
            <p className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent animate-fade-in">
              Zadajte heslo pre pokračovanie
            </p>
          </div>
        </div>

        {/* Password Form */}
        <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Lock className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Zadajte heslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10 h-12 text-center text-lg tracking-widest"
                    autoFocus
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg animate-fade-in">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold"
                  disabled={!password || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Overujem...
                    </div>
                  ) : (
                    "Pokračovať"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
            <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Utopia Research Lab 2025
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordScreen;
