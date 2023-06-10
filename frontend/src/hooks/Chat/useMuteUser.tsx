import React, { useCallback, useEffect, useState } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser } from "../Hooks";
import useFetchUsers from "../useFetchUsers";
import useMembers from "./useMembers";


export default function useMuteUser() {
    const { user } = useCurrentUser();
    const { socket } = useChatSocket();
    const { channels, channelsDispatch, currentChannel } = useChannelsContext();
    const { fetchUsers } = useFetchUsers();
    const [isCurrentUserMuted, setIsCurrentUserMuted] = useState(false);

    const { getMembersById } = useMembers(); 

    useEffect(() => {
        const muted = isUserMuted(user, currentChannel);
        setIsCurrentUserMuted(muted)
    }, [currentChannel, user])


    const isUserMuted = useCallback((user: any, channel: any) => {
        if (channel && channel.muteList && channel.muteList.length && user)
        {
            const muteObject = channel.muteList.find((o : any) => o.userId === user.id); 
            if (muteObject && muteObject.duration)
            {
                if (muteObject.duration && new Date(muteObject.duration) > new Date())
                    return (true);
                else if (channels && channels.length)
                    channelsDispatch({ type: 'removeMuteList', channelId: channel.id, userId: user.id })
            }
        }
        return (false);
    }, [channels])

    const getUsersMuted = useCallback( async (channel: any) => {
        if (channel && channel.muteList && channel.muteList.length)
        {
            const mutedIds = channel.muteList.map((o: any) => o.userId); 
            return (getMembersById(mutedIds))
        }
        console.log("empty")
        return ([]);
    }, [])

    const muteUser = useCallback((user: any, channel: any, duration: number) => {
        if (channels && channels.length && socket && user && channel) {
            socket.emit('muteUser', {
                channelId: channel.id,
                userId: user.id,
                duration
            })
            channelsDispatch({ type: 'addMuteList', channelId: channel.id, userId: user.id, mute: {userId: user.id} })
        }
    }, [socket, channels])


    const unmuteUser = useCallback((user: any, channel: any) => {
        if (channels && channels.length && socket && user && channel) {
            console.log("unmute user ", user.id, channel.id)
            socket.emit('unmuteUser', {
                channelId: channel.id,
                userId: user.id,
            })
            channelsDispatch({ type: 'removeMuteList', channelId: channel.id, userId: user.id })
        }
    }, [socket, channels])


    return (
        {
            muteUser,
            unmuteUser,
            getUsersMuted,
            isUserMuted, 
            isCurrentUserMuted
        }
    )
}