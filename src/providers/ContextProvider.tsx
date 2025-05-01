/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteCookie } from "@/services/AuthServices";
import { TUser } from "@/types";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AppContextType = {
  user: TUser | null;
  setUser: (user: TUser | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
  messages: IMessage[];
  setMessage: Dispatch<SetStateAction<IMessage[]>>;
  markAllAsRead: () => void;
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
  const [messages, setMessage] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    deleteCookie();
  };

  const markAllAsRead = () => {
    setMessage((prevMessages) =>
      prevMessages.map((message) => ({ ...message, read: true }))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        logout,
        messages,
        setMessage,
        markAllAsRead,
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
