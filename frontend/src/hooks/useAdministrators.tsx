import React, { useCallback, useContext } from "react";
import { useChannels, useChatSocket, useCurrentUser, useFriends } from "./Hooks";
import { useNavigate } from "react-router-dom";
import useFetchUsers from "./useFetchUsers";


export default function useAdinistrators() {
    const { socket } = useChatSocket();
    const { channelsDispatch, currentChannel, channels } = useChannels();
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
            /* channelsDispatch({ type: 'removeMember', channelId: channel.id, userId: user.id });
            channelsDispatch({ type: 'addBanList', channelId: channel.id, userId: user.id }); */
        }
    }, [socket])

    const isUserAdministrators = useCallback((user: any, channel: any) => {
        if (channel && channel.administrators && channel.administrators.length)
            return (channel.administrators.find((id: number) => id === user.id))
        return (false);
    }, [])

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
            isUserAdministrators,
            getAdministrators
        }
    )
}