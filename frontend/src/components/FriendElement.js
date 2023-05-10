
import React, { useReducer } from 'react';

import img from '../assets/user.png'
import { Link } from 'react-router-dom'
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


export function UserInfos({id, username, userStatus, ...props})
{
    const [avatar, setAvatar] = React.useState();

    async function loadProfilePicture()
    {
        const res = await getUserProfilePictrue(id);
        if (res.status === 200 && res.statusText === "OK")
        {
            setAvatar(window.URL.createObjectURL(new Blob([res.data])))
        }
        else
            console.log("Err request friend element => ", res);
    }

    React.useEffect(() => {
        loadProfilePicture();
    }, [])

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
                <img className="friend-image" src={avatar} />
            </div>
            <div
                className="firend-icon-status"
                style={selectStatusDiv()}
            />
            <div className="friend-infos">
                <p className="username" >{username}</p>
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
            className='banner-icon'
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
            <UserInfos {...props} />
            <AddIcon onClick={props.onCLick} />
        </div>
    )
}

export default function FriendElement(props)
{    
    return (
        <Link to={`/chat/friends/${props.username}`}
            className="friend"
            style={props.selected ? {backgroundColor:'#F4F4F4'} : null}
            onClick={() => props.click(props)}
        >
            <UserInfos {...props}/> 
        </Link>
    )
}