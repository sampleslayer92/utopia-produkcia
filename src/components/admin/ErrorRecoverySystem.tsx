
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, RefreshCw, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ErrorLog {
  id: string;
  contract_id?: string;
  step_number?: number;
  error_type: string;
  error_message: string;
  stack_trace?: string;
  resolved: boolean;
  created_at: string;
}

const ErrorRecoverySystem = () => {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchErrors();
  }, []);

  const fetchErrors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setErrors(data || []);
    } catch (error) {
      console.error('Error fetching error logs:', error);
      toast.error('Chyba pri načítavaní error logov');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsResolved = async (errorId: string) => {
    try {
      const { error } = await supabase
        .from('error_logs')
        .update({ resolved: true })
        .eq('id', errorId);

      if (error) throw error;

      setErrors(prev => prev.map(e => e.id === errorId ? { ...e, resolved: true } : e));
      toast.success('Chyba označená ako vyriešená');
    } catch (error) {
      console.error('Error marking as resolved:', error);
      toast.error('Chyba pri označovaní ako vyriešená');
    }
  };

  const unresolvedErrors = errors.filter(e => !e.resolved);
  const resolvedErrors = errors.filter(e => e.resolved);

  if (isLoading) {
    return (
      <Card className="border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Error Recovery System</CardTitle>
          <CardDescription>Načítava sa...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <p className="text-sm font-medium text-slate-600">Nevyriešené chyby</p>
                <p className="text-2xl font-bold text-red-600">{unresolvedErrors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-slate-600">Vyriešené chyby</p>
                <p className="text-2xl font-bold text-green-600">{resolvedErrors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-slate-600">Celkový počet chýb</p>
                <p className="text-2xl font-bold text-slate-900">{errors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Zoznam chýb</CardTitle>
              <CardDescription>Prehľad všetkých nahásených chýb v systéme</CardDescription>
            </div>
            <Button variant="outline" onClick={fetchErrors} size="sm">
              <RefreshCw className="h-4 w-4 mr-1" />
              Obnoviť
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errors.length === 0 ? (
              <p className="text-center text-slate-500 py-8">Žiadne chyby nenájdené</p>
            ) : (
              errors.map((error) => (
                <div
                  key={error.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={error.resolved ? "default" : "destructive"}>
                        {error.error_type}
                      </Badge>
                      {error.step_number && (
                        <Badge variant="outline">Krok {error.step_number}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mb-1">{error.error_message}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(error.created_at).toLocaleString('sk-SK')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedError(error)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {!error.resolved && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => markAsResolved(error.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Vyriešiť
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error Detail Modal */}
      {selectedError && (
        <Card className="border-red-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-red-800">Detail chyby</CardTitle>
              <Button variant="ghost" onClick={() => setSelectedError(null)}>
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-slate-700">Typ chyby:</p>
                <p className="text-slate-600">{selectedError.error_type}</p>
              </div>
              
              <div>
                <p className="font-medium text-slate-700">Správa:</p>
                <p className="text-slate-600">{selectedError.error_message}</p>
              </div>

              {selectedError.stack_trace && (
                <div>
                  <p className="font-medium text-slate-700">Stack trace:</p>
                  <pre className="text-xs bg-slate-100 p-2 rounded overflow-x-auto">
                    {selectedError.stack_trace}
                  </pre>
                </div>
              )}

              <div>
                <p className="font-medium text-slate-700">Čas vzniku:</p>
                <p className="text-slate-600">
                  {new Date(selectedError.created_at).toLocaleString('sk-SK')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ErrorRecoverySystem;
