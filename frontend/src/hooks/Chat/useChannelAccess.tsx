import React, { useCallback, useEffect, useState } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser } from "../Hooks";
import { channel } from "diagnostics_channel";



export default function useChannelAccess()
{
    const {channels, currentChannel} = useChannelsContext();
    const [isCurrentChannelPublic, setIsCurrentChannelPublic ] = useState(false);
    const [isCurrentChannelPrivate, setIsCurrentChannelPrivate ] = useState(false);
    const [isCurrentChannelProtected, setIsCurrentChannelProtected ] = useState(false);


    useEffect(() => {
        if (channels && channels.length && currentChannel)
        {
            switch(currentChannel.type) {
                case ('PUBLIC'): setIsCurrentChannelPublic(true);
                case ('PRIVATE'): setIsCurrentChannelPrivate(true);
                case ('PROTECTED'): setIsCurrentChannelProtected(true);
                default: return ;
            }
        }
    }, [currentChannel, channels])


    const isChannelPublic = useCallback((channel : any) => {
        if (channel)
            return (channel.type === "PUBLIC")
    }, [])  

    const isChannelPrivate = useCallback((channel : any) => {
        if (channel)
            return (channel.type === "PRIVATE")
    }, [])  

    const isChannelProtected = useCallback((channel : any) => {
        if (channel)
            return (channel.type === "PROTECTED")
    }, [])  


    return (
        {
            isCurrentChannelPublic,
            isCurrentChannelPrivate,
            isCurrentChannelProtected,
            isChannelPublic,
            isChannelPrivate,
            isChannelProtected
        }
    )
}