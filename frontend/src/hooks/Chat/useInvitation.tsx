import React, { useCallback } from "react";
import { useChatSocket } from "../Hooks";


export function useInvitation() {
    const { socket } = useChatSocket();

    const sendInvitation = useCallback((channelId: number, gametype: string) => {
        if (socket && gametype) {
            socket.emit('sendInvite', {
                channelId,
                gametype
            })
        }
    }, [socket])

    const acceptInvitation = useCallback((messageId: number) => {
        if (socket && messageId)
        {
            socket.emit('acceptInvite', {
                messageId
            })
        }
    }, [socket])

    return (
        {

            sendInvitation,
            acceptInvitation
        }
    )
}