import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import useFetchUsers from "../useFetchUsers";

export default function useMembers()
{
    const { currentChannel, channels, channelsDispatch} = useChannelsContext();
    const { socket } = useChatSocket();
    const { fetchUser } = useFetchUsers();

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


    const addedMember = useCallback(async (userId: number, channelId : number) => {
        if (channels && channels.length && channelId && userId)
        {
            const user = await fetchUser(userId);
            channelsDispatch({ type: 'addMember', channelId, user })
        }
    }, [channels])

    const getMemberById = useCallback((id: number) => {
        if (channels && channels.length && currentChannel && currentChannel.users && currentChannel.users.length)
        {
            return (currentChannel.users.find((u: any) => u.id === id))
        }
    }, [channels, currentChannel])


    const getMembersById = useCallback((userIds : number[]) => {
        if (channels && channels.length && userIds && userIds.length && 
                currentChannel && currentChannel.users && currentChannel.users.length)
        {
            let members = userIds.map((id: number) => currentChannel.users.find((u: any) => u.id === id))
            members = members.filter(u => u);
            return (members)
        }
    }, [channels, currentChannel])

    return (
        {
            isUserMember,
            isUserOwner,
            isUserBanned,
            addMember,
            addedMember,
            getMemberById,
            getMembersById
        }
    )
}