import React, { createContext, useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/Hooks";
import { io } from "socket.io-client";

export const ChatSocketContext: React.Context<any> = createContext(null);

export function SocketProvider({ children }: any) {
    const { token }: any = useCurrentUser();
    const [socket, setSocket]: any = useState();
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        let s = io(`${process.env.REACT_APP_BACK}/chat`, {
            transports: ['websocket'],
            upgrade: false,
            extraHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });

        setSocket(s);
        s.on('connect', () => {setConnected(true)})
        s.on('disconnect', () => {setConnected(false)})

        return (() => {
            s.disconnect();
        })
    }, [])

    return (
        <ChatSocketContext.Provider value={{ socket }}>
            {
                connected && 
                children
            }
        </ChatSocketContext.Provider>
    )
}