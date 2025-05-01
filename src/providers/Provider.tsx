"use client";

import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";
import { WebSocketProvider } from "./WebSocketProvider";
import ContextProvider from "./ContextProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ContextProvider>
        <WebSocketProvider />
        <Toaster richColors position="top-right" />
        {children}
      </ContextProvider>
    </ThemeProvider>
  );
};

export default Providers;
