import { Skeleton } from "@/components/ui/skeleton";
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors group"
          >
            <div className="p-1.5 rounded-full bg-card border border-border group-hover:bg-accent/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium tracking-tight">Back to Site</span>
          </Link>
          
          <div>
            <Skeleton className="h-10 w-80 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl h-full min-h-[200px] opacity-50">
            <Plus className="w-10 h-10 text-muted-foreground mb-4" />
            <Skeleton className="h-5 w-32" />
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="w-12 h-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-full max-w-[150px]" />
                  <Skeleton className="h-4 w-full max-w-[100px]" />
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-8 flex-grow">
                <Skeleton className="h-4 w-32" />
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <Skeleton className="h-9 flex-1 rounded-lg" />
                <Skeleton className="h-9 w-9 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
