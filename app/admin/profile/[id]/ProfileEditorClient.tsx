'use client';

import * as React from 'react';
import { useState } from 'react';
import { Save, ArrowLeft, Plus, Trash2, GripVertical, User, Layout, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Reorder, AnimatePresence } from 'framer-motion';
import { updateProfile } from '@/app/actions/profile';

interface Section {
  _id?: string;
  tempId: string;
  title: string;
  content: string;
  type?: string;
}

export interface ProfileData {
  _id: string;
  name: string;
  slug: string;
  role?: string;
  department?: string;
  thumbUrl?: string;
  sections: Section[];
}

export default function ProfileEditorClient({ initialProfile }: { initialProfile: ProfileData }) {
  const router = useRouter();
  
  const [profile, setProfile] = useState<ProfileData>(() => ({
    ...initialProfile,
    sections: (initialProfile.sections || []).map((s: Section, i: number) => ({
      ...s,
      tempId: s._id || `temp-${i}-${Date.now()}`
    }))
  }));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const toastId = toast.loading('Saving changes...');
    try {
      // Remove temp IDs before saving
      const dataToSave = {
        ...profile,
        sections: profile.sections.map((s: Section) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { tempId, ...rest } = s;
          return rest;
        })
      };
      const result = await updateProfile(dataToSave);
      if (result) {
        toast.success('Changes saved!', { id: toastId });
        router.refresh();
      }
    } catch (error: unknown) {
      console.error('Failed to save profile:', error);
      const message = error instanceof Error ? error.message : "Something went wrong";
      toast.error(message, { id: toastId });
    }
    setSaving(false);
  };

  const addSection = (index: number = -1) => {
    if (!profile) return;
    const newSection: Section = {
      title: 'New Section',
      type: 'text',
      content: '',
      tempId: `new-${Date.now()}`
    };
    
    const newSections = [...(profile.sections || [])];
    if (index === -1) {
      newSections.push(newSection);
    } else {
      newSections.splice(index, 0, newSection);
    }
    
    setProfile({ ...profile, sections: newSections });
  };

  const removeSection = (tempId: string) => {
    if (!profile) return;
    const newSections = profile.sections.filter((s: Section) => s.tempId !== tempId);
    setProfile({ ...profile, sections: newSections });
  };

  const updateSection = (tempId: string, field: string, value: string) => {
    if (!profile) return;
    const newSections = profile.sections.map((s: Section) => 
      s.tempId === tempId ? { ...s, [field]: value } : s
    );
    setProfile({ ...profile, sections: newSections });
  };

  const setSectionsOrder = (newSections: Section[]) => {
    if (!profile) return;
    setProfile({ ...profile, sections: newSections });
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8 pb-32">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <Link href="/admin" className="flex items-center gap-3 text-muted-foreground hover:text-accent transition-all group">
            <div className="p-2 rounded-full border border-border group-hover:border-accent/30 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Admin Dashboard</span>
          </Link>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-accent text-accent-foreground rounded-2xl hover:opacity-90 disabled:opacity-50 transition-all font-bold shadow-xl shadow-accent/20"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Cân bằng vũ trụ...' : 'Lưu Thay Đổi'}
          </button>
        </div>

        <div className="space-y-12">
          <section className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight">Identity Configuration</h2>
                <p className="text-sm text-muted-foreground">Cấu hình thông tin cơ bản của nhân vật.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-background border border-border rounded-2xl px-5 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all font-medium"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Unique ID</label>
                <input 
                  type="text" 
                  value={profile.slug} 
                  disabled
                  className="w-full bg-muted/50 border border-border rounded-2xl px-5 py-3 opacity-60 cursor-not-allowed font-mono text-sm"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Role / Position</label>
                <input 
                  type="text" 
                  value={profile.role || ''} 
                  onChange={(e) => setProfile({...profile, role: e.target.value})}
                  placeholder="e.g. Lead Designer"
                  className="w-full bg-background border border-border rounded-2xl px-5 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">Department</label>
                <input 
                  type="text" 
                  value={profile.department || ''} 
                  onChange={(e) => setProfile({...profile, department: e.target.value})}
                  placeholder="e.g. Creative Production"
                  className="w-full bg-background border border-border rounded-2xl px-5 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                />
              </div>
              
              <div className="space-y-3 md:col-span-2 border-t border-border pt-6 mt-2">
                <div className="flex items-center justify-between mb-2">
                   <label className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1 flex items-center gap-2">
                     <ImageIcon className="w-3 h-3" />
                     Profile Thumbnail URL
                   </label>
                </div>
                <div className="flex gap-4 items-start">
                   <div className="flex-grow">
                      <input 
                        type="url" 
                        value={profile.thumbUrl || ''} 
                        onChange={(e) => setProfile({...profile, thumbUrl: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-background border border-border rounded-2xl px-5 py-3 focus:ring-2 focus:ring-accent/20 outline-none transition-all"
                      />
                      <p className="text-xs text-muted-foreground mt-2 ml-1">This image will appear on the memories selection screen.</p>
                   </div>
                   {profile.thumbUrl && (
                     <div 
                       className="w-16 h-16 rounded-xl border-2 border-border bg-cover bg-center shrink-0"
                       style={{ backgroundImage: `url(${profile.thumbUrl})` }}
                     />
                   )}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-6">
             <div className="flex items-center justify-between px-2">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Layout className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">Farewell Content Sections</h2>
                    <p className="text-sm text-muted-foreground">Sắp xếp các cột mốc và nội dung tri ân.</p>
                  </div>
               </div>
               <button 
                 onClick={() => addSection(0)}
                 className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-xl hover:bg-accent hover:text-accent-foreground transition-all text-sm font-bold"
               >
                 <Plus className="w-4 h-4" />
                 Thêm ở đầu
               </button>
             </div>
             
             <div className="relative">
               <Reorder.Group 
                 axis="y" 
                 values={profile.sections || []} 
                 onReorder={setSectionsOrder}
                 className="space-y-4"
               >
                 <AnimatePresence initial={false}>
                   {profile.sections?.map((section: Section, idx: number) => (
                     <React.Fragment key={section.tempId}>
                       <Reorder.Item 
                         value={section}
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         className="group relative"
                       >
                         <div className="flex gap-4 p-6 border border-border rounded-3xl bg-card hover:border-accent/30 transition-all shadow-sm active:shadow-xl active:scale-[0.99] active:border-accent">
                            <div className="mt-1 text-muted-foreground opacity-20 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing shrink-0 h-12 flex items-center">
                              <GripVertical className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-grow space-y-4">
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3 flex-grow">
                                  <span className="text-xs font-black bg-muted px-2 py-1 rounded text-muted-foreground tabular-nums">#{idx + 1}</span>
                                  <input 
                                    type="text" 
                                    value={section.title}
                                    onChange={(e) => updateSection(section.tempId, 'title', e.target.value)}
                                    placeholder="Section Title"
                                    className="font-bold bg-transparent border-none focus:ring-0 p-0 text-xl w-full placeholder:opacity-30 outline-none"
                                  />
                                </div>
                                <button 
                                  onClick={() => removeSection(section.tempId)}
                                  className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-destructive rounded-xl transition-all shrink-0"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <textarea 
                                className="w-full bg-background border border-border rounded-2xl p-4 text-base min-h-[120px] outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                                value={section.content || ''}
                                onChange={(e) => updateSection(section.tempId, 'content', e.target.value)}
                                placeholder="Viết những lời tri ân, kỷ niệm tại đây..."
                              />
                            </div>
                         </div>
                       </Reorder.Item>

                       {/* Insert Button between items */}
                       <div className="h-4 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                         <button 
                            onClick={() => addSection(idx + 1)}
                            className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-lg hover:scale-110 transition-transform z-10"
                         >
                           <Plus className="w-3 h-3" /> Insert Here
                         </button>
                         <div className="absolute left-0 right-0 h-px bg-accent/20" />
                       </div>
                     </React.Fragment>
                   ))}
                 </AnimatePresence>
               </Reorder.Group>

               {profile.sections?.length === 0 && (
                 <div className="p-12 border-2 border-dashed border-border rounded-[32px] text-center">
                    <p className="text-muted-foreground mb-4 italic">Chưa có nội dung tri ân nào.</p>
                    <button 
                       onClick={() => addSection()}
                       className="px-6 py-2 bg-accent/10 text-accent rounded-xl font-bold hover:bg-accent hover:text-accent-foreground transition-all"
                    >
                      Bắt đầu tạo nội dung
                    </button>
                 </div>
               )}
               
               {profile.sections?.length > 0 && (
                 <button 
                   onClick={() => addSection()}
                   className="w-full mt-4 py-8 border-2 border-dashed border-border rounded-[32px] text-muted-foreground hover:border-accent/40 hover:bg-accent/5 hover:text-accent transition-all group font-medium"
                 >
                   <Plus className="w-6 h-6 mx-auto mb-2 opacity-30 group-hover:opacity-100 transition-opacity" />
                   Thêm section vào cuối danh sách
                 </button>
               )}
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
