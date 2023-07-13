import { useCallback, useEffect, useState } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser } from "../Hooks";
import useMembers from "./useMembers";
import { Channel, Mute, User } from "../../types";


export default function useMuteUser(channel: Channel) {
    const { socket } = useChatSocket();
    const { channels, channelsDispatch } = useChannelsContext();

    const { getMembersById } = useMembers(channel); 

    const isUserMuted = useCallback((user: User) => {
        if (channels && channels.length && 
            channel && channel.muteList && channel.muteList.length && user)
        {
            const muteObject = channel.muteList.find((o : Mute) => o.userId === user.id); 
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

    const getUsersMuted = useCallback( async () => {
        if (channels && channels.length && 
            channel && channel.muteList && channel.muteList.length)
        {
            const mutedIds = channel.muteList.map((o: Mute) => o.userId); 
            return (getMembersById(mutedIds))
        }
        return ([]);
    }, [channels])

    const muteUser = useCallback((user: User, duration: number) => {
        if (channels && channels.length && socket && user && channel) {
            socket.emit('muteUser', {
                channelId: channel.id,
                userId: user.id,
                duration
            })
            channelsDispatch({ type: 'addMuteList', channelId: channel.id, userId: user.id, mute: {userId: user.id} })
        }
    }, [socket, channels])


    const unmuteUser = useCallback((user: User) => {
        if (channels && channels.length && socket && user && channel) {
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
        }
    )
}