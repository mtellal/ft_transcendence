import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getChannels, getUser } from "../../utils/User";
import { useChatSocket, useFriends, useUser } from "../../Hooks";

export const ChannelsContext: React.Context<any> = createContext([]);

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
            if (channels.length) {
                channels.map((c: any) => {
                    if (action.channel && c.id === action.channel.id)
                        return ({...c, ...action.channel})
                    return (c)
                })
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
    const [currentChannel, setCurrentChannelLocal] = useState();

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
                    if (id !== user.id) {
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
        channelsDispatch({ type: 'setChannels', channels: channelList })
    }

    useEffect(() => {
        loadChannels();
    }, [])

    function joinChannel(channel: any) {
        socket.emit('joinChannel', {
            channelId: channel.id
        })
    }

    // pick the good channel with all messages 
    const setCurrentChannel = useCallback((channel: any) => {
        const pickChannel = channels.find((c: any) => c.id === channel.id)
        setCurrentChannelLocal(pickChannel);
    }, [channels])
   

    useEffect(() => {
        if (channels)
            setCurrentChannelLocal((p: any) => p ? channels.find((c: any) => c.id == p.id) : p)
    }, [channels])

    return (
        <ChannelsContext.Provider value={{
            channels,
            channelsDispatch,
            joinChannel,
            currentChannel,
            setCurrentChannel,
        }}>
            {children}
        </ChannelsContext.Provider>
    )
}