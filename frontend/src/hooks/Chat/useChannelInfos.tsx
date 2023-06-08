import React, { useCallback } from "react";
import { useChannels, useChatSocket } from "../Hooks";

type TUpdateChannelInfos = {
    channelId: number, 
    name?: string, 
    password?: string, 
    type?: string
}


export default function useChannelInfos()
{
    const { socket } = useChatSocket();
    const { channels, currentChannel, channelsDispatch } = useChannels();

    const updateChannelName = useCallback(({channelId, name}: TUpdateChannelInfos) => {
        if (socket && channels && channels.length && currentChannel)
        {
            console.log("update channel name", channelId, name)
            socket.emit('updateChannel', {
                channelId: currentChannel.id, 
                name: name || currentChannel.name, 
            });
            channelsDispatch({type: 'updateChannelInfos', channelId, infos: {name}})
        }
    }, [socket, channels, currentChannel])

    const updateChannelPassword = useCallback(({channelId, password}: TUpdateChannelInfos) => {
        if (socket && channels && channels.length && currentChannel)
        {
            console.log("update channel password", channelId, password)
            socket.emit('updateChannel', {
                channelId: currentChannel.id, 
                password: password || currentChannel.password, 
            });
            channelsDispatch({type: 'updateChannelInfos', channelId, infos: {password}})
        }
    }, [socket, channels, currentChannel])


    const updateChannelType = useCallback(({channelId, type}: TUpdateChannelInfos) => {
        if (socket && channels && channels.length && currentChannel)
        {
            console.log("update channel type", channelId, type)
            socket.emit('updateChannel', {
                channelId: currentChannel.id, 
                type: type || currentChannel.type, 
            });
            channelsDispatch({type: 'updateChannelInfos', channelId, infos: {type}})
        }
    }, [socket, channels, currentChannel])

    return (
        {
            updateChannelName,
            updateChannelPassword, 
            updateChannelType,
        }
    )
}