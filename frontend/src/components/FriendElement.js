
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


function AddIcon(props)
{
    return (
        <div className='banner-icon'>
            <span className="material-symbols-outlined">
                Add
            </span>
        </div>
    )
}

export default function FriendElement(props)
{    
    const [userIg, setUserImg] = React.useState();

    function selectStatusDiv()
    {
        if (props.userStatus === "ONLINE")
            return ({backgroundColor:"#14CA00"} )
        else if (props.userStatus === "OFFLINE")
            return ({backgroundColor:"#FF0000"})
        else if (props.userStatus === "INGAME")
            return ({backgroundColor: '#FFC600'})
    }

    function selectStatusText()
    {
        if (props.userStatus === "ONLINE")
            return ("On line")
        else if (props.userStatus === "OFFLINE")
            return ("Disconnected")
        else if (props.userStatus === "INGAME") 
        return ("In game")
    }

    async function loadProfilePicture()
    {
        const res = await getUserProfilePictrue(props.id);
        if (res.status === 200 && res.statusText === "OK")
        {
            setUserImg(window.URL.createObjectURL(new Blob([res.data])))
        }
        else
            console.log("Err request friend element => ", res);
    }

    React.useEffect(() => {
        loadProfilePicture();
    }, [])


    return (
        <Link to={`/chat/friends/${props.username}`}
            className="friend"
            style={props.selected ? {backgroundColor:'#F4F4F4'} : null}
            onClick={() => props.click(props)}
        >

            <div className="infos-div" >
                <div className='friend-image-container'>
                    <img className="friend-image" src={userIg} />
                </div>
                <div
                    className="firend-icon-status"
                    style={selectStatusDiv()}
                />
                <div className="friend-infos">
                    <p className="username" >{props.username}</p>
                    <p className="friend-status">
                        {selectStatusText()}
                    </p>
                </div>
            </div>   
                {
                    props.addUser ? 
                    <AddIcon /> : null
                }

        </Link>
    )
}