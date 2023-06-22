import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import useFetchUsers from "../useFetchUsers";
import { Channel, User } from "../../types";

export default function useMembers() {
    const { currentChannel, channels, channelsDispatch } = useChannelsContext();
    const { socket } = useChatSocket();
    const { fetchUser } = useFetchUsers();

    const isUserMember = useCallback((user: User) => {
        if (user && channels && currentChannel) {
            return (currentChannel.members.find((id: number) => id === user.id))
        }
        return (false);
    }, [currentChannel, channels])

    const isUserMemberFromChannel = useCallback((user: User, channel: Channel) => {
        if (user && channels && channel) {
            return (channel.members.find((id: number) => id === user.id))
        }
        return (false);
    }, [channels])

    const isUserIdMember = useCallback((userId: number) => {
        if (userId && channels && currentChannel) {
            return (currentChannel.members.find((id: number) => id === userId))
        }
        return (false);
    }, [currentChannel, channels])

    const isUserOwner = useCallback((user: User) => {
        if (user && channels && currentChannel) {
            return (currentChannel.ownerId === user.id)
        }
        return (false);
    }, [currentChannel, channels])

    const isUserBanned = useCallback((user: User) => {
        if (user && channels && currentChannel) {
            return (currentChannel.banList.find((id: number) => id === user.id))
        }
        return (false);
    }, [currentChannel, channels])

    const addMember = useCallback((user: User, channel: Channel) => {
        if (socket && channels && channel && user) {
            socket.emit('addtoChannel', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'addMember', channelId: channel.id, user })
        }
    }, [channels, socket])


    const addedMember = useCallback(async (userId: number, channelId: number) => {
        if (channels && channels.length && channelId && userId) {
            const user = await fetchUser(userId);
            channelsDispatch({ type: 'addMember', channelId, user })
        }
    }, [channels])

    const getMemberById = useCallback((id: number) => {
        if (channels && channels.length && currentChannel && currentChannel.users && currentChannel.users.length) {
            return (currentChannel.users.find((u: User) => u.id === id))
        }
    }, [channels, currentChannel])


    const getMembersById = useCallback((userIds: number[]) => {
        if (channels && channels.length && userIds && userIds.length &&
            currentChannel && currentChannel.users && currentChannel.users.length) {
            let members = userIds.map((id: number) => currentChannel.users.find((u: User) => u.id === id))
            return (members.filter(u => u));
        }
        return ([]);
    }, [channels, currentChannel])


    const getOwner = useCallback((channel: Channel) => {
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