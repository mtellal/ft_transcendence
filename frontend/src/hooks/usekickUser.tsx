import React, { useCallback, useContext } from "react";
import { useChannels, useChatSocket, useCurrentUser, useFriends } from "./Hooks";
import { useNavigate } from "react-router-dom";
import useUserAccess from "./useUserAccess";


export default function useKickUser() {
    const { socket } = useChatSocket();
    const { channelsDispatch, currentChannel, channels } = useChannels();

    const kickUser = useCallback((user: any, channel: any) => {
        console.log("kick user ", user);
        if (socket && channel && user) {
            socket.emit('kickUser', {
                channelId: channel.id,
                userId: user.id
            })
            channelsDispatch({ type: 'removeMember', channelId: channel.id, userId: user.id })
            channelsDispatch({ type: 'removeAdministrators', channelId: channel.id, userId: user.id })
        }
    }, [socket])

    return (
        {
            kickUser,
        }
    )
}