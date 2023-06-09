import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getChannel, getChannels, removeChannel } from "../../requests/chat";
import { useChatSocket, useFriends, useCurrentUser } from "../../hooks/Hooks";
import {
    getUser, getUserProfilePictrue
} from '../../requests/user'
import useFetchUsers from "../../hooks/useFetchUsers";
import { useNavigate } from "react-router-dom";
import useKickUser from "../../hooks/Chat/usekickUser";

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
  blockedList     BlockedUser[]
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
    blockedList: number[],
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
}


function formatChannel(channel: Channel) {
    return (
        {
            ...channel,
            messages: channel.messages || [],
            users: channel.users || []
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
            if (!channels.length)
                return ([formatChannel(action.channel)])
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
            if (channels.length && action.channelId && action.userId) {
                return (channels.map((c: Channel) => {
                    if (c.id === action.channelId && !c.muteList.find((id: number) => id === action.userId))
                        c.muteList.push(action.userId);
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
                        c.muteList = c.muteList.filter((id: number) => id !== action.userId)
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
            if (channels.length && message) {
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
    const { user } = useCurrentUser();
    const { socket } = useChatSocket();
    const [channels, channelsDispatch] = useReducer(reducer, []);
    const [currentChannel, setCurrentChannelLocal]: any = useState();
    const { fetchUser, fetchUsers } = useFetchUsers();
    const navigate = useNavigate();

    const [channelsLoading, setChannelsLoading] = useState(false);


    const loadChannels = useCallback(async () => {
        setChannelsLoading(true)
        let channelList = await getChannels(user.id)
            .then(res => {
                if (res.status === 200 && res.statusText === "OK") {
                    return (res.data)
                }
            })

        channelList = await Promise.all(channelList.map(async (c: any) => {
            if (c.members && c.members.length) {
                let users = await fetchUsers(c.members)
                users = users.filter((u: any) => u)
                return ({ ...c, users })
            }
        }))
        channelsDispatch({ type: 'initChannels', channels: channelList });
        channelList.forEach(joinChannel);
        // channelList.map(async (c : any) => await removeChannel(c.id))
        setChannelsLoading(false)
    }, [user, socket])

    useEffect(() => {
        if (user && socket && !channelsLoading)
            loadChannels();
    }, [socket, user])

    useEffect(() => {
        if (socket && user) {

            socket.on('newChannel', async (channel: any) => {
                console.log("NEW CHANNEL EVENT")
                if (channel) {
                    const users = await fetchUsers(channel.members)
                    channelsDispatch({ type: 'addChannel', channel: { ...channel, users } });
                    joinChannel(channel)
                }
            })

            socket.on('updatedChannel', (channel: any) => {
                console.log("UPDATED CHANNEL EVENT")
                // name / password / type
                if (channel) {
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
            })

            socket.on('joinedChannel', async (res: any) => {
                console.log("JOINED CHANNEL EVENT")
                const user = await fetchUser(res.userId);
                channelsDispatch({ type: 'addMember', channelId: res.channelId, user: user })
            })

            socket.on('leftChannel', async (res: any) => {
                console.log("LEFT CHANNEL EVENT")
                channelsDispatch({ type: 'removeMember', channelId: res.channelId, userId: res.userId })
                channelsDispatch({ type: 'removeAdministrators', channelId: res.channelId, userId: res.userId })
            })

            socket.on('ownerChanged', (channelId: number, name: string) => {
                console.log("UPDATED CHANNEL EVENT")
                // name / password / type
            })


            socket.on('addedtoChannel', async (res: any) => {
                console.log("ADDED CHANNEL EVENT")
                if (res && res.channelId) {

                    if (res.userId === user.id) {
                        const channel = await getChannel(res.channelId).then(res => res.data);
                        if (channel) {
                            const users = await fetchUsers(channel.members)
                            channelsDispatch({ type: 'addChannel', channel: { ...channel, users } });
                            joinChannel(channel)
                        }
                    }
                    else {
                        const user = await fetchUser(res.userId);
                        channelsDispatch({ type: 'addMember', channelId: res.channelId, user: user })
                    }
                }
            })

            // socket.on('exception', (e : any) => console.log("exception =>", e))

            socket.on('madeAdmin', (res: any) => {
                console.log("MADE ADMIN CHANNEL EVENT");
                if (res && res.channelId && res.userId) {
                    channelsDispatch({ type: 'addAdministrators', channelId: res.channelId, userId: res.userId })
                }
            })

            socket.on('removedAdmin', async (res: any) => {
                console.log("REMOVED ADMIN CHANNEL EVENT")
                if (res && res.channelId && res.userId) {
                    channelsDispatch({ type: 'removeAdministrators', channelId: res.channelId, userId: res.userId })
                }
            })

            socket.on('kickedUser', async (res: any) => {
                console.log("KICKED CHANNEL EVENT")
                forceToLeaveChannel(res)
            })

            socket.on('mutedUser', async (res: any) => {
                console.log("MUTED USER CHANNEL EVENT")
                console.log(res)
            })

            socket.on('bannedUser', async (res: any) => {
                console.log("BANNED CHANNEL EVENT")
                if (res && res.channelId && res.userId) {
                    channelsDispatch({ type: 'addBanList', channelId: res.channelId, userId: res.userId });
                    forceToLeaveChannel(res)
                }
            })

            socket.on('unbannedUser', (res: any) => {
                console.log("UNBANNED CHANNEL EVENT")
                if (res && res.channelId && res.userId) {
                    console.log("res => ", res, channels)
                    channelsDispatch({ type: 'removeBanList', channelId: res.channelId, userId: res.userId })
                }
            })


            if (channels && channels.length) {
                socket.on('message', (m: any) => {
                    console.log("message recieved")
                    if (m.length) {
                        channelsDispatch({ type: 'initMessages', messages: m });
                    }
                    if (m.content) {
                        /* if (m.sendBy !== user.id && m.sendBy !== currentElement.id) {
                            friendsDispatch({ type: 'addNotif', friendId: m.sendBy })
                        } */
                        channelsDispatch({ type: 'addMessage', message: m });
                    }
                });
            }

            return () => {
                if (socket) {
                    socket.off('newChannel')
                    socket.off('updatedChannel')
                    socket.off('joinedChannel')
                    socket.off('leftChannel')
                    socket.off('addedtoChannel')
                    socket.off('madeAdmin')
                    socket.off('removedAdmin')
                    socket.off('kickedUser')
                    socket.off('bannedUser')
                    socket.off('unbannedUser')
                    socket.off('message')
                    socket.off('mutedUser')
                }
            }
        }
    }, [socket, channels, user])


    console.log(channels)

    function forceToLeaveChannel(res: any) {
        channelsDispatch({ type: 'removeMember', channelId: res.channelId, userId: res.userId });
        channelsDispatch({ type: 'removeAdministrators', channelId: res.channelId, userId: res.userId });
        if (res.userId === user.id)
            channelsDispatch({ type: 'removeChannel', channelId: res.channelId })
        if (currentChannel && res.channelId === currentChannel.id && res.userId === user.id)
            navigate("/chat");
    }


    ////////////////////////////////////////////////////////////////
    //                       C H A N N E L S                      //
    ////////////////////////////////////////////////////////////////

    const addChannel = useCallback(async (channel: any, includeCurrentUser: boolean) => {
        if (socket) {
            if (!channel.users || !channel.users.length && channel.members) {
                if (includeCurrentUser)
                    channel.members = [...channel.members, user.id]
                const users = await fetchUsers(channel.members)
                if (users)
                    channel = { ...channel, users }
            }
            channelsDispatch({ type: 'addChannel', channel });
            joinChannel(channel);
        }
    }, [socket])


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


    const leaveChannel = useCallback((channel: any) => {
        if (channel && channel.id && socket) {
            channelsDispatch({ type: 'removeChannel', channelId: channel.id })
            socket.emit('leaveChannel', {
                channelId: channel.id
            })
        }
    }, [socket])


    ////////////////////////////////////////////////////////////////
    //                           U S E R S                        //
    ////////////////////////////////////////////////////////////////

    /*
        !!!!!!!!!!! ATTENTION LES USERS DEMANDES SONT ENVOYES AVEC TOUS LEURS DETAILS, 
            demander seulement les datas pour un ami
    */

    const getMembers = useCallback((channelId: number) => {
        if (channelId && channels && channels.length) {
            let fChannel = channels.find((c: Channel) => c.id === channelId)
            if (fChannel) {
                return (fChannel.users)
            }
        }
        return ([]);
    }, [channels])

    const getOwner = useCallback((channel: Channel) => {
        if (channel && channels && channels.length) {

            let ownerId = channel.ownerId;
            let users = channel.users;

            if (users.length) {
                let owner = users.find((u: User) => u.id === ownerId)
                return (owner)
            }
        }
        return ([]);
    }, [channels])


    const getMuted = useCallback((channel: Channel) => {
        if (channel && channels && channels.length) {

            let banned = channel.banList;
            let users = channel.users;

            if (banned.length && users.length) {
                let userAdmins = banned.map((id: number) => users.find((u: User) => u.id === id))
                userAdmins = userAdmins.filter((u: User) => u)
                return (userAdmins)
            }
        }
        return ([]);
    }, [channels])



    const channelAlreadyExists = useCallback((channel: any) => {
        if (channels) {
            if (!channels.length)
                return (false);
            return (channels.find((c: any) => c.id === channel.id))
        }
        return (false)
    }, [channels])

    const isLocalChannel = useCallback((channel: Channel) => {
        if (channels && channels.length && channel) {
            return (channels.find((c: Channel) => channel.id === c.id))
        }
        return (false);
    }, [channels])


    ////////////////////////////////////////////////////////////////
    //               C U R R E N T    C H A N N E L               //
    ////////////////////////////////////////////////////////////////


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



    //console.log(channels)

    return (
        <ChannelsContext.Provider value={{
            channels,
            channelsDispatch,
            currentChannel,
            setCurrentChannel,
            addChannel,
            addChannelProtected,
            joinChannel,
            leaveChannel,
            channelAlreadyExists,
            getOwner,
            getMembers,
            isLocalChannel
        }}>
            {children}
        </ChannelsContext.Provider>
    )
}