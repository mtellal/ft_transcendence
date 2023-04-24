import React from "react";

import '../styles/Chat.css'

import FriendElement from "../components/FriendElement";

import { examplesFriends, examplesGroup, exampleMessages } from "../exampleDatas";


function Message(props)
{

    return (
        <div className="message-div"
            style={props.sender === "player1" ? {justifyContent: 'right'} : null}
        >
                <p className="message" style={props.sender === "player1" ? {backgroundColor: '#FFF5DD'} : null} >{props.message}</p>
        </div>
    )
}

function MessagesElement()
{

    const lastMessageRef = React.useRef(null);
    const [value, setValue] = React.useState("");

    function handleChange(e)
    {
        console.log(e.target)
        setValue(e.target.value)
    }

    const messages = exampleMessages.map((m, index) => {
        return (
            <Message  message={m.message} sender={m.sender}/>
        )
    })

        React.useEffect(() => {
            lastMessageRef.current.scrollIntoView();
        }, [])

    return (
        <div  className="messages-container">
            <div className="messages-display">
                {messages}
            </div>
            <div ref={lastMessageRef}></div>
            <div className="messages-input">
                <textarea
                    className="input"
                    value={value}
                    onChange={handleChange}
                    placeholder="Write your message"
                    />
            </div>
        </div>
    )
}

function CollectionElement(props)
{
    return (
        <div className="collection">
            <h2 className="collection-title">{props.title}</h2>
            <div className="collection-list">
                {props.collection}
            </div>
        </div>
    )
}

function GroupElement(props)
{
    return (
        <div className="group">
            <p className="group-name">{props.name}</p>
            <p className="group-separator">-</p>
            <p className="group-members">{props.members} members</p>
        </div>
    )
}


function MenuElement(props)
{

    function handleFriendsMessage(p)
    {
        console.log(p)
    }

    const groupList = examplesGroup.map(e => 
        <GroupElement
            key={e.id}
            id={e.id}
            name={e.name}
            members={e.members}
        />
    )

    const friendsList = examplesFriends.map(e => (
        <FriendElement 
            key={e.id}
            id={e.id}
            username={e.username}
            connected={e.connected}
            chat={false}
            hover={true}
            className="chat"
            click={handleFriendsMessage}
        />
    ))

    return (
        <div className="menu-container">
            <CollectionElement
                title="Groups"
                collection={groupList}
            />
            <CollectionElement
                title="Friends"
                collection={friendsList}
            />
        </div>
    )
}


export default function Chat()
{
    return (
        <div className="chat">
            <div className="chat-container">
               <MenuElement />
                <MessagesElement />
            </div>
        </div>
    )
}