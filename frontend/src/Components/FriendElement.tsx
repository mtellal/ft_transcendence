
import React, { useReducer } from 'react';

import imgUser from '../assets/user.png'
import { Link, NavLink } from 'react-router-dom'
import { getUserProfilePictrue } from '../utils/User'

import './FriendElement.css'

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


export function UserInfos({id, username, userStatus, userAvatar, ...props})
{
    const [avatar, setAvatar] = React.useState();

    async function loadProfilePicture()
    {
        const res = await getUserProfilePictrue(id);
        if (res.status === 200 && res.statusText === "OK")
        {
            setAvatar(window.URL.createObjectURL(new Blob([res.data])))
        }
    }

    React.useEffect(() => {
        loadProfilePicture();
    }, [userAvatar])

    function selectStatusDiv()
    {
        if (userStatus === "ONLINE")
            return ({backgroundColor:"#14CA00"} )
        else if (userStatus === "OFFLINE")
            return ({backgroundColor:"#FF0000"})
        else if (userStatus === "INGAME")
            return ({backgroundColor: '#FFC600'})
    }

    function selectStatusText()
    {
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
                <img className="friend-image" src={avatar || imgUser} />
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

function AddIcon(props)
{
    return (
        <div 
            className='flex-center hover-fill-grey banner-icon'
            onClick={props.onClick}
        >
            <span className="material-symbols-outlined">
                Add
            </span>
        </div>
    )
}


export function FriendSearch(props)
{
    return (
        <div style={{
            boxShadow:'0 1px 3px black',
            borderRadius:'5px',
            width: '100%', 
            display:'flex', 
            padding: '5px 5px',
            justifyContent:'space-between',
            alignItems:'center'
        }}>
            <UserInfos {...props} userAvatar={props.avatar}/>
            { props.add && <AddIcon onClick={props.onCLick} /> }
        </div>
    )
}

export default function FriendElement(props)
{    
    return (
        <NavLink to={`/chat/friends/${props.username}/${props.id}`}
            className={({isActive}) => 
                isActive ? "friend-element hover-fill-grey selected" : "friend-element hover-fill-grey"
            }
            onClick={() => props.click(props)}
        >
            <UserInfos {...props} userAvatar={props.avatar} /> 
        </NavLink>
    )
}