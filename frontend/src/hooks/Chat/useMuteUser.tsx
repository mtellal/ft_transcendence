import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import useFetchUsers from "../useFetchUsers";


export default function useMuteUser() {
    const { socket } = useChatSocket();
    const { channels, channelsDispatch, currentChannel } = useChannelsContext();
    const { fetchUsers } = useFetchUsers();


    const isUserMuted = useCallback((user: any) => {
        if (channels && channels.length && 
                currentChannel && currentChannel.muteList && currentChannel.muteList.length &&  user)
        {
            if (currentChannel.muteList.find((o : any) => o.userId === user.id))
                return (true);
        }
        return (false);
    }, [channels, currentChannel])

    const getUsersMuted = useCallback( async (channel: any) => {
        if (channel && channel.muteList && channel.muteList.length)
        {
            const muted = channel.muteList.map((o: any) => o.userId);
            if (muted && muted.length)
                return (await Promise.all(await fetchUsers(muted)))
        }
    }, [])

    const muteUser = useCallback((user: any, channel: any, duration: string) => {
        if (channels && socket && user && channel) {
            console.log("mute user ", user.id, channel.id, duration)
            socket.emit('muteUser', {
                channelId: channel.id,
                userId: user.id,
                duration
            })
            channelsDispatch({ type: 'addMuteList', channelId: channel.id, userId: user.id })
        }
    }, [socket])


    const unmuteUser = useCallback((user: any, channel: any, duration: string) => {
        if (channels && socket && user && channel) {
            console.log("unmute user ", user.id, channel.id, duration)
            socket.emit('unmuteUser', {
                channelId: channel.id,
                userId: user.id,
                duration
            })
            channelsDispatch({ type: 'removeMuteList', channelId: channel.id, userId: user.id })
        }
    }, [socket, channels])


    return (
        {
            muteUser,
            unmuteUser,
            getUsersMuted,
            isUserMuted
        }
    )
}