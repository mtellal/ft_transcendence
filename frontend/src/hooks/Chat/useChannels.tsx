import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser } from "../Hooks";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "../useFetchUsers";


export function useChannels() {
    const navigate = useNavigate();

    const { user, token } = useCurrentUser();
    const { socket } = useChatSocket();
    const { fetchUsers } = useFetchUsers();

    const { channels, channelsDispatch, currentChannel } = useChannelsContext();

    const isChannelPublic = useCallback((channel: any) => {
        if (channel)
            return (channel.type === "PUBLIC")
    }, [])

    const isChannelPrivate = useCallback((channel: any) => {
        if (channel)
            return (channel.type === "PRIVATE")
    }, [])

    const isChannelProtected = useCallback((channel: any) => {
        if (channel)
            return (channel.type === "PROTECTED")
    }, [])


    const updateChannelName = useCallback((channelId: number, name: string) => {
        if (socket && channels && channels.length && channelId && name) {
            console.log("update channel name", channelId, name)
            socket.emit('updateChannel', {
                channelId: channelId,
                name: name,
            });
            channelsDispatch({ type: 'updateChannelInfos', channelId, infos: { name } })
        }
    }, [socket, channels])

    const updateChannelPassword = useCallback((channelId: number, password: string) => {
        if (socket && channels && channels.length && channelId && password) {
            console.log("update channel password", channelId, password)
            socket.emit('updateChannel', {
                channelId,
                password,
            });
            channelsDispatch({ type: 'updateChannelInfos', channelId, infos: { password } })
        }
    }, [socket, channels])


    const updateChannelType = useCallback((channelId: number, type: string, password: string = "") => {
        if (socket && channels && channels.length && channelId && type) {
            console.log("update channel type", channelId, type)
            socket.emit('updateChannel', {
                channelId,
                type,
                password
            });
            channelsDispatch({ type: 'updateChannelInfos', channelId, infos: { type } })
        }
    }, [socket, channels])


    const addChannel = useCallback(async (channel: any, includeCurrentUser: boolean) => {
        if (socket && channel) {
            if ((!channel.users || !channel.users.length) && channel.members) {
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
            if (includeCurrentUser)
                channel.users = [...channel.users, user];
            channelsDispatch({ type: 'addChannel', channel });
            joinChannel(channel);
        }
    }, [socket, channelsDispatch])

    const addChannelProtected = useCallback(async (channel: any, password: string, includeCurrentUser: boolean) => {
        if (socket) {
            if (!channel.users || !channel.users.length && channel.members) {
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
            if (includeCurrentUser)
                channel.users = [...channel.users, user];
            channelsDispatch({ type: 'addChannel', channel });
            joinChannelProtected(channel.id, password);
        }
    }, [socket])

    const joinChannel = useCallback((channel: any) => {
        if (socket) {
            socket.emit('joinChannel', {
                channelId: channel.id
            })
        }
    }, [socket])

    const joinChannelProtected = useCallback((channelId: number, password: string) => {
        if (socket) {
            socket.emit('joinChannel', {
                channelId,
                password
            })
        }
    }, [socket])


    const forceToLeaveChannel = useCallback((res: any) => {
        channelsDispatch({ type: 'removeMember', channelId: res.channelId, userId: res.userId });
        channelsDispatch({ type: 'removeAdministrators', channelId: res.channelId, userId: res.userId });
        if (res.userId === user.id)
            channelsDispatch({ type: 'removeChannel', channelId: res.channelId })
        console.log("forced to leave", res, currentChannel)
        if (currentChannel && res.channelId === currentChannel.id && res.userId === user.id)
            navigate("/chat");
    }, [currentChannel, user])

    const leaveChannel = useCallback((channel: any) => {
        if (channel && channel.id && socket) {
            channelsDispatch({ type: 'removeChannel', channelId: channel.id })
            socket.emit('leaveChannel', {
                channelId: channel.id
            })
            navigate("/chat");
        }
    }, [socket])


    const getChannelFromFriendName = useCallback((friend: any) => {
        if (channels && channels.length) {
            const whispers = channels.filter((c: any) => c.type === "WHISPER");
            return (whispers.find((c: any) => {
                if (c.members && c.members.length)
                    return (c.members.find((id: number) => id === friend.id))
            }))
        }
    }, [channels])


    const updateChannelInfos = useCallback((channel: any) => {
        if (channels && channel) {
            channelsDispatch({
                type: 'updateChannelInfos',
                channelId: channel.id,
                infos: {
                    name: channel.name,
                    password: channel.password,
                    type: channel.type
                }
            })
        }
    }, [channelsDispatch, channels])

    const channelAlreadyExists = useCallback((channel: any) => {
        if (channels) {
            if (!channels.length)
                return (false);
            return (channels.find((c: any) => c.id === channel.id))
        }
        return (false)
    }, [channels])

    const isLocalChannel = useCallback((channel: any) => {
        if (channels && channels.length && channel) {
            return (channels.find((c: any) => channel.id === c.id))
        }
        return (false);
    }, [channels])

    const isLocalChannelsByName = useCallback((channel: any) => {
        if (channels && channels.length && channel) {
            return (channels.filter((c: any) => channel.name === c.name))
        }
        return (false);
    }, [channels])


    return (
        {
            isChannelPublic,
            isChannelPrivate,
            isChannelProtected,
            updateChannelName,
            updateChannelPassword,
            updateChannelType,
            addChannel,
            addChannelProtected,
            joinChannel,
            joinChannelProtected,
            forceToLeaveChannel,
            leaveChannel,
            updateChannelInfos,
            channelAlreadyExists,
            isLocalChannel,
            isLocalChannelsByName,
            getChannelFromFriendName
        }
    )
}