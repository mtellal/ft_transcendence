
import React, { useEffect, useState } from 'react';

import imgUser from '../../assets/user.png'
import ProfilePicture from './ProfilePicture';
import './UserInfos.css'


export type TUserInfos = {
    user: any
    onClick?: () => {} | any
}

export function UserInfos({ user, onClick }: TUserInfos) {

    function selectStatusDiv() {
        if (user && user.userStatus === "ONLINE")
            return ({ backgroundColor: "#14CA00" })
        else if (user && user.userStatus === "OFFLINE")
            return ({ backgroundColor: "#FF0000" })
        else if (user && user.userStatus === "INGAME")
            return ({ backgroundColor: '#FFC600' })
    }

    function selectStatusText() {
        if (user && user.userStatus === "ONLINE")
            return ("On line")
        else if (user && user.userStatus === "OFFLINE")
            return ("Disconnected")
        else if (user && user.userStatus === "INGAME")
            return ("In game")
    }

    return (
        <div className="userinfos-container" onClick={onClick} >
            {
                user ?
                <>
                    <div className='userinfos-pp-container'>
                        <ProfilePicture
                            image={user && user.url}
                        />
                    </div>
                    <div
                        className="userinfos-icon-status"
                        style={selectStatusDiv()}
                    />
                    <div className="flex-column user-infos">
                        <p className="userinfos-username" >{user && user.username}</p>
                        <p className="userinfos-status">
                            {selectStatusText()}
                        </p>
                    </div>
                </>
                : null
            }
        </div>
    )
}