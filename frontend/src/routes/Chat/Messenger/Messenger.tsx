
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

type TMessenger = {
    blockedFriend: boolean,
    hidden: boolean,
    whisperUser: User,
}

export default function Messenger(props: TMessenger) {

    const { user } = useCurrentUser();
    const { currentChannel } = useChannelsContext();

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

    const initMessages = useCallback(() => {
        if (currentChannel && currentChannel.messages && currentChannel.messages.length) {
            let messages: Message[] = currentChannel.messages;
            if (messages && messages.length && currentChannel.users) {
                messages = filterMessages(messages);
                return (messages)
            }
        }
        return ([]);
    }, [currentChannel, currentChannel.messages, user])

    return (
        <>
            {
                props.hidden ?
                    null :
                    <>
                        {
                            currentChannel &&
                            <MessengerConversation
                                messages={ initMessages() }
                                {...props}
                            />
                        }
                        <MessengerInput {...props} />
                    </>
            }
        </>
    )
}
