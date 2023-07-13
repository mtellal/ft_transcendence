import React, { useCallback } from "react";

import { useChatSocket, } from "../../../hooks/Hooks";
import './Messenger.css'

import sendIcon from '../../../assets/Paper_Plane.svg'
import Icon from "../../../components/Icon";
import { Channel } from "../../../types";

type TMessengerInput = {
    blockedFriend: boolean,
    hidden: boolean, 
    channel: Channel
}

export default function MessengerInput(props: TMessengerInput) {
    const { socket } = useChatSocket();
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
    }, [props.channel, props.blockedFriend]);


    const sendMessage = useCallback(() => {
        if (value && !props.blockedFriend && props.channel && socket) {
            socket.emit('message', {
                channelId: props.channel.id,
                content: value
            })
            setValue("")
        }
    }, [value, props.channel, socket])

    const submit = useCallback((e: any) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    }, [value, props.channel, socket])


    return (
        <div className="messenger-input flex-ai">
            <input
                style={{ width: '100%', fontSize: '15px',  height: '100%', border: 'none', outline: 'none' }}
                value={value}
                onChange={handleChange}
                placeholder={canSendMessages()}
                onKeyDown={submit}
                disabled={props.blockedFriend}
            />
            <div style={{height: '30px'}}>
                <Icon icon={sendIcon} onClick={() => sendMessage()} />
            </div>
        </div>
    )
}