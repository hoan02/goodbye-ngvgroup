'use server';

import dbConnect from "@/lib/mongodb";
import Profile from "@/lib/models/Profile";

export async function getProfileBySlug(slug: string) {
  try {
    await dbConnect();

    // Find the profile and sort sections by order
    const profile = await Profile.findOne({ slug }).lean();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Need to deeply clone/serialize the mongoose document 
    // to pass from Server Component/Action to Client Component in React 19
    const plainProfile = JSON.parse(JSON.stringify(profile));

    // Sort sections by 'order' property ascending
    if (plainProfile.sections && Array.isArray(plainProfile.sections)) {
      plainProfile.sections.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    return plainProfile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function getAllProfiles() {
  try {
    await dbConnect();
    const profiles = await Profile.find({}, 'slug name role department').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(profiles));
  } catch (error) {
    console.error("Error fetching all profiles:", error);
    throw new Error("Failed to fetch all profiles");
  }
}

export async function getProfileById(id: string) {
  if (!id) throw new Error("ID required");

  try {
    await dbConnect();
    const profile = await Profile.findById(id).lean();

    if (!profile) {
      throw new Error("Profile not found");
    }

    // Sort sections by order if they exist
    const plainProfile = JSON.parse(JSON.stringify(profile));
    if (plainProfile.sections && Array.isArray(plainProfile.sections)) {
      plainProfile.sections.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    }

    return plainProfile;
  } catch (error) {
    console.error("Error fetching profile by ID:", error);
    throw new Error("Failed to fetch profile");
  }
}

export async function createProfile(data: { name: string; slug: string }) {
  try {
    const { name, slug } = data;
    if (!name || !slug) throw new Error("Name and Slug required");

    await dbConnect();

    const existing = await Profile.findOne({ slug });
    if (existing) {
      throw new Error("Profile with this slug already exists");
    }

    const newProfile = await Profile.create({ name, slug });
    return JSON.parse(JSON.stringify(newProfile));
  } catch (error) {
    console.error("Failed to create profile:", error);
    throw new Error("Failed to create profile");
  }
}

export async function updateProfile(data: any) {
  try {
    const { _id, ...updateData } = data;

    if (!_id) throw new Error("ID required");

    await dbConnect();

    const updatedProfile = await Profile.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedProfile) {
      throw new Error("Profile not found");
    }

    return {
      message: "Updated successfully",
      profile: JSON.parse(JSON.stringify(updatedProfile))
    };
  } catch (error) {
    console.error("PUT Profile Error:", error);
    throw new Error("Failed to update profile");
  }
}

export async function deleteProfile(id: string) {
  if (!id) throw new Error("ID required");

  try {
    await dbConnect();

    const result = await Profile.findByIdAndDelete(id);

    if (!result) {
      throw new Error("Profile not found");
    }

    return { message: "Deleted successfully" };
  } catch (error) {
    console.error("DELETE Profile Error:", error);
    throw new Error("Failed to delete profile");
  }
}

export async function seedProfile() {
  try {
    const fs = await import("fs");
    const path = await import("path");

    const dataPath = path.join(process.cwd(), "data/farewell.json");
    if (!fs.existsSync(dataPath)) {
      throw new Error("farewell.json not found");
    }
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    await dbConnect();

    const existing = await Profile.findOne({ slug: "ngv-group" });
    if (existing) {
      return { message: "Initial profile already exists" };
    }

    const sections = data.sections.map((s: any, index: number) => ({
      title: s.title,
      type: s.content ? 'text' : (s.credits ? 'credits' : (s.memories ? 'memories' : (s.achievements ? 'achievements' : (s.message ? 'text' : (s.closing ? 'text' : 'list'))))),
      content: s.content || s.message || s.closing || null,
      items: s.credits || s.memories || s.achievements || null,
      order: index,
    }));

    const profileData = {
      slug: "ngv-group",
      name: data.company.name,
      role: data.author.role,
      department: data.author.department,
      tagline: data.intro.tagline,
      buttonText: data.intro.buttonText,
      logoUrl: data.intro.logoUrl,
      musicUrl: data.music.url,
      musicTitle: data.music.title,
      bgImageUrl: "/images/Year_End_Party_NGV_Group.jpeg",
      sections: sections
    };

    const newProfile = await Profile.create(profileData);

    return { message: "Seeded successfully", profileId: newProfile._id.toString() };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to seed profile");
  }
}

