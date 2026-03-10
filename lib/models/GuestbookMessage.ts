import mongoose from 'mongoose';

const guestbookMessageSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  authorName: { type: String, required: true },
  message: { type: String, required: true },
  emoji: { type: String, default: '❤️' },
}, { timestamps: true });

const GuestbookMessage = mongoose.models.GuestbookMessage || mongoose.model('GuestbookMessage', guestbookMessageSchema);

export default GuestbookMessage;
