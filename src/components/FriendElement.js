import './Friends.css'

import img from '../images/user.png'
import { Link } from 'react-router-dom'

export default function FriendElement(props)
{
    return (
        <Link to={`/chat/${props.username}`}
            className={`friend ${props.className ? `friend-${props.className}` : null}` }
            style={props.selected ? {backgroundColor:'#F4F4F4'} : null}
            onClick={() => props.click(props)}
        >

            <div className="infos-div" >
                <img className="friend-image" src={img} />
                <div
                    className="firend-icon-status"
                    style={props.connected ? {backgroundColor:"#14CA00"} : {backgroundColor:"#FF0000"} }
                />
                <div className="friend-infos">
                    <p className="username" >{props.username}</p>
                    <p className="friend-status">
                        {props.connected ? "On line" : "Disconnected" }
                    </p>
                </div>
            </div>

            {
                props.chat &&
                <div className="friend-actions">
                    <span className="material-symbols-outlined">
                        mode_comment
                    </span>
                </div>
            }    

        </Link>
    )
}