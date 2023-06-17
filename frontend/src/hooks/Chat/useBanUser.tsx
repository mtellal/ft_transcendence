import { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import useFetchUsers from "../useFetchUsers";


export default function useBanUser() {
    const { socket } = useChatSocket();
    const { channelsDispatch, channels } = useChannelsContext();
    const { fetchUsers } = useFetchUsers();

    const banUser = useCallback((user: any, channel: any) => {
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

    const unbanUser = useCallback((user: any, channel: any) => {
        if (channels && channels.length && socket && channel && user) {
            socket.emit('unbanUser', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeBanList', channelId: channel.id, userId: user.id })
        }
    }, [socket, channels])

    const isUserBanned = useCallback((user: any, channel: any) => {
        if (channel && channel.banList && channel.banList.length)
            return (channel.banList.find((id: number) => id === user.id))
        return (false);
    }, [])

    const getUsersBanned = useCallback(async (channel: any) => {
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