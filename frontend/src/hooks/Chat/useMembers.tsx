import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import useFetchUsers from "../useFetchUsers";
import { Channel, User } from "../../types";

export default function useMembers(channel: Channel) {
    const { channels, channelsDispatch } = useChannelsContext();
    const { socket } = useChatSocket();
    const { fetchUser } = useFetchUsers();

    const isUserMember = useCallback((user: User) => {
        if (user && channel && channel) {
            return (channel.members.find((id: number) => id === user.id))
        }
        return (false);
    }, [channels])

    const isUserMemberFromChannel = useCallback((user: User) => {
        if (user && channels && channel) {
            return (channel.members.find((id: number) => id === user.id))
        }
        return (false);
    }, [channels])

    const isUserIdMember = useCallback((userId: number) => {
        if (userId && channels && channel) {
            return (channel.members.find((id: number) => id === userId))
        }
        return (false);
    }, [channels])

    const isUserOwner = useCallback((user: User) => {
        if (user && channels && channel) {
            return (channel.ownerId === user.id)
        }
        return (false);
    }, [channels])

    const isUserBanned = useCallback((user: User) => {
        if (user && channels && channel) {
            return (channel.banList.find((id: number) => id === user.id))
        }
        return (false);
    }, [channels])

    const addMember = useCallback((user: User) => {
        if (socket && channels && channel && user) {
            socket.emit('addtoChannel', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'addMember', channelId: channel.id, user })
        }
    }, [channels, socket])

    const addedMember = useCallback(async (userId: number) => {
        if (channels && channels.length && channel && channel.id && userId) {
            const user = await fetchUser(userId);
            channelsDispatch({ type: 'addMember', channelId: channel.id, user })
        }
    }, [channels])

    const getMemberById = useCallback((id: number) => {
        if (channels && channels.length && channel && channel.users && channel.users.length) {
            return (channel.users.find((u: User) => u.id === id))
        }
    }, [channels])


    const getMembersById = useCallback((userIds: number[]) => {
        if (channels && channels.length && userIds && userIds.length &&
            channel && channel.users && channel.users.length) {
            let members = userIds.map((id: number) => channel.users.find((u: User) => u.id === id))
            return (members.filter(u => u));
        }
        return ([]);
    }, [channels])


    const getOwner = useCallback(() => {
        if (channel && channels && channels.length &&
            channel.users && channel.users.length) {
            return (channel.users.find((u: User) => u.id === channel.ownerId))
        }
    }, [channels]);

    return (
        {
            isUserMember,
            isUserIdMember,
            isUserMemberFromChannel,
            isUserOwner,
            isUserBanned,
            addMember,
            addedMember,
            getMemberById,
            getMembersById,
            getOwner
        }
    )
}