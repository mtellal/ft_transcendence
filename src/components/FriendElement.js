import './Friends.css'

import img from '../images/user.png'

export default function FriendElement(props)
{
    return (
        <div
            className={`friend ${props.className ? `friend-${props.className}` : null}` }
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

        </div>
    )
}