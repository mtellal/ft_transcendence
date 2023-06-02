import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getChannels, getUser, getUserProfilePictrue, removeChannel } from "../../utils/User";
import { useChatSocket, useFriends, useCurrentUser } from "../../Hooks";

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
            messages: channel.messages ? channel.messages : [],
            users: channel.users ? channel.users : []
        }
    )
}

function reducer(channels: any, action: any) {
    switch (action.type) {
        case ('setChannels'): {
            if (action.channels.length) {
                return (action.channels.map((c: any) => formatChannel(c)))
            }
            return (action.channels);
        }
        case ('updateChannel'): {
            if (action.channel) {
                if (channels.length) {
                    return (channels.map((c: any) => {
                        if (action.channel && c.id === action.channel.id)
                            return ({ ...c, ...action.channel })
                        return (c)
                    }))
                }
                else
                    return ([formatChannel(action.channel)])
            }
        }
        case ('addChannel'): {
            if (!channels.length)
                return ([formatChannel(action.channel)])
            if (action.channel && !channels.find((c: any) => c.id === action.channel.id)) {
                return ([...channels, formatChannel(action.channel)])
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
    const { user, image } = useCurrentUser();
    const { socket } = useChatSocket();
    const [channels, channelsDispatch] = useReducer(reducer, []);
    const [currentChannel, setCurrentChannelLocal]: any = useState();
    const { friends } = useFriends();


    const fetchUserProfilePicture = useCallback(async (userId: number) => {
        return (
            await getUserProfilePictrue(userId)
                .then(res => {
                    if (res.status === 200 && res.statusText === "OK")
                        return (window.URL.createObjectURL(new Blob([res.data])))
                })
        )
    }, [])

    const fetchUser = useCallback(async (userId: number) => {
        return (
            await getUser(userId)
                .then(async (res: any) => {
                    if (res.status === 200 && res.statusText === "OK") {
                        let user = res.data;
                        let url = await fetchUserProfilePicture(userId);
                        return ({ ...user, url })
                    }
                })
        )
    }, [])

    const fetchUsers = useCallback(async (usersId: number[]) => {
        if (usersId && usersId.length) {
            const users = await Promise.all(
                usersId.map(async (id: number) => {
                    let isFriend;
                    if (id === user.id)
                        return ({ ...user, url: image, })
                    if (friends && friends.length)
                        isFriend = friends.find((u: User) => u.id === id)
                    if (isFriend)
                        return (isFriend)
                    else
                        return (await fetchUser(id))

                })
            )
            return (users)
        }
    }, [user, friends])

    const loadChannels = useCallback(async () => {
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
        // console.log("channelList => ", channelList)
        channelsDispatch({ type: 'setChannels', channels: channelList });
        channelList.forEach(joinChannel);
        // channelList.map(async (c : any) => await removeChannel(c.id))
    }, [user, socket])


    useEffect(() => {
        if (socket && friends && user)
            loadChannels();
    }, [socket, friends, user])




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


    const getMembers = useCallback((channel: Channel) => {
        if (channel && channels && channels.length) {
            let fChannel = channels.find((c: Channel) => c.id === channel.id)
            if (fChannel) {
                return (fChannel.users)
            }
        }
        return ([]);
    }, [channels])

    const getAdministrators = useCallback((channel: Channel) => {
        if (channel && channels && channels.length) {
            let fChannel = channels.find((c: Channel) => c.id === channel.id)
            if (fChannel) {
                let admins = fChannel.administrators;
                let users = fChannel.users;

                if (admins.length && users.length) {
                    let userAdmins = admins.filter((id: number) =>
                        users.filter((u: User) => u.id === id ? u : null))
                    userAdmins = userAdmins.filter((u: User) => u)
                    return (userAdmins)
                }
            }
        }
        return ([]);
    }, [channels])





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