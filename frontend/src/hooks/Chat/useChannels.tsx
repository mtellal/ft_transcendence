import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser } from "../Hooks";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "../useFetchUsers";
import { Channel, User } from "../../types";
import { createChannel, getWhisperChannel } from "../../requests/chat";


export function useChannels() {
    const navigate = useNavigate();

    const { user, token } = useCurrentUser();
    const { socket } = useChatSocket();
    const { fetchUsers } = useFetchUsers();

    const { channels, channelsDispatch, currentChannel } = useChannelsContext();

    const isChannelPublic = useCallback((channel: Channel) => {
        if (channel)
            return (channel.type === "PUBLIC")
    }, [])

    const isChannelPrivate = useCallback((channel: Channel) => {
        if (channel)
            return (channel.type === "PRIVATE")
    }, [])

    const isChannelProtected = useCallback((channel: Channel) => {
        if (channel)
            return (channel.type === "PROTECTED")
    }, [])


    const updateChannelName = useCallback((channelId: number, name: string) => {
        if (socket && channels && channels.length && channelId && name) {
            socket.emit('updateChannel', {
                channelId: channelId,
                name: name,
            });
            channelsDispatch({ type: 'updateChannelInfos', channelId, infos: { name } })
        }
    }, [socket, channels])

    const updateChannelPassword = useCallback((channelId: number, password: string) => {
        if (socket && channels && channels.length && channelId && password) {
            socket.emit('updateChannel', {
                channelId,
                password,
            });
            channelsDispatch({ type: 'updateChannelInfos', channelId, infos: { password } })
        }
    }, [socket, channels])


    const updateChannelType = useCallback((channelId: number, type: string, password: string = "") => {
        if (socket && channels && channels.length && channelId && type) {
            socket.emit('updateChannel', {
                channelId,
                type,
                password
            });
            channelsDispatch({ type: 'updateChannelInfos', channelId, infos: { type } })
        }
    }, [socket, channels])


    const addChannel = useCallback(async (channel: Channel, includeCurrentUser: boolean) => {
        if (socket && channel) {
            if ((!channel.users || !channel.users.length) && channel.members) {
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
            channelsDispatch({ type: 'addChannel', channel });
            if (includeCurrentUser)
                channelsDispatch({ type: 'addMember', channelId: channel.id, user: user });
            joinChannel(channel);
        }
    }, [socket, channelsDispatch])

    const addChannelProtected = useCallback(async (channel: Channel, password: string, includeCurrentUser: boolean) => {
        if (socket) {
            if (!channel.users || !channel.users.length && channel.members) {
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
             channelsDispatch({ type: 'addChannel', channel });
            if (includeCurrentUser)
                channelsDispatch({ type: 'addMember', channelId: channel.id, user: user });
            joinChannelProtected(channel.id, password);
        }
    }, [socket])

    const joinChannel = useCallback((channel: Channel) => {
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
        if (currentChannel && res.channelId === currentChannel.id && res.userId === user.id)
            navigate("/chat");
    }, [currentChannel, user])

    const leaveChannel = useCallback((channel: Channel) => {
        if (channel && channel.id && socket) {
            channelsDispatch({ type: 'removeChannel', channelId: channel.id })
            socket.emit('leaveChannel', {
                channelId: channel.id
            })
            navigate("/chat");
        }
    }, [socket])


    const getChannelFromFriendName = useCallback((friend: User) => {
        if (channels && channels.length) {
            const whispers = channels.filter((c: Channel) => c.type === "WHISPER");
            return (whispers.find((c: Channel) => {
                if (c.members && c.members.length)
                    return (c.members.find((id: number) => id === friend.id))
            }))
        }
    }, [channels])


    const updateChannelInfos = useCallback((channel: Channel) => {
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

    const channelAlreadyExists = useCallback((channel: Channel) => {
        if (channels) {
            if (!channels.length)
                return (false);
            return (channels.find((c: Channel) => c.id === channel.id))
        }
        return (false)
    }, [channels])

    const isLocalChannel = useCallback((channel: Channel) => {
        if (channels && channels.length && channel) {
            return (channels.find((c: Channel) => channel.id === c.id))
        }
        return (false);
    }, [channels])

    const isLocalChannelsByName = useCallback((channel: Channel) => {
        if (channels && channels.length && channel) {
            return (channels.filter((c: Channel) => channel.name === c.name))
        }
        return (false);
    }, [channels])


    const selectWhisperChannel = useCallback(async (friend: User) => {
        let channel = null;
        if (channels && channels.length && friend) {
            channel = channels.find((c: Channel) =>
                c.type === "WHISPER" && c.members.find((id: number) => friend.id === id))
        }
        if (!channel && friend && user && token) {
            await getWhisperChannel(user.id, Number(friend.id), token)
                .then(res => {
                    if (res.data) {
                        channel = res.data
                    }
                })
        }
        return (channel);
    }, [channels, user, token]);


    const createWhisperChannel = useCallback(async (friendId: number) => {
        let channel = null;
        if (token && friendId)
        {
            await createChannel({
                name: "privateMessage",
                type: "WHISPER",
                members: [
                    friendId
                ],
            }, token)
            .then(res => { channel = res.data })
        }
        return (channel);
    }, [token])

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
            getChannelFromFriendName,
            selectWhisperChannel,
            createWhisperChannel
        }
    )
}