import React, { useEffect, useState } from "react";

import MenuElement from "../components/Menu/MenuElement";
import { Outlet, useSearchParams } from "react-router-dom";


import { FriendsProvider } from "../../../contexts/Chat/FriendsContext";
import { SocketProvider } from "../../../contexts/Chat/ChatSocketContext";

import { ChannelsProvider } from "../../../contexts/Chat/ChannelsContext";
import './Chat.css'
import FriendEvents from "../Events/FriendsEvents";
import ChannelsEvents from "../Events/ChannelsEvents";
import { useChannelsContext } from "../../../hooks/Hooks";

function ChatInterface() {
    return (
        <div className="chat">
            <div className="chat-container">
                <MenuElement />
                <Outlet />
            </div>
        </div>
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