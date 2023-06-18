import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getChannels } from "../../requests/chat";
import { useChatSocket, useCurrentUser } from "../../hooks/Hooks";
import useFetchUsers from "../../hooks/useFetchUsers";

export const ChannelsContext: React.Context<any> = createContext([]);

/*
id              Int             @id @default(autoincrement())
  username        String          @unique
  password        String
  email           String?         @unique
  avatar          String?
  oauth_code      String?         @unique
  oauth_exp       DateTime?
  twoFactorSecret String?
  twoFactorStatus Boolean         @default(false)
  twoFactorOtpUrl String?
  userStatus      Status          @default(OFFLINE)
  friendRequest   FriendRequest[]
  friendList      Int[]           @default([])
  blockList     BlockedUser[]
  channelList     Int[]           @default([])
  createdAt       DateTime        @default(now())
*/

type User = {
    id: number,
    username: string,
    password: string,
    email?: string,
    avatar?: string,
    userStatus?: any[],
    friendRequest?: any[],
    friendList: number[],
    blockList: number[],
    channelList: number[],
    createdAt?: string,

    oauth_code?: any,
    oauth_exp?: any,
    twoFactorSecret?: any,
    twoFactorStatus?: any,
    twoFactorOtpUrl?: any
}

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

    users?: User[],
    notifs: number
}


function formatChannel(channel: Channel) {
    return (
        {
            ...channel,
            messages: channel.messages || [],
            users: channel.users || [],
            notifs: channel.notifs || 0
        }
    )
}

