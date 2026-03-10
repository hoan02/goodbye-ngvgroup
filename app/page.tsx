import Link from 'next/link';
import { getAllProfiles } from '@/app/actions/profile';

export default async function Home() {
  const allProfiles = await getAllProfiles();

  return (
    <div className="relative min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col items-center justify-center p-8 overflow-hidden sticky top-0 bg-black">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            backgroundImage: 'url(/images/Year_End_Party_NGV_Group.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        
        {/* Subtle Scroll Indicator at Bottom */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 text-center">
          <div className="animate-bounce">
            <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-3 font-light">Explore Memories</p>
            <div className="w-px h-8 bg-gradient-to-b from-accent/50 to-transparent mx-auto" />
          </div>
        </div>
      </section>

      {/* Profiles Section */}
      <section id="profiles" className="relative z-20 min-h-screen bg-background p-8 md:p-24 flex flex-col items-center shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <div className="max-w-6xl w-full">
          <div className="mb-24 text-center space-y-4">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-gradient-to-br from-foreground via-foreground/80 to-accent text-transparent bg-clip-text">Memories & Farewells</h2>
            <p className="text-muted-foreground text-xl md:text-2xl font-light italic tracking-wide">Select a profile to begin the journey</p>
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
              allProfiles.map((profile: { _id: string; slug: string; name: string; role?: string; thumbUrl?: string }) => (
                <Link 
                  key={profile._id}
                  href={`/farewell?profile=${profile.slug}`}
                  className="group relative overflow-hidden rounded-[2rem] p-[2px] aspect-[4/5] transition-all duration-700 shadow-xl hover:shadow-2xl hover:shadow-accent/20 flex flex-col hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-border/40 to-muted/10 group-hover:from-accent/60 group-hover:to-accent/20 transition-all duration-700" />
                  <div className="relative flex-grow overflow-hidden rounded-[calc(2rem-2px)] bg-card border border-transparent/10">
                    {profile.thumbUrl ? (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-[1.15] opacity-90 group-hover:opacity-100"
                          style={{ backgroundImage: `url(${profile.thumbUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 z-10 opacity-80 group-hover:opacity-90 transition-opacity duration-700" />
                      </>
                    ) : (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted/20 z-10" />
                        <div className="absolute inset-0 flex items-center justify-center italic text-9xl font-black text-foreground/5 pointer-events-none group-hover:text-accent/10 transition-colors uppercase duration-700">
                          {profile.name.charAt(0)}
                        </div>
                      </>
                    )}
                    
                    <div className="absolute bottom-0 left-0 p-8 md:p-10 z-20 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out flex flex-col justify-end h-full">
                      <div className="mt-auto">
                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-500 drop-shadow-lg tracking-tight">
                          {profile.name}
                        </h3>
                        <p className="text-white/60 font-medium">
                          {profile.role || 'Team Member'}
                        </p>
                      </div>
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
