import React, { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";

type TUpdateChannelInfos = {
    channelId: number, 
    name?: string, 
    password?: string, 
    type?: string
}


export default function useChannelInfos()
{
    const { socket } = useChatSocket();
    const { channels, currentChannel, channelsDispatch } = useChannelsContext();

    const updateChannelName = useCallback(({channelId, name}: TUpdateChannelInfos) => {
        if (socket && channels && channels.length && channelId && name)
        {
            console.log("update channel name", channelId, name)
            socket.emit('updateChannel', {
                channelId: channelId, 
                name: name, 
            });
            channelsDispatch({type: 'updateChannelInfos', channelId, infos: {name}})
        }
    }, [socket, channels])

    const updateChannelPassword = useCallback((channelId: number , password: string , type: string) => {
        if (socket && channels && channels.length && channelId && password)
        {
            console.log("update channel password", channelId, password)
            socket.emit('updateChannel', {
                channelId, 
                password, 
                type
            });
            channelsDispatch({type: 'updateChannelInfos', channelId, infos: {password}})
        }
    }, [socket, channels])


    const updateChannelType = useCallback(({channelId, type}: TUpdateChannelInfos) => {
        if (socket && channels && channels.length && channelId && type)
        {
            console.log("update channel type", channelId, type)
            socket.emit('updateChannel', {
                channelId: channelId, 
                type: type, 
            });
            channelsDispatch({type: 'updateChannelInfos', channelId, infos: {type}})
        }
    }, [socket, channels])

    return (
        {
            updateChannelName,
            updateChannelPassword, 
            updateChannelType,
        }
    )
}