function reducer(channels: any, action: any) {
    switch (action.type) {
        case ('initChannels'): {
            if (action.channels.length) {
                return (action.channels.map((c: any) => formatChannel(c)))
            }
            return (action.channels);
        }
        case ('addChannel'): {
            if (!channels.length) {
                return ([formatChannel(action.channel)])
            }
            if (action.channel && !channels.find((c: any) => c.id === action.channel.id)) {
                return ([...channels, formatChannel(action.channel)])
            }
        }
        case ('removeChannel'): {
            if (channels.length && action.channelId) {
                return (channels.filter((c: any) => c.id !== action.channelId))
            }
        }
        case ('updateChannelInfos'): {
            if (channels && channels.length && action.channelId && action.infos) {
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
            if (channels && channels.length && action.channelId && action.userId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId) {
                            c.ownerId = action.userId;
                            if (!c.administrators.find((id: number) => id === action.userId))
                                c.administrators.push(action.userId);                        
                        }
                        return (c);
                    })
                )
            }
        }
        case ('addAdministrators'): {
            if (channels.length && action.channelId && action.userId) {
                return (channels.map((c: Channel) => {
                    if (c.id === action.channelId)
                        if (!c.administrators.find((id: number) => id === action.userId))
                            c.administrators.push(action.userId);
                    return (c);
                }
                ))
            }
        }
        case ('removeAdministrators'): {
            if (channels.length && action.channelId && action.userId) {
                return (channels.map((c: Channel) => {
                    if (c.id === action.channelId && c.administrators && c.administrators.length)
                        c.administrators = c.administrators.filter((id: number) => id !== action.userId)
                    return (c)
                }
                ))
            }
        }
        case ('addMuteList'): {
            if (channels.length && action.channelId && action.userId && action.mute) {
                return (channels.map((c: Channel) => {
                    if (c.id === action.channelId && c.muteList) {
                        if (c.muteList.length && c.muteList.find((o: any) => o.userId === action.userId)) {
                            c.muteList = c.muteList.map((o: any) => o.userId === action.userId ? action.mute : o)
                        }
                        else
                            c.muteList.push(action.mute);
                    }
                    return (c);
                }
                ))
            }
        }
        case ('removeMuteList'): {
            if (channels.length && action.channelId && action.userId) {
                return (channels.map((c: Channel) => {
                    if (c.id === action.channelId &&
                        c.muteList && c.muteList.length) {
                        c.muteList = c.muteList.filter((o: any) => o.userId !== action.userId);
                        console.log("removeMuteList =>", c.muteList)
                    }
                    return (c)
                }
                ))
            }
        }
        case ('addBanList'): {
            if (channels.length && action.channelId && action.userId) {
                return (channels.map((c: Channel) => {
                    if (c.id === action.channelId && !c.banList.find((id: number) => id === action.userId))
                        c.banList.push(action.userId);
                    return (c);
                }
                ))
            }
        }
        case ('removeBanList'): {
            if (channels.length && action.channelId && action.userId) {
                return (channels.map((c: Channel) => {
                    if (c.id === action.channelId &&
                        c.banList && c.banList.length) {
                        c.banList = c.banList.filter((id: number) => id !== action.userId)
                    }
                    return (c)
                }
                ))
            }
        }
        case ('addMember'): {
            if (channels.length && action.user && action.channelId) {
                return (
                    channels.map((c: Channel) => {
                        if (c.id === action.channelId) {
                            if (!c.users.find((u: User) => u.id === action.user.id))
                                c.users.push(action.user);
                            if (!c.members.find((id: number) => id === action.user.id))
                                c.members.push(action.user.id)
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
                    channels.map((c: any) => {
                        if (c.id === messages[0].channelId && !c.messages.length) {
                            c.messages = messages;
                        }
                        return (c);
                    })
                )
            }
        }
        case ('addMessage'): {
            const message = action.message;
            if (channels.length && message) {
                return (
                    channels.map((c: any, i: number) => {
                        if (c.id === message.channelId) {
                            c.messages = [...c.messages, message];
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

    const { user } = useCurrentUser();
    const { socket } = useChatSocket();
    const { fetchUsers } = useFetchUsers();

    const [channels, channelsDispatch] = useReducer(reducer, []);
    const [currentChannel, setCurrentChannelLocal]: any = useState();
    const [channelsLoading, setChannelsLoading] = useState(false);

    async function loadUsersChannels(channelList: Channel[]) {
        let users;
        if (channelList && channelList.length) {
            return (
                await Promise.all(channelList.map(async (c: any) => {
                    if (c.members && c.members.length) {
                        users = await fetchUsers(c.members);
                        users = users.filter((u: any) => u)
                        return ({ ...c, users })
                    }
                }))
            )
        }
        return ([]);
    }


    const loadChannels = useCallback(async () => {
        setChannelsLoading(true)
        let channelList;
        channelList = await getChannels(user.id).then(res => res.data);
        channelList = await loadUsersChannels(channelList);
        channelsDispatch({ type: 'initChannels', channels: channelList });
        channelList.forEach((channel: Channel) => {
            socket.emit('joinChannel', {
                channelId: channel.id
            })
        });
        // channelList.map(async (c : any) => await removeChannel(c.id))
        setChannelsLoading(false)

    }, [user, socket])

    useEffect(() => {
        if (user && socket && !channelsLoading && !channels.length) {
            loadChannels();
        }
    }, [socket, user])


    ////////////////////////////////////////////////////////////////
    //               C U R R E N T    C H A N N E L               //
    ////////////////////////////////////////////////////////////////

    const setCurrentChannel = useCallback((channel: any) => {
        let pickChannel;
        if (!channels.length)
            pickChannel = channel;
        else if (channel) {
            pickChannel = channels.find((c: any) => c.id === channel.id)
            if (!pickChannel)
                pickChannel = channel
        }
        setCurrentChannelLocal(pickChannel);
    }, [channels])

    /*
        when events in channels[] are triggered currentChannel need to be updated
    */
    useEffect(() => {
        if (channels) {
            if (channels.length)
                setCurrentChannelLocal((p: any) => p ? channels.find((c: any) => c.id == p.id) : null)
            else
                setCurrentChannelLocal(null)
        }
    }, [channels])


    return (
        <ChannelsContext.Provider value={{
            channels,
            channelsDispatch,
            currentChannel,
            setCurrentChannel
        }}>
            {children}
        </ChannelsContext.Provider>
    )
}