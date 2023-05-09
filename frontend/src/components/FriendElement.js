import './FriendElement.css'

import img from '../assets/user.png'
import { Link } from 'react-router-dom'

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

export default function FriendElement(props)
{
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

    return (
        <Link to={`/chat/friends/${props.username}`}
            className="friend"
            style={props.selected ? {backgroundColor:'#F4F4F4'} : null}
            onClick={() => props.click(props)}
        >

            <div className="infos-div" >
                <img className="friend-image" src={img} />
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

        </Link>
    )
}