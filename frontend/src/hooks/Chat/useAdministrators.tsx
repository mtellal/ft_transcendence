import { useCallback } from "react";
import { useChannelsContext, useChatSocket } from "../Hooks";
import { User, Channel } from "../../types";


export default function useAdinistrators() {
    const { socket } = useChatSocket();
    const { channelsDispatch, currentChannel, channels } = useChannelsContext();

    const makeAdmin = useCallback((user: User, channel: Channel ) => {
        if (socket && channel && user) {
            socket.emit('makeAdmin', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'addAdministrators', channelId: channel.id, userId: user.id });
        }
    }, [socket])

    const removeAdmin = useCallback((user: User, channel: Channel) => {
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
            currentChannel && currentChannel.administrators && currentChannel.administrators.length)
            return (currentChannel.administrators.find((id: number) => id === user.id))
        return (false);
    }, [channels, currentChannel])

    const getAdministrators = useCallback((channel: Channel) => {
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