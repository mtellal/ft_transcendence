import React, { createContext, useEffect, useState } from "react";

import MenuElement from "../components/Menu/MenuElement";
import { Outlet, useSearchParams } from "react-router-dom";


import { FriendsProvider } from "../../../contexts/Chat/FriendsContext";
import { SocketProvider } from "../../../contexts/Chat/ChatSocketContext";

import { ChannelsProvider } from "../../../contexts/Chat/ChannelsContext";
import './Chat.css'
import FriendEvents from "../Events/FriendsEvents";
import ChannelsEvents from "../Events/ChannelsEvents";
import { ConfirmPage, ConfirmView } from "../Profile/ChannelProfile/ConfirmAction";


export const ChatInterfaceContext: React.Context<any> = createContext(null);

function ChatInterface() {

    const [action, setAction]: any = useState(null);

    return (
        <ChatInterfaceContext.Provider value={{ setAction }}>
            <div className="chat">
                <div className="chat-container relative">
                    <MenuElement />
                    <Outlet />
                    {
                        action && (action.user || action.channel) && action.function &&
                        <ConfirmPage>
                            <ConfirmView
                                type={action.type}
                                username={(action.user && action.user.username) || (action.channel && action.channel.name)}
                                valid={async () => {
                                    await action.function(action.user, action.channel);
                                    setAction(null)
                                }}
                                cancel={() => setAction(null)}
                            />
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