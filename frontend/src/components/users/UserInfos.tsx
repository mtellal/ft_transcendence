
import React, { useEffect, useState } from 'react';

import imgUser from '../../assets/user.png'
import ProfilePicture from './ProfilePicture';
import './UserInfos.css'


export type TUserInfos = {
    username: string,
    profilePictureURL: string,
    userStatus: string,
    onClick?: () => {} | any
}

export function UserInfos({ username, profilePictureURL, userStatus, onClick }: TUserInfos) {

    function selectStatusDiv() {
        if (userStatus === "ONLINE")
            return ({ backgroundColor: "#14CA00" })
        else if (userStatus === "OFFLINE")
            return ({ backgroundColor: "#FF0000" })
        else if (userStatus === "INGAME")
            return ({ backgroundColor: '#FFC600' })
    }

    function selectStatusText() {
        if (userStatus === "ONLINE")
            return ("On line")
        else if (userStatus === "OFFLINE")
            return ("Disconnected")
        else if (userStatus === "INGAME")
            return ("In game")
    }

    return (
        <div className="userinfos-container" onClick={onClick} >
            <div className='userinfos-pp-container'>
                <ProfilePicture
                    image={profilePictureURL || imgUser}
                />
            </div>
            <div
                className="userinfos-icon-status"
                style={selectStatusDiv()}
            />
            <div className="flex-column user-infos">
                <p className="userinfos-username" >{username}</p>
                <p className="userinfos-status">
                    {selectStatusText()}
                </p>
            </div>
        </div>
    )
}