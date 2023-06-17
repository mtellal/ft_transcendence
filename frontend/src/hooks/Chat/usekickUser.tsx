import { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";


export default function useKickUser() {
    const { socket } = useChatSocket();
    const { channelsDispatch } = useChannelsContext();

    const kickUser = useCallback((user: any, channel: any) => {
        if (socket && channel && user) {
            socket.emit('kickUser', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeMember', channelId: channel.id, userId: user.id })
            channelsDispatch({ type: 'removeAdministrators', channelId: channel.id, userId: user.id })
        }
    }, [socket])

    return (
        {
            kickUser,
        }
    )
}