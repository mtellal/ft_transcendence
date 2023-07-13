import { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import useFetchUsers from "../useFetchUsers";
import { User, Channel } from "../../types";


export default function useBanUser(channel: Channel) {
    const { socket } = useChatSocket();
    const { channelsDispatch, channels } = useChannelsContext();
    const { fetchUsers } = useFetchUsers();

    const banUser = useCallback((user: User) => {
        if (channels && channels.length && socket && channel && user) {
            socket.emit('banUser', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeMember', channelId: channel.id, userId: user.id });
            channelsDispatch({ type: 'removeAdministrators', channelId: channel.id, userId: user.id })
            channelsDispatch({ type: 'addBanList', channelId: channel.id, userId: user.id });
        }
    }, [socket, channels])

    const unbanUser = useCallback((user: User) => {
        if (channels && channels.length && socket && channel && user) {
            socket.emit('unbanUser', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeBanList', channelId: channel.id, userId: user.id })
        }
    }, [socket, channels])

    const isUserBanned = useCallback((user: User) => {
        if (channel && channel.banList && channel.banList.length)
            return (channel.banList.find((id: number) => id === user.id))
        return (false);
    }, [])

    const getUsersBanned = useCallback(async () => {
        if (channel && channel.banList) {
            return (await Promise.all(await fetchUsers(channel.banList)));
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