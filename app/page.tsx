import { db } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import Link from 'next/link';

export default async function Home() {
  const allProfiles = await db.select().from(profiles);

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center p-8 overflow-hidden sticky top-0">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 opacity-60 grayscale hover:grayscale-0 transition-all duration-1000"
          style={{ 
            backgroundImage: 'url(/images/Year_End_Party_NGV_Group.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Subtle Scroll Indicator at Bottom */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 text-center">
          <div className="animate-bounce">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3 font-light">Explore Memories</p>
            <div className="w-px h-16 bg-gradient-to-b from-accent/50 to-transparent mx-auto" />
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section className="relative z-20 min-h-screen bg-background p-8 md:p-24 flex flex-col items-center">
        <div className="max-w-6xl w-full">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-6xl font-light tracking-tight mb-4 italic">Memories & Farewells</h2>
            <p className="text-muted-foreground text-lg">Select a profile to begin the journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProfiles.length === 0 ? (
              <div className="col-span-full text-center p-20 border-2 border-dashed border-border rounded-3xl bg-card/10">
                <p className="text-xl text-muted-foreground mb-6">No farewell journeys created yet.</p>
                <Link href="/admin" className="inline-flex items-center justify-center px-8 py-3 bg-accent text-accent-foreground rounded-full font-bold hover:scale-105 transition-transform">
                  Create First Journey
                </Link>
              </div>
            ) : (
              allProfiles.map((profile) => (
                <Link 
                  key={profile.id}
                  href={`/farewell?profile=${profile.slug}`}
                  className="group relative overflow-hidden bg-card border border-border rounded-3xl p-1 aspect-[4/5] hover:border-accent/50 transition-all duration-500 shadow-xl flex flex-col"
                >
                  <div className="relative flex-grow overflow-hidden rounded-[calc(1.5rem-4px)] bg-muted/20">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center italic text-9xl font-black text-white/5 pointer-events-none group-hover:text-accent/10 transition-colors uppercase">
                      {profile.name.charAt(0)}
                    </div>
                    
                    <div className="absolute bottom-0 left-0 p-8 z-20 w-full transform group-hover:-translate-y-2 transition-transform duration-500">
                      <p className="text-accent text-sm font-bold tracking-widest uppercase mb-2 opacity-0 group-hover:opacity-100 transition-opacity">Discover Journey</p>
                      <h3 className="text-3xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                        {profile.name}
                      </h3>
                      <p className="text-white/60 font-medium">
                        {profile.role || 'Team Member'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="mt-32 pt-16 border-t border-border flex flex-col items-center gap-6">
            <p className="text-muted-foreground italic font-light tracking-widest uppercase text-xs">Admin Access</p>
            <Link 
              href="/admin" 
              className="px-10 py-3 border border-border rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all"
            >
              Management Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
