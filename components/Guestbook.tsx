'use client';

import { useState, useEffect } from 'react';
import { addGuestbookMessage, getGuestbookMessages } from '@/app/actions/guestbook';
import { Heart, Send } from 'lucide-react';

interface Message {
  _id: string;
  authorName: string;
  message: string;
  emoji: string;
  createdAt: string;
}

export default function Guestbook({ profileId }: { profileId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('❤️');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const data = await getGuestbookMessages(profileId);
        setMessages(data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, [profileId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const added = await addGuestbookMessage({
        profileId,
        authorName: newName,
        message: newMessage,
        emoji: selectedEmoji,
      });
      setMessages((prev) => [added, ...prev]);
      setNewName('');
      setNewMessage('');
    } catch (error) {
      console.error('Failed to add message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-4">
      <div className="text-center mb-12 relative">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">Wishes Wall</h2>
        <p className="text-white/60 text-lg">Leave a note, a memory, or a wish.</p>
        <div className="absolute -top-6 -left-6 text-6xl opacity-10 rotate-[-15deg]">💌</div>
        <div className="absolute -bottom-6 -right-6 text-6xl opacity-10 rotate-[15deg]">✨</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="md:col-span-1">
          <form onSubmit={handleSubmit} className="bg-card/40 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl sticky top-24">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Heart className="w-5 h-5 text-accent" /> Write a message
            </h3>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all font-medium"
                  required
                />
              </div>

              <div>
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold ml-1 block mb-2">Message</span>
                <textarea
                  placeholder="Your message details..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all min-h-[120px] resize-none"
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-xs text-white/50 uppercase tracking-widest font-bold ml-1">Sticker</span>
                <div className="flex gap-2">
                  {['❤️', '🎉', '🌟', '🍀', '👏'].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all ${
                        selectedEmoji === emoji ? 'bg-accent/20 border border-accent scale-110' : 'bg-black/20 border border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !newName.trim() || !newMessage.trim()}
                className="w-full py-4 bg-accent text-accent-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Messages Wall Section */}
        <div className="md:col-span-2 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-8 text-center text-white/40">
              <Heart className="w-12 h-12 mb-4 opacity-20" />
              <p>No messages yet. Be the first to leave a wish!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {messages.map((msg) => (
                <div key={msg._id} className="bg-card/30 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-white/20 transition-all group relative overflow-hidden break-inside-avoid shadow-lg flex flex-col">
                  <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
                    {msg.emoji}
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                    <span className="text-2xl drop-shadow-md">{msg.emoji}</span>
                  </div>
                  
                  <p className="text-white/90 text-sm md:text-base leading-relaxed mb-6 relative z-10 whitespace-pre-wrap font-light">
                    &quot;{msg.message}&quot;
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-auto relative z-10 w-full">
                    <p className="font-bold text-accent text-sm tracking-wide">{msg.authorName}</p>
                    <p className="text-xs text-white/30">
                      {new Date(msg.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
