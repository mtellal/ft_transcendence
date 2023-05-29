import React, { useEffect, useState } from "react";
import { UserInfos } from "../../Components/FriendElement";
import './Banner.css'
import Icon from "../../Components/Icon";

export default function Banner({ friend , ...props }: any) {

    return (
        <div className="banner">
            <UserInfos
                id={friend && friend.id}
                username={friend && friend.username}
                userStatus={friend && friend.userStatus}
                userAvatar={friend && friend.avatar}
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
