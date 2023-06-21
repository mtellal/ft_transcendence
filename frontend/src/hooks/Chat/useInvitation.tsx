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

    const acceptInvitation = useCallback((id: number) => {
        if (socket && id)
        {
            socket.emit('acceptInvite', id)
        }
    }, [socket])

    return (
        {

            sendInvitation,
            acceptInvitation
        }
    )
}