import React, { createContext, useEffect, useReducer, useState } from "react";
import { useChannels, useUser } from "../../Hooks";
import { getUser } from "../../utils/User";


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
        case('removeChannelsUsers'): {
            if (channelsUsers)
                return (channelsUsers.filter((o : ChannelUsers) => o.channelId !== action.channelId))
            return (channelsUsers)
        }
        default: return (channelsUsers)
    }
}

export default function ChannelsUsersProvider({ children }: any) {
    const { user } = useUser();
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

    async function addChannelUsers(channel: any) {
        const members = channel.members;
        if (channelsUsers.length) {
            channelsUsers.find(async (obj: ChannelUsers) => {
                if (obj.channelId !== channel.id) {
                    const users = await fetchMembers(members);
                    if (users)
                        channelsUsersDispatch({ type: 'addChannelsUsers', channelsUsers: { channelId: channel.id, users } })
                }
            })
        }
        else {
            let users = await fetchMembers(members);
            console.log(users)
            if (users)
                channelsUsersDispatch({ type: 'addChannelsUsers', channelsUsers: { channelId: channel.id, users } })
        }
    }

    useEffect(() => {
        if (currentChannel) {
            addChannelUsers(currentChannel);
        }
    }, [currentChannel])

    function getMembers(channelId: number) {
        if (channelsUsers.length) {
            const obj = channelsUsers.find((o: ChannelUsers) => o.channelId === channelId);
            if (obj && obj.users)
                return (obj.users)
        }
        return (null)
    }

    return (
        <ChannelsUsersContext.Provider value={{
            channelsUsers,
            channelsUsersDispatch,
            getMembers
        }}>
            {children}
        </ChannelsUsersContext.Provider>
    )
}