
import React, { createContext, useCallback, useEffect, useState } from "react";

import {
    useChannelsContext,
    useChatSocket,
    useCurrentUser
} from "../../../hooks/Hooks";
import './Messenger.css'
import MessengerInput from "./MessengerInput";
import MessengerConversation from "./MessengerConversation";
import { Block, Channel, Message, User } from "../../../types";

type TMessenger = {
    blockedFriend: boolean,
    hidden: boolean,
    whisperUser: User,
    channel: Channel
}

export default function Messenger(props: TMessenger) {

    const { user } = useCurrentUser();

    const filterMessages = useCallback((messages: Message[]) => {
        if (user.blockList.length) {
            messages = messages.filter((m: Message) => {
                let blockObject = user.blockList.find((o: Block) => o.userId === m.sendBy);
                if (!blockObject || (blockObject && new Date(m.createdAt) < new Date(blockObject.createdAt)))
                    return (m)
            })
        }
        return (messages)
    }, [props.channel, props.channel.messages, user])

    const initMessages = useCallback(() => {
        if (props.channel && props.channel.messages && props.channel.messages.length) {
            let messages: Message[] = props.channel.messages;
            if (messages && messages.length && props.channel.users) {
                messages = filterMessages(messages);
                return (messages)
            }
        }
        return ([]);
    }, [props.channel, props.channel.messages, user])

    return (
        <>
            {
                props.hidden ?
                    null :
                    <>
                        {
                            props.channel &&
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
