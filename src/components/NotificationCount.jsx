
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export default async function NotificationCount() {
  await connectDB();
  
  // Only unread notifications will be counted.
  const unreadCount = await Notification.countDocuments({ isRead: false });

  if (unreadCount === 0) return null;

  return (
    <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse">
      {unreadCount > 9 ? "9+" : unreadCount}
    </span>
  );
}