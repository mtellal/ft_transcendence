import React, { useCallback, useContext } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser, useFriends } from "../Hooks";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "../useFetchUsers";


export default function useAdinistrators() {
    const { socket } = useChatSocket();
    const { channelsDispatch, currentChannel, channels } = useChannelsContext();
    const { friends } = useFriends();
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const { fetchUsers } = useFetchUsers();

    const makeAdmin = useCallback((user: any, channel: any) => {
        console.log("make admin user ", user);
        if (socket && channel && user) {
            socket.emit('makeAdmin', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'addAdministrators', channelId: channel.id, userId: user.id });
        }
    }, [socket])

    const removeAdmin = useCallback((user: any, channel: any) => {
        console.log("remove admin user ", user);
        if (socket && channel && user) {
            socket.emit('removeAdmin', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeAdministrators', channelId: channel.id, userId: user.id });
        }
    }, [socket])

    const isUserAdministrators = useCallback((user: any) => {
        if (channels && currentChannel && currentChannel.administrators && currentChannel.administrators.length)
            return (currentChannel.administrators.find((id: number) => id === user.id))
        return (false);
    }, [channels, currentChannel])

    const getAdministrators = useCallback((channel: any) => {
        if (channel && channels && channels.length) {

            let admins = channel.administrators;
            let users = channel.users;

            if (admins.length && users.length) {
                let userAdmins = admins.map((id: number) => users.find((u: any) => u.id === id))
                userAdmins = userAdmins.filter((u: any) => u)
                return (userAdmins)
            }
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