import { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import { User, Channel } from "../../types";


export default function useAdinistrators(channel: Channel) {
    const { socket } = useChatSocket();
    const { channelsDispatch, channels } = useChannelsContext();

    const makeAdmin = useCallback((user: User) => {
        if (socket && channel && user) {
            socket.emit('makeAdmin', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'addAdministrators', channelId: channel.id, userId: user.id });
        }
    }, [socket])

    const removeAdmin = useCallback((user: User) => {
        if (socket && channel && user) {
            socket.emit('removeAdmin', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeAdministrators', channelId: channel.id, userId: user.id });
        }
    }, [socket])

    const isUserAdministrators = useCallback((user: User) => {
        if (channels && channels.length &&
            channel && channel.administrators && channel.administrators.length)
            return (channel.administrators.find((id: number) => id === user.id))
        return (false);
    }, [channels])

    const getAdministrators = useCallback(() => {
        if (channel && channels && channels.length &&
            channel.administrators && channel.administrators.length &&
            channel.users && channel.users.length) {

            let users = channel.users;

            let userAdmins = channel.administrators.map((id: number) => users.find((u: User) => u.id === id))
            return (userAdmins.filter((u: User) => u));
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