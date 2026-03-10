'use server';

import dbConnect from "@/lib/mongodb";
import GuestbookMessage from "@/lib/models/GuestbookMessage";

export async function addGuestbookMessage(data: { profileId: string; authorName: string; message: string; emoji?: string }) {
  try {
    const { profileId, authorName, message, emoji } = data;
    if (!profileId || !authorName || !message) throw new Error("Missing required fields");

    await dbConnect();

    const newMessage = await GuestbookMessage.create({
      profileId,
      authorName,
      message,
      emoji: emoji || '❤️'
    });

    return JSON.parse(JSON.stringify(newMessage));
  } catch (error) {
    console.error("Failed to add guestbook message:", error);
    throw new Error("Failed to add guestbook message");
  }
}

export async function getGuestbookMessages(profileId: string) {
  try {
    if (!profileId) throw new Error("Profile ID required");

    await dbConnect();
    const messages = await GuestbookMessage.find({ profileId }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error("Error fetching guestbook messages:", error);
    throw new Error("Failed to fetch guestbook messages");
  }
}
