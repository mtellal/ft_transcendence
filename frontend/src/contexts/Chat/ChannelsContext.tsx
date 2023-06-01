import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getChannels, getUser, removeChannel } from "../../utils/User";
import { useChatSocket, useFriends, useUser } from "../../Hooks";
import { channel } from "diagnostics_channel";

export const ChannelsContext: React.Context<any> = createContext([]);

type Channel = {
    id: number
    name?: string,
    password?: string,
    messages?: any[],
    ownerId: number,
    administrators: any[],
    members: number[],
    banList: number[],
    muteList: any[],
    type: string,
    createdAt?: string
}


function newConversation(channel: any) {
    return (
        {
            ...channel,
            messages: channel.messages ? channel.messages : [],
            users: channel.users ? channel.users : []
        }
    )
}

function reducer(channels: any, action: any) {
    switch (action.type) {
        case ('setChannels'): {
            if (action.channels.length) {
                return (action.channels.map((c: any) => newConversation(c)))
            }
            return (action.channels);
        }
        case ('updateChannel'): {
            if (action.channel)
            {
                if (channels.length) {
                    return (channels.map((c: any) => {
                        if (action.channel && c.id === action.channel.id)
                            return ({ ...c, ...action.channel })
                        return (c)
                    }))
                }
                else
                    return ([newConversation(action.channel)])
            }
        }
        case ('addChannel'): {
            if (!channels.length)
                return ([newConversation(action.channel)])
            if (action.channel && !channels.find((c: any) => c.id === action.channel.id)) {
                return ([...channels, newConversation(action.channel)])
            }
        }
        case ('removeChannel'): {
            if (channels.length && action.channel) {
                return (channels.filter((c: any) => c.id !== action.channel.id))
            }
        }
        case ('initMessages'): {
            const messages = action.messages;
            if (channels.length && messages && messages.length) {
                return (
                    channels.map((c: any) => {
                        if (c.id === messages[0].channelId) {
                            c.messages = messages;
                        }
                        return (c);
                    })
                )
            }
        }
        case ('addMessage'): {
            const message = action.message;
            if (channels.length) {
                return (
                    channels.map((c: any, i: number) => {
                        if (c.id === message.channelId)
                            c.messages = [...c.messages, message];
                        return (c);
                    })
                )
            }
        }
        default: return (channels)
    }
}

export function ChannelsProvider({ children }: any) {
    const { user } = useUser();
    const { socket } = useChatSocket();
    const [channels, channelsDispatch] = useReducer(reducer, []);
    const [currentChannel, setCurrentChannelLocal]: any = useState();

    async function loadChannels() {
        let channelList = await getChannels(user.id)
            .then(res => {
                if (res.status === 200 && res.statusText === "OK") {
                    return (res.data)
                }
            })

        channelList = await Promise.all(channelList.map(async (c: any) => {
            if (c.members && c.members.length) {
                let users = await Promise.all(c.members.map(async (id: number) => {
                    if (id !== user.id && c.type !== "WHISPER") {
                        return (
                            await getUser(id)
                                .then(res => {
                                    if (res.status === 200 && res.statusText === "OK")
                                        return (res.data)
                                })
                        )
                    }
                    return (null)
                }))
                users = users.filter((u: any) => u)
                return ({ ...c, users })
            }
        }))
        channelsDispatch({ type: 'setChannels', channels: channelList });
        channelList.forEach(joinChannel);
        //channelList.map(async (c : any) => await removeChannel(c.id))
    }

    useEffect(() => {
        if (socket)
            loadChannels();
    }, [socket])

    const joinChannel = useCallback((channel: any) => {
        if (socket) {
            socket.emit('joinChannel', {
                channelId: channel.id
            })
        }
    }, [socket])

    const leaveChannel = useCallback((channel: any) => {
        if (channel && channel.id && socket) {
            channelsDispatch({ type: 'removeChannel', channel })
            socket.emit('leaveChannel', {
                channelId: channel.id
            })
        }
    }, [socket])

    const channelAlreadyExists = useCallback((channel: any) => {
        if (channels) {
            if (!channels.length)
                return (false);
            return (channels.find((c: any) => c.id === channel.id))
        }
        return (false)
    }, [channels])

    const addChannel = useCallback((channel: any) => {
        if (socket) {
            channelsDispatch({ type: 'addChannel', channel });
            joinChannel(channel)
        }
    }, [socket])

    // pick the good channel with all messages 
    const setCurrentChannel = useCallback((channel: any) => {
        let pickChannel;
        if (!channels.length)
            pickChannel = channel;
        else {
            pickChannel = channels.find((c: any) => c.id === channel.id)
            if (!pickChannel)
                pickChannel = channel
        }
        setCurrentChannelLocal(pickChannel);
    }, [channels])

    useEffect(() => {
        if (channels && channels.length) {
            setCurrentChannelLocal((p: any) => p ? channels.find((c: any) => c.id == p.id) : p)
        }
    }, [channels])

    return (
        <ChannelsContext.Provider value={{
            channels,
            channelsDispatch,
            currentChannel,
            setCurrentChannel,
            addChannel,
            joinChannel,
            leaveChannel,
            channelAlreadyExists
        }}>
            {children}
        </ChannelsContext.Provider>
    )
}