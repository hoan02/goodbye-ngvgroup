import { Skeleton } from "@/components/ui/skeleton";
import { Save, ArrowLeft, User, Layout } from 'lucide-react';
import Link from 'next/link';

export function ProfileEditorSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/admin" className="flex items-center gap-3 text-muted-foreground transition-all group">
            <div className="p-2 rounded-full border border-border group-hover:border-accent/30 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Admin Dashboard</span>
          </Link>
          <button 
            disabled
            className="flex items-center gap-2 px-8 py-3 bg-accent/50 text-accent-foreground/50 rounded-2xl cursor-not-allowed font-bold"
          >
            <Save className="w-5 h-5" />
            Lưu Thay Đổi
          </button>
        </div>

        <div className="space-y-12">
          <section className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-accent opacity-50" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Identity Configuration</h2>
                <Skeleton className="h-4 w-48 mt-1" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-12 w-full rounded-2xl" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Layout className="w-5 h-5 text-accent opacity-50" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Farewell Content Sections</h2>
                    <Skeleton className="h-4 w-64 mt-1" />
                  </div>
               </div>
               <Skeleton className="h-9 w-32 rounded-xl" />
             </div>
             
             <div className="space-y-4">
               {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-4 p-6 border border-border rounded-3xl bg-card">
                    <div className="mt-1 h-12 flex items-center opacity-20">
                      <Skeleton className="w-6 h-6 rounded-full" />
                    </div>
                    
                    <div className="flex-grow space-y-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 flex-grow">
                          <Skeleton className="w-8 h-6 rounded" />
                          <Skeleton className="h-8 w-48" />
                        </div>
                        <Skeleton className="w-10 h-10 rounded-xl" />
                      </div>
                      <Skeleton className="h-32 w-full rounded-2xl" />
                    </div>
                  </div>
               ))}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
