import React, { useEffect } from "react";

import Profile from "./Profile";

import './Interface.css'
import { useLoaderData } from "react-router-dom";
import { currentUser } from "../../../exampleDatas";


function BlockMessage({ username }) {
    return (
        <div className="block">
            <p className="text-block">You have blocked <span className="friend-block">{username}</span></p>
        </div>
    )
}

function NoMessages() {
    return (
        <div className="no-messages-div">
            <p key={0} className="no-messages">
                No messages
            </p>
        </div>
    )
}

/*
    style and display an invitation
*/

function GameInvitation(props) {
    return (
        <>
            {
                props.author === "me" ?
                    <div className="invitation">
                        <p className="text-invitation">You have sent an invitation to<span className="friend-invitation">{props.to}</span></p>
                    </div> :
                    <div className="invitation">
                        <p className="text-invitation">You have recieved an invitation from<span className="friend-invitation">{props.author}</span></p>
                    </div>
            }
        </>
    )
}

/*
    style and display one single message
*/

function Message(props) {
    function addStyle() {
        let obj;

        if (props.author === "me")
            obj = { backgroundColor: '#FFF5DD' };
        return (obj);
    }

    return (
        <div className="message-div"
            style={props.author === "me" ? { justifyContent: 'right' } : null}
        >
            <p
                className="message"
                style={addStyle()}
            >
                {props.message}
            </p>
        </div>
    )
}



function Banner(props) {

    function selectStatusDiv() {
        if (props.status === "onLine")
            return ({ color: "green" })
        else if (props.status === "disconnected")
            return ({ color: "red" })
        else if (props.status === "inGame")
            return ({ color: '#FFC600' })
    }

    function selectStatusText() {
        if (props.status === "onLine")
            return ("On line")
        else if (props.status === "disconnected")
            return ("Disconnected")
        else if (props.status === "inGame")
            return ("In game")
    }

    return (
        <div className="banner">
            <div className="banner-div1">
                <img className="banner-pp" src={props.img} alt="profile" />
                <p className="banner-name" >{props.name}</p>
                <p
                    className="banner-status"
                    style={selectStatusDiv()}
                >
                    {selectStatusText()}
                </p>
            </div>
            <div className="banner-div2">
                <div className="banner-icon" onClick={props.profile}>
                    <span className="material-symbols-outlined">
                        person
                    </span>
                </div>
                <div className="banner-icon" onClick={props.invitation}>
                    <span className="material-symbols-outlined">
                        sports_esports
                    </span>
                </div>
                <div className="banner-icon" onClick={props.block} >
                    <span className="material-symbols-outlined">
                        block
                    </span>
                </div>
            </div>
        </div>
    )
}


function Messenger({ item, blocked, invitation }) {

    const lastMessageRef = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [render, setRender] = React.useState(false);
    const [messages, setMessages] = React.useState([]);

    function pushMessage(message) {
        let newMessage = {
            id: messages.length + 1,
            ...message
        }
        if (messages.length) {
            setMessages(prev => ([
                ...prev,
                newMessage
            ]))
        }
        else {
            setMessages([newMessage])
        }
        item.conversation.push(newMessage);
    }

    function handleChange(e) {
        setValue(e.target.value)
    }

    function newTextMessage() {
        pushMessage({
            type: "text",
            author: "me",
            message: value
        })
    }

    function sendMessage(e) {
        if (e.key === "Enter" && value !== "" && !blocked) {
            newTextMessage();
            setValue("")
            setRender(prev => !prev);
        }
    }


    function renderMessages() {
        return (
            item.conversation.map(m => {
                if (m.type && m.type === "invitation") {
                    return (
                        <GameInvitation
                            key={m.id}
                            id={m.id}
                            author={m.author}
                            to={m.to}
                            status={m.status}
                        />
                    )
                }
                else {
                    return (
                        <Message
                            key={m.id}
                            id={m.id}
                            message={m.message}
                            author={m.author}
                        />
                    )
                }
            })
        )
    }


    React.useEffect(() => {
        console.log("update item");
        if (item.conversation)
            setMessages(item.conversation);
        else
            setMessages([]);
        setValue("");
    }, [item])

    React.useEffect(() => {
        console.log(item.conversation)
        lastMessageRef.current.scrollIntoView();
    }, [render, item, blocked, invitation])


    return (
        <>
            <div className="messages-display">
                {
                    item.conversation.length ?
                        renderMessages() : <NoMessages />
                }
                {blocked && <BlockMessage username={item.username} />}
                <div ref={lastMessageRef}></div>
            </div>
            <div className="messages-input"
            >
                <input
                    className="input"
                    value={value}
                    onChange={handleChange}
                    placeholder={blocked ? "User blocked" : "Write your message"}
                    onKeyDown={sendMessage}
                    disabled={blocked}
                />
            </div>
        </>
    )
}

function getFriend(username)
{
    return (currentUser.friendList.find(friend => friend.username === username));
}

export function loader({params})
{
    const item = getFriend(params.friendid);
    return (item);
}

/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function Interface() {

    const item = useLoaderData();

    const [render, setRender] = React.useState(false);
    const [profile, setProfile] = React.useState(false);
    const [blocked, setBlocked] = React.useState(item.blocked);

    function pushMessage(message) {
        let newMessage = {
            id: item.conversation.length + 1,
            ...message
        }
        item.conversation.push(newMessage);
    }

    function newInvitation() {
        if (!blocked) {
            pushMessage({
                author: "me",
                type: "invitation",
                to: item.username,
                status: "valid"
            })
        }
        setRender(prev => !prev)
    }
    
    function blockUser() {
        setBlocked(prev => !prev);
        item.blocked = !item.blocked;
    }

    React.useEffect(() => {
        setBlocked(false);
        setProfile(false);
    }, [item])

    return (
        <div className="messages-container">
            <Banner
                name={item.username}
                img={item.img}
                status={item.status}
                block={() => blockUser()}
                invitation={() => newInvitation()}
                profile={() => setProfile(prev => !prev)}
            />
            {
                profile ? 
                <Profile item /> :
                <Messenger item={item} blocked={blocked} invitation={render} />
            }
        </div>
    )
}