import React, { useCallback, useEffect, useState } from "react";

import Icon from "../../../../components/Icon";
import { UserInfos } from "../../../../components/users/UserInfos";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import { useChannels, useFriends, useCurrentUser } from "../../../../hooks/Hooks";

import './Banner.css'
import { useWindow } from "../../../../hooks/useWindow";

function IconsBanner(props: any) {
    const pickRemoveIcon = useCallback(() => {
        if (props.channel) {
            if (props.channel.type === "WHISPER")
                return (
                    <Icon icon="person_remove" onClick={props.remove} description="Remove" />
                )
            else {
                if (props.channel.ownerId === props.user.id)
                    return (
                        <Icon icon="delete_forever" onClick={props.remove} description="Delete" />
                    )
                else
                    return (
                        < Icon icon="logout" onClick={props.remove} description="Leave" />
                    )
            }
        }
    }, [props.channel])

    return (
        <>
            {
                props.channel && props.channel.type === "WHISPER" ?
                    <Icon icon="person" onClick={props.profile} description="Profile" />
                    : <Icon icon="groups" onClick={props.profile} description="Channel" />
            }
            <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
            <Icon icon="block" onClick={props.block} description="Block" />
            {
                pickRemoveIcon()
            }
        </>
    )

}

type TBanner = {
    profile: () => {} | any,
    invitation: () => {} | any,
    block: () => {} | any,
    remove: () => {} | any,
    backToMenu: () => {} | any
}

export default function Banner({ ...props }: TBanner) {

    const { user } = useCurrentUser();
    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();

    const [friend, setFriend]: any = useState();
    const [channel, setChannel]: any = useState();

    const { isMobileDisplay } = useWindow();

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


    console.log(isMobileDisplay)

    return (
        <div className="banner">
            <div className="flex-center">
                {
                    isMobileDisplay &&
                    <div className="flex-center banner-menu-back">
                        <Icon
                            icon="arrow_back"
                            description="friends"
                            onClick={props.backToMenu}
                        />
                    </div>
                }

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
            </div>
            {
                isMobileDisplay ?

                    <div className="flex banner-icons-container">
                        <IconsBanner
                            channel={channel}
                            user={user}
                            {...props}
                        />
                    </div>
                    : 
                    <IconsBanner
                    channel={channel}
                    user={user}
                    {...props}
                />
            }

            {/* {
                channel && channel.type === "WHISPER" ?
                    <Icon icon="person" onClick={props.profile} description="Profile" />
                    : <Icon icon="groups" onClick={props.profile} description="Channel" />
            }
            <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
            <Icon icon="block" onClick={props.block} description="Block" />
            {
                pickRemoveIcon()
            } */}
        </div>
    )
}
