
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom'

import Icon from '../Icon';
import imgUser from '../../assets/user.png'
import ProfilePicture from '../ProfilePicture';
import { getUserProfilePictrue } from '../../utils/User'
import './UserLabel.css'

type TUserInfos = {
    username: string,
    profilePictureURL: string,
    userStatus: string
}

export function UserInfos({ username, profilePictureURL, userStatus }: TUserInfos) {

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
        <div className="userinfos-container" >
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

type TUserLabelSearch = TUserInfos & {
    id: number,
    add?: boolean,
    invitation?: boolean,
    accept?: () => {} | any,
    refuse?: () => {} | any,
    delete?: () => {} | any,
    onClick?: () => {} | any,
}


export function UserLabelSearch(props: TUserLabelSearch) {
    const [invitation, setInvitation]: [any, any] = React.useState(false);

    const [url, setUrl]: any = useState();

    async function loadURL() {
        await getUserProfilePictrue(props.id)
            .then(res => {
                if (res.status == 200 && res.statusText == "OK")
                    setUrl(window.URL.createObjectURL(new Blob([res.data])))
            })
    }

    useEffect(() => {
        if (props.id) {
            loadURL();
        }
    }, [props.id])

    return (
        <div className='flex-ai UserLabelSearch-container'>
            <UserInfos {...props} profilePictureURL={url} />
            {props.add &&
                !invitation &&
                <Icon
                    icon="add"
                    onClick={() => { props.onClick(); setInvitation(true) }}
                />
            }
            {props.invitation &&
                <>
                    <Icon icon="done" onClick={props.accept} />
                    <Icon icon="close" onClick={props.refuse} />
                </>
            }
            {
                props.delete && <Icon icon="delete" onClick={props.delete} />
            }
        </div>
    )
}

type TUserLabel = TUserInfos & {
    id: number,
    username: string,
    notifs?: number,
    onClick?: () => {} | any
}

export default function UserLabel(props: TUserLabel) {
    return (
        <NavLink to={`/chat/friends/${props.username}/${props.id}`}
            className={({ isActive }) =>
                isActive ? "friend-element hover-fill-grey selected" : "friend-element hover-fill-grey"
            }
            onClick={() => props.onClick}
        >
            <UserInfos {...props} />
            {/* {
                props.notifs !== 0 ?
                    <div className='UserLabel-notifs'>
                        <p>{props.notifs > 10 ? "10+" : props.notifs}</p>
                    </div>
                    : null
            } */}
        </NavLink>
    )
}