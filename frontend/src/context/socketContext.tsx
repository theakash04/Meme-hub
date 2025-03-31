import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ContextComponentProps } from "../types/globalTypes";

const socketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: ContextComponentProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("ws://localhost:3000");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <socketContext.Provider value={socket}>
      {children}
    </socketContext.Provider>
  );
};

export default socketContext;
