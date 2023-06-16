import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser } from "../Hooks";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "../useFetchUsers";
import { getChannelMessages, getWhisperChannel } from "../../requests/chat";



export function useChannels() {
    const navigate = useNavigate();

    const { user, token } = useCurrentUser();
    const { socket } = useChatSocket();
    const { fetchUsers } = useFetchUsers();

    const { channels, channelsDispatch, currentChannel } = useChannelsContext();

    const addChannel = useCallback(async (channel: any, includeCurrentUser: boolean) => {
        if (socket && channel) {
            if ((!channel.users || !channel.users.length) && channel.members) {
                if (includeCurrentUser)
                    channel.members = [...channel.members, user.id]
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
            channelsDispatch({ type: 'addChannel', channel });
            joinChannel(channel);
            console.log("joined channel")
        }
    }, [socket, channelsDispatch])

    const addChannelProtected = useCallback(async (channel: any, password: string, includeCurrentUser: boolean) => {
        if (socket) {
            if (!channel.users || !channel.users.length && channel.members) {
                if (includeCurrentUser)
                    channel.members = [...channel.members, user.id]
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
            channelsDispatch({ type: 'addChannel', channel });
            joinChannelProtected(channel.id, password);
        }
    }, [socket])


    const addChannelFromFriend = useCallback(async (friend: any) => {
        if (socket && friend && user) {
            const channel = await getWhisperChannel(user.id, friend.id);
            if (channel) {
                const messages = await getChannelMessages(channel.id);
                if (messages)
                    channel.messages = messages;
                console.log("channel.messages => ", channel.messages)
                addChannel(channel, false);
            }
        }
    }, [socket, user, channels, channelsDispatch])

    const joinChannel = useCallback((channel: any) => {
        if (socket) {
            console.log("channel joined")
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


    function forceToLeaveChannel(res: any) {
        channelsDispatch({ type: 'removeMember', channelId: res.channelId, userId: res.userId });
        channelsDispatch({ type: 'removeAdministrators', channelId: res.channelId, userId: res.userId });
        if (res.userId === user.id)
            channelsDispatch({ type: 'removeChannel', channelId: res.channelId })
        if (currentChannel && res.channelId === currentChannel.id && res.userId === user.id)
            navigate("/chat");
    }

    const leaveChannel = useCallback((channel: any) => {
        console.log("leave channel called")
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


    return (
        {
            addChannel,
            addChannelFromFriend,
            addChannelProtected,
            joinChannel,
            joinChannelProtected,
            forceToLeaveChannel,
            leaveChannel,
            updateChannelInfos,
            channelAlreadyExists,
            isLocalChannel,
            getChannelFromFriendName
        }
    )
}