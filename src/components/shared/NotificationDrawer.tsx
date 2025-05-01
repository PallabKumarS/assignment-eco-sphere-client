"use client";

import { Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  markAllAsRead,
  selectUnreadCount,
} from "@/redux/features/notificationSlice";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export const NotificationDrawer = () => {
  const [open, setOpen] = useState(false);
  const unreadCount = useAppSelector(selectUnreadCount);
  const messages = useAppSelector((state) => state.notification.messages);
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(markAllAsRead());
  };

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) handleOpen();
      }}
    >
      <SheetTrigger asChild>
        <button className="relative">
          {unreadCount > 0 && (
            <motion.span
              className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {unreadCount}
            </motion.span>
          )}
          <Bell className="size-6 text-primary" />
        </button>
      </SheetTrigger>

      <SheetContent className="px-4 py-6 w-[90vw] max-w-sm bg-background">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Recent updates just for you.
          </SheetDescription>
        </SheetHeader>

        <ul className="mt-6 space-y-2">
          {messages.length === 0 && (
            <li className="text-sm text-muted">No messages</li>
          )}
          {messages.map((msg, i) => (
            <li key={i} className="p-2 rounded bg-muted/30 text-sm">
              {msg.content}
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
};
