import React, { useCallback } from "react";

import {
    useChannelsContext,
    useChatSocket,
} from "../../../hooks/Hooks";
import './Messenger.css'

import sendIcon from '../../../assets/Paper_Plane.svg'

type TMessengerInput = {
    blockedFriend: boolean,
    hidden: boolean
}


export default function MessengerInput(props: TMessengerInput) {
    const { socket } = useChatSocket();
    const { currentChannel } = useChannelsContext();

    const [value, setValue] = React.useState("");

    const handleChange = useCallback((e: any) => {
        if (e.target.value.length <= 200) {
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
            <form className="messenger-input flex-ai">
                <input
                    style={{width: '100%', height: '100%', border: 'none'}}
                    value={value}
                    onChange={handleChange}
                    placeholder={canSendMessages()}
                    onKeyDown={submit}
                    disabled={props.blockedFriend}
                />
                <img src={sendIcon} />
            </form>
        </div>
    )
}