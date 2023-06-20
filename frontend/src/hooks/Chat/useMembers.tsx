import React, { useCallback } from "react";
import { useChannels, useChatSocket } from "../Hooks";

export default function useMembers()
{
    const { currentChannel, channels, channelsDispatch} = useChannels();
    const { socket } = useChatSocket();

    const isUserMember = useCallback((user: any) => {
        if (user && channels && currentChannel)
        {
            if (currentChannel.members.find((id : number) => id === user.id))
                return (true)
            return (false)
        }
    }, [currentChannel, channels])


    const isUserOwner = useCallback((user : any) => {
        if (user && channels && currentChannel)
        {
            if (currentChannel.ownerId === user.id)
                return (true)
            return (false)
        }
    }, [currentChannel, channels])

    const isUserBanned = useCallback((user: any) => {
        if (user && channels && currentChannel)
        {
            if (currentChannel.banList.find((id : number) => id === user.id))
                return (true)
            return (false)
        }
    }, [currentChannel, channels])


    const addMember = useCallback((user: any, channel : any) => {
        if (socket && channels && channel && user)
        {
            socket.emit('addtoChannel', {
                channelId: channel.id, 
                userId: user.id
            })
            channelsDispatch({type: 'addMember', channelId: channel.id, user})
        }
    }, [channels, socket])

    return (
        {
            isUserMember,
            isUserOwner,
            isUserBanned,
            addMember
        }
    )
}