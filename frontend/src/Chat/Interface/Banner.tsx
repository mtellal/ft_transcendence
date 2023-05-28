import React from "react";
import { UserInfos } from "../../Components/FriendElement";
import './Banner.css'
import Icon from "../../Components/Icon";

export default function Banner({ element, ...props }: any) {

    return (
        <div className="banner">
            <UserInfos
                id={element.id}
                username={element.username}
                userStatus={element.userStatus}
                userAvatar={element.avatar}
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
