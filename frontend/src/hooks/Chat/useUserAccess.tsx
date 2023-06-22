import React, { useCallback, useEffect, useState } from "react";
import { useChannelsContext, useCurrentUser } from "../Hooks";
import { Channel, User } from "../../types";


export default function useUserAccess() {

    const { user } = useCurrentUser();
    const { channels, currentChannel } = useChannelsContext();
    const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

    useEffect(() => {
        if (currentChannel && user) {
            setIsCurrentUserOwner(user.id === currentChannel.ownerId);
            if (currentChannel.administrators)
                setIsCurrentUserAdmin(currentChannel.administrators.find((id: number) => id === user.id) ? true : false)
        }
    }, [currentChannel, user, channels])

    const isUserOwner = useCallback((channel: Channel, user: User) => {
        if (channel && channel.ownerId && user && user.id === channel.ownerId)
            return (true);
        return (false);
    }, [])

    const isUserAdmin = useCallback((channel: Channel, user: User) => {
        if (channel && channel.administrators && channel.administrators.length && user)
            return (channel.administrators.find((id: number) => id === user.id))
        return (false);
    }, [])

    const getCurrentUserAccess = useCallback(() => {
        if (isCurrentUserOwner)
            return (1)
        if (isCurrentUserAdmin)
            return (2);
        return (0)
    }, [isCurrentUserAdmin, isCurrentUserOwner])

    const getUserAccess = useCallback((user: User) => {
        if (currentChannel && channels) {
            if (isUserOwner(currentChannel, user))
                return (1)
            if (isUserAdmin(currentChannel, user))
                return (2);
            return (0)
        }
    }, [currentChannel, channels])

    return (
        {
            isCurrentUserOwner,
            isCurrentUserAdmin,
            isUserOwner,
            isUserAdmin,
            getUserAccess,
            getCurrentUserAccess
        }
    )
}