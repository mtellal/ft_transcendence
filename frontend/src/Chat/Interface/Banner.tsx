import React, { useEffect, useState } from "react";
import { UserInfos } from "../../Components/FriendElement";
import './Banner.css'
import Icon from "../../Components/Icon";
import { useChannels, useFriends } from "../../Hooks";

export default function Banner({...props }: any) {

    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();

    return (
        <div className="banner">
            <UserInfos
                id={currentFriend && currentFriend.id}
                username={currentFriend && currentFriend.username}
                userStatus={currentFriend && currentFriend.userStatus}
                userAvatar={currentFriend && currentFriend.avatar}
            />
            <div className="flex-center">
                <Icon icon="person" onClick={props.profile} description="Profile" />
                <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
                <Icon icon="block" onClick={props.block} description="Block" />
                <Icon icon="person_remove" onClick={props.remove} description="Remove" />
            </div>
        </div>
    )
}
