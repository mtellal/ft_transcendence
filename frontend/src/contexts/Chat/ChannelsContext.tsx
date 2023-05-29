import React, { createContext, useEffect, useReducer, useState } from "react";
import { getChannels } from "../../utils/User";
import { useChatSocket, useFriends, useUser } from "../../Hooks";
import { getFriendChannel } from "../../utils/User";

export const ChannelsContext: React.Context<any> = createContext([]);

function newConversation(channel: any) {
    return (
        {
            ...channel,
            messages: []
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
            console.log(message)
            if (channels.length) {
                console.log("addMessage")
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
    const [friends] = useFriends();
    const [channels, channelsDispatch] = useReducer(reducer, []);
    const [currentChannel, setCurrentChannelLocal] = useState();

    async function loadDirectMessages() {
        friends.map(async (f: any) =>
            await getFriendChannel(user.id, f.id)
                .then(res =>  {
                    channelsDispatch({ type: 'addChannel', channel: res.data })
            })
        )
    }

    async function loadChannels() {
        await getChannels(user.id)
            .then(res => {
                if (res.status === 200 && res.statusText === "OK") {
                    channelsDispatch({ type: 'setChannels', channels: res.data });
                }
            })
    }

    useEffect(() => {
        loadChannels();
    }, [])

    useEffect(() => {
        if (friends) {
            loadDirectMessages();
        }

    }, [friends])

    function joinChannel(channel: any) {
        socket.emit('joinChannel', {
            channelId: channel.id
        })
    }

    // pick the good channel with all messages 
    function setCurrentChannel(channel: any) {
        const pickChannel = channels.find((c: any) => c.id === channel.id)
        setCurrentChannelLocal(pickChannel);
    }

    useEffect(() => {
        if (channels)
            setCurrentChannelLocal((p : any) => p ? channels.find((c : any) => c.id == p.id) : p)
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