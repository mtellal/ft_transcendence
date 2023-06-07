import React, { useCallback, useContext } from "react";
import { useChannels, useChatSocket, useCurrentUser, useFriends } from "./Hooks";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "./useFetchUsers";


export default function useBanUser() {
    const { socket } = useChatSocket();
    const { channelsDispatch, currentChannel, channels } = useChannels();
    const { friends } = useFriends();
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const { fetchUsers } = useFetchUsers();

    const banUser = useCallback((user: any, channel: any) => {
        console.log("ban user ", user);
        if (socket && channel && user) {
            socket.emit('banUser', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeMember', channelId: channel.id, userId: user.id });
            channelsDispatch({ type: 'removeAdministrators', channelId: channel.id, userId: user.id })
            channelsDispatch({ type: 'addBanList', channelId: channel.id, userId: user.id });
        }
    }, [socket, channels, currentChannel])

    const unbanUser = useCallback((user: any, channel: any) => {
        console.log("unban user ", user, channel);
        if (socket && channel && user) {
            socket.emit('unbanUser', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeBanList', channelId: channel.id, userId: user.id })
        }
    }, [socket, channels, currentChannel])

    const isUserBanned = useCallback((user: any, channel: any) => {
        console.log("isUserBanned ", user, channel)
        if (channel && channel.banList && channel.banList.length)
            return (channel.banList.find((id: number) => id === user.id))
        return (false);
    }, [])

    const getUsersBanned = useCallback(async (channel: any) => {
        if (channel && channels && channels.length) {

            let banned = channel.banList;

            if (banned.length) {
                let usersBanned = await Promise.all(await fetchUsers(banned))
                return (usersBanned)
            }
        }
        return ([]);
    }, [channels])

    return (
        {
            banUser,
            unbanUser,
            isUserBanned,
            getUsersBanned
        }
    )
}