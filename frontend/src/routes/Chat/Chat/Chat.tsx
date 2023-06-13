import React from "react";

import MenuElement from "../components/Menu/MenuElement";
import { Outlet } from "react-router-dom";


import { FriendsProvider } from "../../../contexts/Chat/FriendsContext";
import { SocketProvider } from "../../../contexts/Chat/ChatSocketContext";

import { ChannelsProvider } from "../../../contexts/Chat/ChannelsContext";
import './Chat.css'
import FriendEvents from "../Events/FriendsEvents";
import ChannelsEvents from "../Events/ChannelsEvents";


export default function Chat() {
    return (
        <SocketProvider>
            <FriendsProvider>
                <ChannelsProvider>
                    <FriendEvents>
                        <ChannelsEvents>
                            <div className="chat">
                                <div className="chat-container">
                                    <MenuElement />
                                    <Outlet />
                                </div>
                            </div>
                        </ChannelsEvents>
                    </FriendEvents>
                </ChannelsProvider>
            </FriendsProvider>
        </SocketProvider>
    )
}