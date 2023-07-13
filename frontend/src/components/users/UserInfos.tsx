
import React from 'react';
import ProfilePicture from './ProfilePicture';
import './UserInfos.css'
import { User } from '../../types';
import { useNavigate } from 'react-router-dom';


export type TUserInfos = {
    user: User,
    message?: string,
    onClick?: () => {} | any,
    profile?: boolean
}

export function UserInfos({ user, message, onClick, profile }: TUserInfos) {

    const navigate = useNavigate();

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
                        <div className={profile ? 'userinfos-pp-container pointer' : 'userinfos-pp-container'}
                            onClick={() => {
                                if (profile) {
                                    navigate(`/user/${user.id}`)
                                }
                            }}
                        >
                            <ProfilePicture
                                image={user && user.url}
                                boxShadow={profile}
                            />
                        </div>
                        <div
                            className="userinfos-icon-status"
                            style={selectStatusDiv()}
                        />
                        <div className="user-infos">
                            <p className="userinfos-username" >{user && user.username}</p>
                            <p className="userinfos-status">
                                {message || selectStatusText()}
                            </p>
                        </div>
                    </>
                    : null
            }
        </div>
    )
}