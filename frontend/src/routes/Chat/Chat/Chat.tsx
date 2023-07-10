import React, { createContext, useEffect, useState } from "react";

import MenuElement from "../Menu/MenuElement";
import { Outlet, useLocation } from "react-router-dom";

import { FriendsProvider } from "../../../contexts/Chat/FriendsContext";
import { SocketProvider } from "../../../contexts/Chat/ChatSocketContext";

import { ChannelsProvider } from "../../../contexts/Chat/ChannelsContext";
import FriendEvents from "../Events/FriendsEvents";
import ChannelsEvents from "../Events/ChannelsEvents";
import { ConfirmPage } from "../Profile/ChannelProfile/ConfirmAction";
import './Chat.css'
import { useWindow } from "../../../hooks/useWindow";

export const ChatInterfaceContext: React.Context<any> = createContext(null);

function ChatInterface() {

    const  location = useLocation();
    const [action, setAction]: any = useState(null);
    const { isMobileDisplay } = useWindow();

    console.log("chat interface render")

    return (
        <ChatInterfaceContext.Provider value={{ setAction }}>
            <div className="chat">
                <div className="chat-container relative">
                    {
                        isMobileDisplay ?
                            location.pathname === "/chat" ? <MenuElement /> : <Outlet /> :
                            <>
                                <MenuElement />
                                <Outlet />
                            </>
                    }
                    {
                        action &&
                        <ConfirmPage>
                            {action}
                        </ConfirmPage>
                    }
                </div>
            </div>
        </ChatInterfaceContext.Provider>
    )
}


export default function Chat() {
    return (
        <SocketProvider>
            <FriendsProvider>
                <ChannelsProvider>
                    <FriendEvents>
                        <ChannelsEvents>
                            <ChatInterface />
                        </ChannelsEvents>
                    </FriendEvents>
                </ChannelsProvider>
            </FriendsProvider>
        </SocketProvider>
    )
}