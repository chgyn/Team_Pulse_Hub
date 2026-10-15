import { Skeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Skeleton Hero Match Card */}
      <Card className="h-64 flex flex-col justify-between p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-3 items-center py-4">
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-slate-800">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </Card>

      {/* Skeleton Recent Form */}
      <Card className="h-28 p-5 flex flex-col justify-between">
        <Skeleton className="h-4 w-40" />
        <div className="flex justify-between gap-3">
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
          <Skeleton className="h-12 flex-1 rounded-xl" />
        </div>
      </Card>

      {/* Skeleton Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna 1: Classificação */}
        <div className="lg:col-span-7">
          <Card className="h-[520px] p-5 space-y-4">
            <Skeleton className="h-6 w-48" />
            <div className="space-y-2 pt-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-lg" />
              ))}
            </div>
          </Card>
        </div>

        {/* Coluna 2: Stats e Performers */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="h-64 p-5 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
            <Skeleton className="h-10 rounded-xl" />
          </Card>
          <Card className="h-64 p-5 space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-16 rounded-xl" />
            <Skeleton className="h-16 rounded-xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}
