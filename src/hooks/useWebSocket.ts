/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useAppContext } from "@/providers/ContextProvider";
import { useEffect, useRef } from "react";

export const useWebSocket = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userInteractedRef = useRef(false);
  const { user, setMessage } = useAppContext();

  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimeout: NodeJS.Timeout;

    audioRef.current = new Audio("/audio/notification.wav");

    const handleInteraction = () => {
      userInteractedRef.current = true;
      document.removeEventListener("click", handleInteraction);
    };

    document.addEventListener("click", handleInteraction);

    // Connect to WebSocket server
    const connect = () => {
      ws = new WebSocket(`${process.env.NEXT_PUBLIC_WSS_API}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        ws.send(
          JSON.stringify({
            type: "init",
            userId: user?.id || "",
          })
        );
      };

      // Handle WebSocket messages
      ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessage(message);

        if (userInteractedRef.current) {
          audioRef.current?.play().catch(console.warn);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket disconnected", {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
        });

        reconnectTimeout = setTimeout(connect, 5000);
      };
    };

    connect();

    return () => {
      ws?.close();
      document.removeEventListener("click", handleInteraction);
    };
  }, [user?.id, setMessage]);

  return socketRef;
};
