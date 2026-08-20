import type { Notification } from "@/types";
import { getDb } from "@/lib/db";

export async function getNotifications(opts: { limit?: number; unreadOnly?: boolean } = {}): Promise<Notification[]> {
  const db = await getDb();
  const query: Record<string, unknown> = {};
  if (opts.unreadOnly) query.read = false;
  return db.notifications.find(query as never, { sort: { createdAt: -1 }, limit: opts.limit ?? 10 });
}

export async function markAllNotificationsRead(): Promise<void> {
  const db = await getDb();
  const unread = await db.notifications.find({ read: false } as never);
  for (const n of unread) {
    await db.notifications.updateById(n._id, { read: true });
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const db = await getDb();
  await db.notifications.updateById(id, { read: true });
}

export async function createNotification(input: Omit<Notification, "_id" | "read" | "createdAt">): Promise<Notification> {
  const db = await getDb();
  return db.notifications.insertOne({ ...input, read: false, createdAt: new Date() });
}