import React from "react";
import { UserInfos } from "../../Components/FriendElement";
import './Banner.css'

export default function Banner({element, ...props} : any) {

    return (
        <div className="banner">
            <UserInfos 
                id={element.id}
                username={element.username}
                userStatus={element.userStatus}
                userAvatar={element.avatar}
            />
            <div className="flex-center">

                <div className="flex-center banner-icon hover-fill-grey" onClick={props.profile}>
                    <span className="material-symbols-outlined">
                        person
                    </span>
                <div className="description">Profile</div>
                </div>

                <div className="flex-center banner-icon hover-fill-grey" onClick={props.invitation}>
                    <span className="material-symbols-outlined">
                        sports_esports
                    </span>
                <div className="description">Invitation</div>
                </div>

                <div className="flex-center banner-icon hover-fill-grey" onClick={props.block} >
                    <span className="material-symbols-outlined">
                        block
                    </span>
                <div className="description">Block</div>
                </div>

                <div className="flex-center banner-icon hover-fill-grey" onClick={props.remove} >
                    <span className="material-symbols-outlined">
                        person_remove
                    </span>
                <div className="description">Remove</div>
                </div>

            </div>
        </div>
    )
}
