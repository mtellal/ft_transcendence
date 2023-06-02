import React, { useCallback, useEffect, useState } from "react";

import Icon from "../../../../components/Icon";
import { UserInfos } from "../../../../components/users/UserInfos";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import { useChannels, useFriends, useCurrentUser } from "../../../../hooks/Hooks";

import './Banner.css'

type TBanner = {
    profile: () => {} | any,
    invitation: () => {} | any,
    block: () => {} | any,
    remove: () => {} | any,
}

export default function Banner({ ...props }: TBanner) {

    const { user } = useCurrentUser();
    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();

    const [friend, setFriend]: any = useState();
    const [channel, setChannel]: any = useState();

    useEffect(() => {
        setFriend(null);
        if (currentFriend)
            setFriend(currentFriend)
    }, [currentFriend])

    useEffect(() => {
        setChannel(null);
        if (currentChannel)
            setChannel(currentChannel)
    }, [currentChannel])

    const pickRemoveIcon = useCallback(() => {
        if (channel) {
            if (channel.type === "WHISPER")
                return (
                    <Icon icon="person_remove" onClick={props.remove} description="Remove" />
                )
            else {
                if (channel.ownerId === user.id)
                    return (
                        <Icon icon="delete_forever" onClick={props.remove} description="Delete" />
                    )
                else
                    return (
                        < Icon icon="logout" onClick={props.remove} description="Leave" />
                    )
            }
        }
    }, [channel])


    return (
        <div className="banner">
            {
                channel && channel.type === "WHISPER" ?
                    <UserInfos
                        username={friend && friend.username}
                        userStatus={friend && friend.userStatus}
                        profilePictureURL={friend && friend.url}
                    />
                    :
                    <ChannelInfos
                        name={channel && channel.name}
                    />
            }
            <div className="banner-icon-container">
                {
                    channel && channel.type === "WHISPER" ?
                        <Icon icon="person" onClick={props.profile} description="Profile" />
                        : <Icon icon="groups" onClick={props.profile} description="Channel" />
                }
                <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
                <Icon icon="block" onClick={props.block} description="Block" />
                {
                    pickRemoveIcon()
                }
            </div>
        </div>
    )
}
