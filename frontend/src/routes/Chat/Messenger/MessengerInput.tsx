import React, { useCallback } from "react";

import {
    useChannelsContext,
    useChatSocket,
} from "../../../hooks/Hooks";
import './Messenger.css'

export default function MessengerInput(props: any) {
    const { socket } = useChatSocket();
    const { currentChannel } = useChannelsContext();

    const [value, setValue] = React.useState("");

    const handleChange = useCallback((e: any) => {
        if (e.target.value.length <= 200)
        {
            setValue(e.target.value)
        }
    }, []);

    const canSendMessages = useCallback(() => {
        if (props.blockedFriend)
            return ("User blocked")
        return ("Write your message")
    }, [currentChannel, props.blockedFriend]);

    const submit = useCallback((e: any) => {
        if (e.key === "Enter" && value && !props.blockedFriend && currentChannel && socket) {
            socket.emit('message', {
                channelId: currentChannel.id,
                content: value
            })
            setValue("")
        }
    }, [value, currentChannel, socket])


    return (
        <div className={props.hidden ? "messages-input hidden" : "messages-input visible"}
        >
            <input
                className={props.hidden ? "messenger-input hidden" : "messenger-input visible"}
                value={value}
                onChange={handleChange}
                placeholder={canSendMessages()}
                onKeyDown={submit}
                disabled={props.blockedFriend}
            />
        </div>
    )
}