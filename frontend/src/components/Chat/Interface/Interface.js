import React, { useEffect } from "react";

import Profile from "./Profile";

import './Interface.css'
import { useLoaderData } from "react-router-dom";
import { currentUser } from "../../../exampleDatas";

import ProfileGroup from "./ProfileChannel";


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

    function isAdmin()
    {
        return (props.administrators.find(username => username === props.author));
    }

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
            <div className="message-infos">
               <p className="message"
                    style={addStyle()}
                >
                {props.message}
                </p>
                {props.group && <p className="message-author">{props.author}</p>}
            </div>
            {
                props.group && isAdmin() && <span className="material-symbols-outlined">
                    shield_person
                </span>
            }
        </div>
    )
}



function Banner({user, channel, ...props}) {

    function selectStatusDiv() {

        if (props.status)
        {
            if (props.status === "onLine")
                return ({ color: "green" })
            else if (props.status === "disconnected")
                return ({ color: "red" })
            else if (props.status === "inGame")
                return ({ color: '#FFC600' })
        }
        else if (props.access)
        {
            if (props.access === "public")
                return ({ color: "green" })
            else if (props.access === "private")
                return ({ color: "orange" })
            else if (props.access === "private")
                return ({ color: 'black' })
        }

    }

    function selectStatusText() {
        if (props.status)
        {
            if (props.status === "onLine")
                return ("On line")
            else if (props.status === "disconnected")
                return ("Disconnected")
            else if (props.status === "inGame")
                return ("In game")
        }
        else if (props.access)
            return (props.access)
    }

    function displayMembers()
    {
        let members = "";
        props.members.map(m => members += m + ", ")
        return (members)  
    }

    return (
        <div className="banner">
            <div className="banner-div1">
                <img className="banner-pp" src={props.img} alt="profile" />
                <div className="banner-infos">

                    <p className="banner-name" >{props.name}</p>
                    <p
                        className="banner-status"
                        style={selectStatusDiv()}
                        >
                        {selectStatusText()}
                    </p>
                </div>
                { props.group && <p className="banner-members">{displayMembers()}</p>}
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


function Messenger({ item, blocked, invitation, group }) {

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
                            group={group}
                            administrators={item.administrators}
                        />
                    )
                }
            })
        )
    }


    React.useEffect(() => {
        if (item.conversation)
            setMessages(item.conversation);
        else
            setMessages([]);
        setValue("");
    }, [item])

    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [render, item, blocked, invitation])


    return (
        <>
            <div className="messages-display">
                {
                    item.conversation.length ?
                        renderMessages() : <NoMessages />
                }
                {blocked && <BlockMessage username={item.username || item.name} />}
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



function InterfaceFriend(props)
{
    return (
        <>
            {
                props.profile ? 
                <Profile item={props.item} /> :
                <Messenger 
                    item={props.item} 
                    blocked={props.blocked} 
                    invitation={props.invitation} 
                />
            }
        </>
    )
}

function InterfaceGroup(props)
{
    return (
        <>
            {
                props.profile && 
                    <ProfileGroup 
                        channel={props.item} 
                        user={props.user}
                    />
            }
            {
                !props.profile &&
                <Messenger 
                    group={props.group} 
                    item={props.item} 
                    blocked={props.blocked} 
                    invitation={props.invitation} 
                />
            }
        </>
    )
}















function getFriend(username)
{
    return (currentUser.friendList.find(friend => friend.username === username));
}

function getGroup(name)
{
    return (currentUser.channelList.find(channel => channel.name === name));
}

export function loader({params})
{
    let item;
    if (params.friendid)
        item = getFriend(params.friendid);
    else if (params.groupid)
    {
        item = getGroup(params.groupid);
    }
    return (item);
}

/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function Interface({user, group, friend}) {

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
        if (!blocked && !profile) {
            pushMessage({
                author: "me",
                type: "invitation",
                to: item.username || item.name,
                status: "valid"
            })
        }
        setRender(prev => !prev)
    }
    
    function blockUser() {
        if (!profile)
        {
            setBlocked(prev => !prev);
            item.blocked = !item.blocked;
        }
    }

    function toggleProfile()
    {
        setProfile(prev => !prev);
    }



    React.useEffect(() => {
        setBlocked(item.blocked);
        setProfile(false);
    }, [item])

    return (
        <div className="messages-container">
            <Banner
                name={item.username || item.name}
                img={item.img}
                status={item.status}
                access={item.access}
                profile={() => toggleProfile()}
                invitation={() => newInvitation()}
                block={() => blockUser()}
                group={group}
                members={item.members}
                firend={friend}
                channel={item}
                user={user}
            />
            {
                friend ? 
                <InterfaceFriend 
                    profile={profile} 
                    item={item} 
                    blocked={blocked} 
                    invitation={render} 
                /> :
                <InterfaceGroup 
                    group={group} 
                    profile={profile} 
                    item={item} 
                    blocked={blocked} 
                    invitation={render} 
                    user={user}
                />
            }
        </div>
    )
}