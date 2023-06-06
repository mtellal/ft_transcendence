import React, { useCallback, useEffect, useState } from "react";
import { useChannels, useCurrentUser } from "./Hooks";


export default function useUserAccess() {

    const { user } = useCurrentUser();
    const { channels, currentChannel } = useChannels();
    const [ isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
    const [ isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

    useEffect(() => {
        if (currentChannel && user)
        {
                setIsCurrentUserOwner(user.id === currentChannel.ownerId);
                if (currentChannel.administrators)
                    setIsCurrentUserAdmin(currentChannel.administrators.find((id: number) => id === user.id) ? true : false)
        }
    }, [currentChannel, user, channels])

    const isUserOwner = useCallback((channel: any, user: any) => {
        if (channel && channel.ownerId && user && user.id === channel.ownerId)
            return (true);
        return (false);
    }, [])

    const isUserAdmin = useCallback((channel: any, user: any) => {
        if (channel && channel.administrators && user &&
            channel.administrators.find((id: number) => id === user.id))
            return (true);
        return (false);
    }, [])

    return (
        {
            isCurrentUserOwner,
            isCurrentUserAdmin,
            isUserOwner,
            isUserAdmin,
        }
    )
}