import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String },
  items: { type: mongoose.Schema.Types.Mixed }, // Use Mixed for JSONB equivalent
  order: { type: Number, default: 0 },
});

const profileSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String },
  department: { type: String },
  avatarUrl: { type: String },
  bgImageUrl: { type: String, default: '/images/Year_End_Party_NGV_Group.jpeg' },
  logoUrl: { type: String, default: '/logo.png' },
  tagline: { type: String },
  thumbUrl: { type: String },
  buttonText: { type: String, default: 'Bắt Đầu' },
  musicUrl: { type: String },
  musicTitle: { type: String },
  sections: [sectionSchema], // Nesting sections within the profile
}, { timestamps: true }); // Automatically manages createdAt and updatedAt

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

export default Profile;
