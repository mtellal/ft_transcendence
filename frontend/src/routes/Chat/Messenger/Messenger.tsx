
import React, { createContext, useCallback, useEffect, useState } from "react";

import {
    useChannelsContext,
    useCurrentUser
} from "../../../hooks/Hooks";
import './Messenger.css'
import MessengerInput from "./MessengerInput";
import MessengerConversation from "./MessengerConversation";

const MessengerContext: React.Context<any> = createContext(null);


type TMessenger = {
    blockedFriend: boolean,
    hidden: boolean,
    whisperUser: any,
}

export default function Messenger(props: TMessenger) {

    const { user } = useCurrentUser();
    const { currentChannel } = useChannelsContext();

    const [messages, setMessages] = useState([]);
    const [showUserMenu, setShowUserMenu] = useState({ show: false });

    const filterMessages = useCallback((messages: any[], members: any[]) => {
        if (user.blockList.length) {
            messages = messages.filter((m: any) => {
                let blockObject = user.blockList.find((o: any) => o.userId === m.sendBy);
                if (!blockObject || (blockObject && new Date(m.createdAt) < new Date(blockObject.createdAt)))
                    return (m)
            })
        }
        return (messages)
    }, [currentChannel, user])


    const initMessages = useCallback(async () => {
        const members = currentChannel.users;
        let messages: any = currentChannel.messages;
        if (messages && messages.length && members && members.length) {
            messages = filterMessages(messages, members);
            setMessages(messages);
        }
    }, [currentChannel && currentChannel.messages, user])

    useEffect(() => {
        if (currentChannel && currentChannel.messages && currentChannel.messages.length) {
            initMessages();
        }
        else
            setMessages([]);
    }, [currentChannel && currentChannel.messages, user.blockList])

    return (
        <MessengerContext.Provider value={
            {
                showUserMenu,
                setShowUserMenu,
            }
        }
        >
            {
                messages && currentChannel &&
                <MessengerConversation
                    messages={messages}
                    {...props}
                />
            }
            <MessengerInput
                {...props}
            />
        </MessengerContext.Provider>
    )
}
