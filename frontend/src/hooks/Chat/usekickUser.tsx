import { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import { Channel, User } from "../../types";


export default function useKickUser(channel: Channel) {
    const { socket } = useChatSocket();
    const { channelsDispatch } = useChannelsContext();

    const kickUser = useCallback((user: User) => {
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