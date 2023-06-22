
import React, { createContext, useCallback, useEffect, useState } from "react";

import {
    useChannelsContext,
    useChatSocket,
    useCurrentUser
} from "../../../hooks/Hooks";
import './Messenger.css'
import MessengerInput from "./MessengerInput";
import MessengerConversation from "./MessengerConversation";
import { Block, Message, User } from "../../../types";

const MessengerContext: React.Context<any> = createContext(null);


type TMessenger = {
    blockedFriend: boolean,
    hidden: boolean,
    whisperUser: User,
}

export default function Messenger(props: TMessenger) {

    const { user } = useCurrentUser();
    const { currentChannel } = useChannelsContext();

    const [messages, setMessages] = useState([]);
    const [showUserMenu, setShowUserMenu] = useState({ show: false });

    const filterMessages = useCallback((messages: Message[]) => {
        if (user.blockList.length) {
            messages = messages.filter((m: Message) => {
                let blockObject = user.blockList.find((o: Block) => o.userId === m.sendBy);
                if (!blockObject || (blockObject && new Date(m.createdAt) < new Date(blockObject.createdAt)))
                    return (m)
            })
        }
        return (messages)
    }, [currentChannel, currentChannel.messages, user])


    const initMessages = useCallback(async () => {
        let messages: Message[] = currentChannel.messages;
        if (messages && messages.length && currentChannel.users) {
            messages = filterMessages(messages);
            setMessages(messages);
        }
    }, [currentChannel, currentChannel.messages,  user])

    useEffect(() => {
        if (currentChannel && currentChannel.messages && currentChannel.messages.length) {
            initMessages();
        }
        else
            setMessages([]);
    }, [currentChannel, currentChannel.messages, user.blockList])

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
