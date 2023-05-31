import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { useChannels, useUser } from "../../Hooks";
import { getUser, getUserProfilePictrue } from "../../utils/User";


export const ChannelsUsersContext: React.Context<any> = createContext([]);

type ChannelUsers = {
    channelId: number,
    users: any[]
}

type ReducerAction = {
    type: string,
    channelsUsers?: ChannelUsers,
    channelId?: number
}

function reducer(channelsUsers: ChannelUsers[], action: ReducerAction) {
    switch (action.type) {
        case ('addChannelsUsers'): {
            if (channelsUsers.length && action.channelsUsers && action.channelsUsers.users.length)
                return ([...channelsUsers, action.channelsUsers])
            return ([action.channelsUsers])
        }
        case ('removeChannelsUsers'): {
            if (channelsUsers)
                return (channelsUsers.filter((o: ChannelUsers) => o.channelId !== action.channelId))
            return (channelsUsers)
        }
        default: return (channelsUsers)
    }
}

export default function ChannelsUsersProvider({ children }: any) {
    const { user, image } = useUser();
    const { currentChannel } = useChannels();
    const [channelsUsers, channelsUsersDispatch] = useReducer(reducer, []);

    async function fetchMembers(membersId: any[]) {
        if (membersId && membersId.length) {
            let users = await Promise.all(membersId.map(async (id: number) => {
                if (id !== user.id)
                    return (
                        await getUser(id)
                            .then(res => res.data)
                    )
            }
            ))
            users = users.filter((u: any) => u)
            return (users)
        }
        return (null)
    }

    async function fetchProfilePicture(users: any[]) {
        if (users && users.length) {
            let newUsers = await Promise.all(users.map(async (u: any) =>
                await getUserProfilePictrue(u.id)
                    .then(res => ({ ...u, url: window.URL.createObjectURL(new Blob([res.data])) }))
            ))
            return (newUsers)
        }
    }


    async function addChannelUsers(channel: any) {
        const members = channel.members;
        if (channelsUsers.length) {
            channelsUsers.find(async (obj: ChannelUsers) => {
                if (obj.channelId !== channel.id) {
                    let users = await fetchMembers(members);
                    users = await fetchProfilePicture(users);
                    if (users)
                        channelsUsersDispatch({ type: 'addChannelsUsers', channelsUsers: { channelId: channel.id, users } })
                }
            })
        }
        else {
            let users = await fetchMembers(members);
            users = await fetchProfilePicture(users);
            if (users)
                channelsUsersDispatch({ type: 'addChannelsUsers', channelsUsers: { channelId: channel.id, users } })
        }
    }

    useEffect(() => {
        if (currentChannel) {
            addChannelUsers(currentChannel);
        }
    }, [currentChannel])

    const getMembers = useCallback((channelId: number) => {
        let members: any = null;
        if (user)
            members = [{ ...user, url: image }]
        if (channelsUsers && channelsUsers.length) {
            const obj = channelsUsers.find((o: ChannelUsers) => o.channelId === channelId);
            if (obj && obj.users)
                return ([...members, ...obj.users])
        }
        return (members)
    }, [channelsUsers, user])

    const getAdmins = useCallback((channel: any) => {
        let admins: any = [];
        if (channelsUsers && channelsUsers.length && user && channel) {
            let users: any = getMembers(channel.id)
            if (users && channel.administrators) {
                let a = users.map((u : any) => channel.administrators.find((id : any) => u.id === id) ? u : null);
                a = a.filter((u : any) => u)
                if (a)
                    admins = [...a, ...admins]
            }
        }
        return (admins)
    }, [channelsUsers, user])

    return (
        <ChannelsUsersContext.Provider value={{
            channelsUsers,
            channelsUsersDispatch,
            getMembers,
            getAdmins
        }}>
            {children}
        </ChannelsUsersContext.Provider>
    )
}