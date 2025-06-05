
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface OnboardingLoadingStateProps {
  type?: 'form' | 'sidebar' | 'full';
}

const OnboardingLoadingState = ({ type = 'form' }: OnboardingLoadingStateProps) => {
  if (type === 'sidebar') {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-2 w-full" />
        <div className="space-y-3 mt-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <Skeleton className="h-7 w-7 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'full') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="p-6">
          <Skeleton className="h-16 w-full mb-6" />
        </div>
        
        <div className="flex">
          <div className="w-64">
            <OnboardingLoadingState type="sidebar" />
          </div>
          
          <div className="flex-1 p-6">
            <Card>
              <CardContent className="p-8">
                <OnboardingLoadingState type="form" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Default form loading state
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-56" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLoadingState;
