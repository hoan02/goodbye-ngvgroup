'use client';

import { useState, useEffect } from 'react';
import { Save, ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ProfileEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/profiles/detail?id=${id}`)
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving changes...');
    try {
      const response = await fetch('/api/profiles/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (response.ok) {
        router.refresh();
        toast.success('Changes saved!', { id: toastId });
      } else {
        toast.error('Failed to save', { id: toastId });
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
      toast.error('Something went wrong', { id: toastId });
    }
    setSaving(false);
  };

  const addSection = () => {
    const newSection = {
      profileId: profile.id,
      title: 'New Section',
      type: 'text',
      content: '',
      order: profile.sections?.length || 0,
    };
    setProfile({
      ...profile,
      sections: [...(profile.sections || []), newSection],
    });
  };

  const removeSection = (index: number) => {
    const newSections = [...(profile.sections || [])];
    newSections.splice(index, 1);
    setProfile({ ...profile, sections: newSections });
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...(profile.sections || [])];
    newSections[index] = { ...newSections[index], [field]: value };
    setProfile({ ...profile, sections: newSections });
  };

  if (loading) return <div className="p-8 text-center animate-pulse">Loading Profile...</div>;
  if (!profile) return <div className="p-8 text-center text-destructive">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/admin" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all font-medium"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <div className="space-y-8">
          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-accent" />
              Identity Configuration
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Unique ID (Slug)</label>
                <input 
                  type="text" 
                  value={profile.slug} 
                  disabled
                  className="w-full bg-muted border border-border rounded-lg px-4 py-2 opacity-60 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Role</label>
                <input 
                  type="text" 
                  value={profile.role || ''} 
                  onChange={(e) => setProfile({...profile, role: e.target.value})}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Department</label>
                <input 
                  type="text" 
                  value={profile.department || ''} 
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  placeholder="e.g. Engineering"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-card border border-border rounded-2xl p-6 shadow-sm">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-semibold flex items-center gap-2">
                 <Layout className="w-5 h-5 text-accent" />
                 Farewell Sections
               </h2>
               <button 
                 onClick={addSection}
                 className="text-sm text-accent hover:underline flex items-center gap-1"
               >
                 <Plus className="w-4 h-4" />
                 Add Section
               </button>
             </div>
             
             <div className="space-y-4">
               {profile.sections?.map((section: any, idx: number) => (
                 <div key={section.id || idx} className="flex gap-4 p-4 border border-border rounded-xl bg-background/50 group">
                    <div className="mt-2 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity cursor-grab">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div className="flex-grow space-y-3">
                      <div className="flex items-center justify-between">
                        <input 
                          type="text" 
                          value={section.title}
                          onChange={(e) => updateSection(idx, 'title', e.target.value)}
                          className="font-medium bg-transparent border-none focus:ring-0 p-0 text-lg w-full"
                        />
                        <button 
                          onClick={() => removeSection(idx)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea 
                        className="w-full bg-background border border-border rounded-lg p-3 text-sm min-h-[80px] outline-none"
                        value={section.content || ''}
                        onChange={(e) => updateSection(idx, 'content', e.target.value)}
                        placeholder="Content message..."
                      />
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

function User({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function Layout({ className }: { className?: string }) { return <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg> }
