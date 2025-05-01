"use client";

import { useWebSocket } from "@/hooks/useWebSocket";

export const WebSocketProvider = () => {
  useWebSocket();
  return null;
};
