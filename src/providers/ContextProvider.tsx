import { deleteCookie } from "@/services/AuthServices";
import { TUser } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

type AppContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
  message: IMessage | null;
  setMessage: (message: IMessage) => void;
};

interface IMessage {
  userId: string;
  content: string;
  read?: boolean;
  [key: string]: any;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [message, setMessage] = useState<IMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    deleteCookie();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        logout,
        message,
        setMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default ContextProvider;

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context)
    throw new Error("useAppContext must be used within AppProvider");
  return context;
};
