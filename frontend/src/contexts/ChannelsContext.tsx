import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { deleteChannelRequest, getChannels } from "../requests/chat";
import { useChatSocket, useCurrentUser } from "../hooks/Hooks";
import useFetchUsers from "../hooks/useFetchUsers";
import { Channel, Mute, User } from "../types";

export const ChannelsContext: React.Context<any> = createContext([]);

function formatChannel(channel: Channel) {
    return (
        {
            ...channel,
            messages: channel.messages || [],
            users: channel.users || [],
            muteList: channel.muteList || []
        }
    )
}

function reducer(channels: Channel[], action: any) {
    switch (action.type) {
        case ('initChannels'): {
            if (action.channels && action.channels.length) {
                return (action.channels.map((c: Channel) => formatChannel(c)))
            }
        }
        case ('addChannel'): {
            if (!channels.length) {
                return ([formatChannel(action.channel)])
            }
            else if (action.channel && !channels.find((c: Channel) => c.id === action.channel.id)) {
                return ([...channels, formatChannel(action.channel)])
            }
        }
        case ('removeChannel'): {
            if (channels.length && action.channelId) {
                return (channels.filter((c: Channel) => c.id !== action.channelId))
            }
        }
        case ('updateChannelInfos'): {
            if (channels.length && action.channelId && action.infos) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId) {
                            if (action.infos.name)
                                c.name = action.infos.name;
                            if (action.infos.password)
                                c.password = action.infos.password;
                            if (action.infos.type)
                                c.type = action.infos.type;
                        }
                        return (c)
                    })
                )
            }
        }
        case ('ownerChanged'): {
            if (channels.length && action.channelId && action.userId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId) {
                            c.ownerId = action.userId;
                            if (!c.administrators.find((id: number) => id === action.userId))
                                c.administrators = [...c.administrators, action.userId];
                        }
                        return (c);
                    })
                )
            }
        }
        case ('addAdministrators'): {
            if (channels.length && action.channelId && action.userId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId &&
                            !c.administrators.find((id: number) => id === action.userId))
                            c.administrators = [...c.administrators, action.userId];
                        return (c);
                    }
                    )
                )
            }
        }
        case ('removeAdministrators'): {
            if (channels.length && action.channelId && action.userId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId && c.administrators)
                            c.administrators = c.administrators.filter((id: number) => id !== action.userId)
                        return (c)
                    })
                )
            }
        }
        case ('addMuteList'): {
            if (channels.length && action.channelId && action.userId && action.mute) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId) {
                            if (c.muteList && c.muteList.find((o: Mute) => o.userId === action.userId)) {
                                c.muteList = c.muteList.map((o: Mute) => o.userId === action.userId ? action.mute : o)
                            }
                            else
                                c.muteList = [...c.muteList, action.mute];
                        }
                        return (c);
                    }
                    )
                )
            }
        }
        case ('removeMuteList'): {
            if (channels.length && action.channelId && action.userId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId && c.muteList.length) {
                            c.muteList = c.muteList.filter((o: Mute) => o.userId !== action.userId);
                        }
                        return (c)
                    })
                )
            }
        }
        case ('addBanList'): {
            if (channels.length && action.channelId && action.userId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId && !c.banList.find((id: number) => id === action.userId))
                            c.banList = [...c.banList, action.userId];
                        return (c);
                    })
                )
            }
        }
        case ('removeBanList'): {
            if (channels.length && action.channelId && action.userId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId && c.banList.length) {
                            c.banList = c.banList.filter((id: number) => id !== action.userId)
                        }
                        return (c)
                    })
                )
            }
        }
        case ('addMember'): {
            if (channels.length && action.user && action.channelId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId) {
                            if (!c.users.find((u: User) => u.id === action.user.id))
                                c.users = [...c.users, action.user];
                            if (!c.members.find((id: number) => id === action.user.id))
                                c.members = [...c.members, action.user.id];
                        }
                        return (c)
                    })
                )
            }
        }
        case ('removeMember'): {
            if (channels.length && action.userId && action.channelId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId) {
                            c.members = c.members.filter((id: number) => id !== action.userId);
                            c.users = c.users.filter((u: User) => u.id !== action.userId);
                        }
                        return (c)
                    })
                )
            }
        }
        case ('initMessages'): {
            const messages = action.messages;
            if (channels.length && messages && messages.length) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === messages[0].channelId && !c.messages.length) {
                            c.messages = messages;
                        }
                        return (c);
                    })
                )
            }
        }
        case ('addMessage'): {
            if (channels.length && action.message) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.message.channelId) {
                            c.messages = [...c.messages, action.message];
                        }
                        return (c);
                    })
                )
            }
        }
        default: return (channels)
    }
}


export function ChannelsProvider({ children }: any) {

    const { user, token } = useCurrentUser();
    const { socket } = useChatSocket();
    const { fetchUsers } = useFetchUsers();

    const [channels, channelsDispatch] = useReducer(reducer, []);
    const [currentChannel, setCurrentChannelLocal]: any = useState();
    const [channelsLoading, setChannelsLoading] = useState(false);
    const [channelsLoaded, setChannelsLoaded] = useState(false);

    async function loadUsersChannels(channelList: Channel[]) {
        let users;
        if (channelList && channelList.length) {
            return (
                await Promise.all(channelList.map(async (c: Channel) => {
                    if (c.members && c.members.length) {
                        users = await fetchUsers(c.members);
                        users = users.filter((u: User) => u);
                        return ({ ...c, users })
                    }
                }))
            )
        }
        return ([]);
    }


    const loadChannels = useCallback(async () => {
        setChannelsLoading(true);
        setChannelsLoaded(false);
        let channelList;
        channelList = await getChannels(user.id, token).then(res => res.data);
        channelList = await loadUsersChannels(channelList);
        channelsDispatch({ type: 'initChannels', channels: channelList });
        channelList.forEach((channel: Channel) => {
            socket.emit('joinChannel', {
                channelId: channel.id
            })
        });
        // channelList.forEach((channel: Channel) => deleteChannelRequest(channel.id, token));
        setChannelsLoading(false);
        setChannelsLoaded(true);
    }, [user, socket])

    useEffect(() => {
        if (user && socket && !channelsLoading && !channels.length) {
            loadChannels();
        }
    }, [socket, user])


    ////////////////////////////////////////////////////////////////
    //               C U R R E N T    C H A N N E L               //
    ////////////////////////////////////////////////////////////////

    const setCurrentChannel = useCallback((channel: Channel) => {
        let pickChannel;
        if (!channels.length)
            pickChannel = channel;
        else if (channel) {
            pickChannel = channels.find((c: Channel) => c.id === channel.id)
            if (!pickChannel)
                pickChannel = channel
        }
        setCurrentChannelLocal(pickChannel);
    }, [channels])


    useEffect(() => {
        if (channels) {
            if (channels.length)
                setCurrentChannelLocal((p: any) => p ? channels.find((c: Channel) => c.id == p.id) : null)
            else
                setCurrentChannelLocal(null)
        }
    }, [channels])


    return (
        <ChannelsContext.Provider value={{
            channels,
            channelsDispatch,
            currentChannel,
            setCurrentChannel,
            channelsLoaded
        }}>
            {children}
        </ChannelsContext.Provider>
    )
}