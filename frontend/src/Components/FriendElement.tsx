
import React, { useEffect, useReducer, useState } from 'react';

import imgUser from '../assets/user.png'
import { Link, NavLink } from 'react-router-dom'
import { getUserProfilePictrue } from '../utils/User'

import './FriendElement.css'
import Icon from './Icon';

/*  

PROPS

key={f.id}
id={f.id}
username={f.username}
status={e.status}
chat={false}
hover={true}
selected={currentFriend === e.id ? true : false}
className="chat"
click={handleFriendsMessage}
*/


export function UserInfos({ id, username, profilePictureURL, userStatus, ...props }: any) {

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
        <div className="infos-div" >
            <div className='friend-image-container'>
                <img className="friend-image" src={profilePictureURL || imgUser} />
            </div>
            <div
                className="firend-icon-status"
                style={selectStatusDiv()}
            />
            <div className="flex-column friend-infos">
                <p className="friend-username" >{username}</p>
                <p className="friend-status">
                    {selectStatusText()}
                </p>
            </div>
        </div>
    )
}


export function FriendSearch(props: any) {
    const [invitation, setInvitation]: [any, any] = React.useState(false);

    const [url, setUrl] : any = useState();

    async function loadURL()
    {
        await getUserProfilePictrue(props.id)
            .then(res => {
                if (res.status == 200 && res.statusText == "OK")
                    setUrl(window.URL.createObjectURL(new Blob([res.data])))
            })   
    }   

    useEffect(() => {
        if (props.id)
        {
            loadURL();
        }
    }, [props.id])

    return (
        <div style={{
            boxShadow: '0 1px 3px black',
            borderRadius: '5px',
            width: '96%',
            display: 'flex',
            padding: '2% 2%',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <UserInfos {...props} profilePictureURL={url} />
            {props.add &&
                !invitation &&
                <Icon
                    icon="add"
                    onClick={() => { props.onCLick(); setInvitation(true) }}
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

export default function FriendElement(props: any) {
    return (
        <NavLink to={`/chat/friends/${props.username}/${props.id}`}
            className={({ isActive }) =>
                isActive ? "friend-element hover-fill-grey selected" : "friend-element hover-fill-grey"
            }
            onClick={() => props.click(props)}
        >
            <UserInfos {...props} userAvatar={props.avatar} />
            {
                props.notifs !== 0 ?
                    <div className='friendelement-notifs'>
                        <p>{props.notifs > 10 ? "10+" : props.notifs}</p>
                    </div>
                    : null
            }
        </NavLink>
    )
}