import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser } from "../Hooks";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "../useFetchUsers";



export function useChannels()
{
    const navigate = useNavigate();

    const {user, token} = useCurrentUser();
    const { socket } = useChatSocket();
    const { fetchUsers } = useFetchUsers();

    const { channels, channelsDispatch, currentChannel } = useChannelsContext();

    const addChannel = useCallback(async (channel: any, includeCurrentUser: boolean) => {
        if (socket) {
            if ((!channel.users || !channel.users.length) && channel.members) {
                if (includeCurrentUser)
                    channel.members = [...channel.members, user.id]
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
            channelsDispatch({ type: 'addChannel', channel });
            joinChannel(channel);
        }
    }, [socket, channels, channelsDispatch])

    const addChannelProtected = useCallback(async (channel: any, password: string, includeCurrentUser: boolean) => {
        if (socket) {
            console.log("channel => ", channel)
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


    const joinChannel = useCallback((channel: any) => {
        if (socket) {
            socket.emit('joinChannel', {
                channelId: channel.id
            })
        }
    }, [socket])

    const joinChannelProtected = useCallback((channelId : number, password: string) => {
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
        if (channel && channel.id && socket) {
            channelsDispatch({ type: 'removeChannel', channelId: channel.id })
            socket.emit('leaveChannel', {
                channelId: channel.id
            })
            navigate("/chat");
        }
    }, [socket])


    const updateChannelInfos = useCallback((channel: any) => {
        if (channels && channel)
        {
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

    return (
        {
            addChannel,
            addChannelProtected, 
            joinChannel, 
            joinChannelProtected, 
            forceToLeaveChannel, 
            leaveChannel,
            updateChannelInfos
        }
    )
}