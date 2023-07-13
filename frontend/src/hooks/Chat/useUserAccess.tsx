import React, { useCallback, useEffect, useState } from "react";
import { useChannelsContext, useCurrentUser } from "../Hooks";
import { Channel, User } from "../../types";


export default function useUserAccess(channel: Channel) {

    const { user } = useCurrentUser();
    const { channels } = useChannelsContext();
    const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

    useEffect(() => {
        if (channel && user) {
            setIsCurrentUserOwner(user.id === channel.ownerId);
            if (channel.administrators)
                setIsCurrentUserAdmin(channel.administrators.find((id: number) => id === user.id) ? true : false)
        }
    }, [channel, user, channels])

    const isUserOwner = useCallback((user: User) => {
        if (channel && channel.ownerId && user && user.id === channel.ownerId)
            return (true);
        return (false);
    }, [])

    const isUserAdmin = useCallback((user: User) => {
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
        if (isUserOwner(user))
            return (1)
        if (isUserAdmin(user))
            return (2);
        return (0)
    }, [])

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