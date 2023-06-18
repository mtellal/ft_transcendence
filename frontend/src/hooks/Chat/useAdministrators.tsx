import { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";


export default function useAdinistrators() {
    const { socket } = useChatSocket();
    const { channelsDispatch, currentChannel, channels } = useChannelsContext();

    const makeAdmin = useCallback((user: any, channel: any) => {
        if (socket && channel && user) {
            socket.emit('makeAdmin', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'addAdministrators', channelId: channel.id, userId: user.id });
        }
    }, [socket])

    const removeAdmin = useCallback((user: any, channel: any) => {
        if (socket && channel && user) {
            socket.emit('removeAdmin', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeAdministrators', channelId: channel.id, userId: user.id });
        }
    }, [socket])

    const isUserAdministrators = useCallback((user: any) => {
        if (channels && channels.length &&
            currentChannel && currentChannel.administrators && currentChannel.administrators.length)
            return (currentChannel.administrators.find((id: number) => id === user.id))
        return (false);
    }, [channels, currentChannel])

    const getAdministrators = useCallback((channel: any) => {
        if (channel && channels && channels.length &&
            channel.administrators && channel.administrators.length &&
            channel.users && channel.users.length) {

            let users = channel.users;

            let userAdmins = channel.administrators.map((id: number) => users.find((u: any) => u.id === id))
            return (userAdmins.filter((u: any) => u));
        }
        return ([]);
    }, [channels])

    return (
        {
            makeAdmin,
            removeAdmin,
            isUserAdministrators,
            getAdministrators
        }
    )
}