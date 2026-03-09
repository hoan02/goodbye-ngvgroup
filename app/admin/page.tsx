'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Layout, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { getAllProfiles, createProfile, deleteProfile } from '@/app/actions/profile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { slugify } from '@/lib/utils';

export default function AdminPage() {
  const [profiles, setProfiles] = useState<{ _id: string; slug: string; name: string; role?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const fetchProfilesList = async () => {
    try {
      const data = await getAllProfiles();
      setProfiles(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      toast.error('Failed to load profiles');
    }
  };

  useEffect(() => {
    fetchProfilesList();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName) return;
    setIsCreating(true);
    
    const slug = slugify(newProfileName);
    
    try {
      const newProfile = await createProfile({ name: newProfileName, slug });
      if (newProfile) {
        setProfiles([...profiles, newProfile]);
        setNewProfileName('');
        setIsModalOpen(false);
        toast.success(`Profile "${newProfileName}" created!`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create profile. Slug might exist.';
      toast.error(message);
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    setProfileToDelete(id);
  };

  const confirmDelete = async () => {
    if (!profileToDelete) return;
    
    const toastId = toast.loading('Deleting profile...');
    try {
      await deleteProfile(profileToDelete);
      setProfiles(profiles.filter(p => p._id !== profileToDelete));
      toast.success('Profile deleted', { id: toastId });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error deleting profile';
      toast.error(message, { id: toastId });
      console.error(error);
    } finally {
      setProfileToDelete(null);
    }
  };

  if (loading) return <div className="p-8 text-center animate-pulse min-h-screen bg-background text-foreground flex justify-center items-center font-light uppercase tracking-widest">Loading Dashboard...</div>;

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 space-y-4">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors group"
          >
            <div className="p-1.5 rounded-full bg-card border border-border group-hover:bg-accent/10 group-hover:border-accent/30 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium tracking-tight">Back to Site</span>
          </Link>
          
          <div>
            <h1 className="text-4xl font-light tracking-tight mb-2 italic">Management Dashboard</h1>
            <p className="text-muted-foreground">Manage farewell profiles and configurations.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl hover:border-accent/40 hover:bg-accent/5 transition-all group h-full min-h-[200px]"
          >
            <Plus className="w-10 h-10 text-muted-foreground mb-4 group-hover:text-accent transition-colors" />
            <span className="font-medium">Create New Profile</span>
          </button>

          {profiles.map(profile => (
            <div key={profile._id} className="bg-card border border-border rounded-2xl p-6 flex flex-col h-full shadow-sm">
              <div className="flex items-center gap-4 mb-6 text-left">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center min-w-[3rem]">
                  <User className="w-6 h-6 text-accent" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-lg truncate w-full" title={profile.name}>{profile.name}</h3>
                  <p className="text-sm text-muted-foreground italic tracking-tight underline truncate" title={profile.slug}>{profile.slug}</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mb-8 flex-grow">
                <div className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Layout className="w-4 h-4" />
                  <span className="truncate">{profile.role || 'No role'}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto">
                <Link 
                  href={`/admin/profile/${profile._id}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm font-medium"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(profile._id)}
                  className="p-2 border border-border rounded-lg hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-card border border-border w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
            <h2 className="text-3xl font-light italic mb-2 tracking-tight">Create Profile</h2>
            <p className="text-muted-foreground mb-8 text-sm">Every journey begins with a name. Start yours here.</p>
            
            <form onSubmit={handleCreateProfile} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground font-bold ml-1">Full Name</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="e.g. Nguyễn Toàn" 
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  className="w-full bg-background border border-border rounded-2xl px-5 py-4 focus:ring-2 focus:ring-accent/20 outline-none transition-all text-lg"
                />
              </div>
              
              <div className="flex items-center gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-border rounded-2xl hover:bg-muted transition-colors font-medium"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isCreating || !newProfileName}
                  className="flex-1 px-6 py-3 bg-accent text-accent-foreground rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all font-bold shadow-lg shadow-accent/20"
                >
                  {isCreating ? 'Creating...' : 'Begin Journey'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={!!profileToDelete} onOpenChange={(open) => !open && setProfileToDelete(null)}>
        <AlertDialogContent className="rounded-3xl border-border bg-card/95 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-light italic">Delete Profile?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. This will permanently delete the profile and all associated journey data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 sm:gap-0">
            <AlertDialogCancel className="rounded-2xl border-border hover:bg-muted transition-colors">
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all font-bold shadow-lg shadow-destructive/20"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
