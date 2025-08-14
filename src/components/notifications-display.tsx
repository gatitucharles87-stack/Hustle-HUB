"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import * as api from "@/lib/api"; // Changed to import * as api

// Define Notification type based on API
interface Notification {
  id: string;
  message: string;
  created_at: string; // Changed from timestamp to created_at to match typical Django model fields
  is_read: boolean;
}

interface NotificationsDisplayProps {
  isOpen: boolean;
  onClose: () => void;
  onUnreadCountChange: (count: number) => void; // Callback for parent to update unread count badge
}

export function NotificationsDisplay({ isOpen, onClose, onUnreadCountChange }: NotificationsDisplayProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.getNotifications(); // Changed to use named export
      setNotifications(response.data);
      const unread = response.data.filter((n: Notification) => !n.is_read).length; // Explicitly typed 'n'
      onUnreadCountChange(unread);
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.response?.data?.detail || "Failed to fetch notifications.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Polling for real-time updates (can be replaced by WebSockets later)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isOpen) { // Only poll if the sheet is not open to avoid double fetches
        fetchNotifications();
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.markNotificationAsRead(notificationId); // Changed to use named export and correct argument
      toast({
        title: "Success",
        description: "Notification marked as read.",
      });
      fetchNotifications(); // Re-fetch to update UI and unread count
    } catch (err: any) {
      console.error("Error marking notification as read:", err);
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to mark notification as read.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Assuming you have a specific mock API function for this or it's not mocked
      // For now, let's just mark all locally and update if no specific backend exists
      // await api.markAllNotificationsAsRead(); // This would be the backend call
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast({
        title: "Success",
        description: "All notifications marked as read.",
      });
      onUnreadCountChange(0);
    } catch (err: any) {
      console.error("Error marking all as read:", err);
      toast({
        title: "Error",
        description: err.response?.data?.detail || "Failed to mark all notifications as read.",
        variant: "destructive",
      });
    }
  };

  const unreadCount = notifications.filter((n: Notification) => !n.is_read).length; // Explicitly typed 'n'

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notifications ({unreadCount} unread)
          </SheetTitle>
          <SheetDescription>
            Your recent activities and updates.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {isLoading && <p className="text-center text-muted-foreground">Loading notifications...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {!isLoading && !error && notifications.length === 0 && (
            <p className="text-center text-muted-foreground">No new notifications.</p>
          )}

          {!isLoading && !error && notifications.length > 0 && (
            <>
              <div className="flex justify-end mb-2">
                <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-200px)] pr-4"> {/* Adjust height based on header/footer */}
                {notifications.map((notification: Notification) => (
                  <div key={notification.id} className={`p-3 rounded-md mb-2 flex items-center justify-between ${!notification.is_read ? 'bg-accent/20 border border-accent' : 'bg-muted/30'}`}>
                    <div>
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        {!notification.is_read && <span className="ml-2 text-primary font-semibold"> • New</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!notification.is_read && (
                        <Button variant="ghost" size="icon" onClick={() => handleMarkAsRead(notification.id)} title="Mark as read">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
