
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class OnboardingErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Onboarding error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Log error for analytics/monitoring
    toast.error('Vyskytla sa neočakávaná chyba', {
      description: 'Prosím obnovte stránku alebo skúste znovu'
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="flex flex-col items-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              
              <div>
                <h3 className="text-lg font-semibold text-red-900">
                  Vyskytla sa chyba
                </h3>
                <p className="text-red-700 mt-2">
                  Niečo sa pokazilo pri načítavaní formulára. 
                  Prosím skúste obnoviť stránku.
                </p>
              </div>

              <div className="flex space-x-3">
                <Button 
                  onClick={this.handleReset}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Skúsiť znovu
                </Button>
                
                <Button 
                  onClick={() => window.location.reload()}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Obnoviť stránku
                </Button>
              </div>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left w-full">
                  <summary className="text-sm font-medium text-red-800 cursor-pointer">
                    Technické detaily (len pre vývoj)
                  </summary>
                  <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
