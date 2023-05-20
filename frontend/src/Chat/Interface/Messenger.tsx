
import React, { useEffect } from "react";

import './Messenger.css'
import { getChannelByIDs, getMessages } from "../../utils/User";
import userEvent from "@testing-library/user-event";
import { measureMemory } from "vm";
import { ElementFlags } from "typescript";
import { currentUser } from "../../exampleDatas";

function BlockMessage({ username } : any) {
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

function GameInvitation(props : any) {
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

function Message(props : any) {

    function isAdmin()
    {
        return (props.administrators.find((username : any) => username === props.author));
    }

    function addStyle() {
        let obj;

        if (props.author === props.userId)
            obj = { backgroundColor: '#FFF5DD' };
        return (obj);
    }

    return (
        <div className="message-div"
            style={props.author === props.userId ? { justifyContent: 'right' } : {}}
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


export default function Messenger({ user, element, channel, socket, blocked, invitation, group } : any) {

    const lastMessageRef : any = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [messages, setMessages] : [any, any] = React.useState([]);

    React.useEffect(() => {

        socket.on('message',(e : any) => {
            if (e.length)
            {
                console.log("array msg");        
                setMessages([...e])
            }
            else if (e.content)
            {
                console.log("unique obj mesg")    
                if (e.channelId === channel.id)
                setMessages((prev:any) => [...prev, e])
            }
        });

        return () => {
                console.log("messages = []")
                setMessages([]);
        }
    }, [])


    React.useEffect(() => {
        if (channel)
        {
            console.log("join channel ", channel.id)
            socket.emit('joinChannel', {
                channelId: channel.id,
            })
        }
        return () => {
            setMessages([]);
        }
    }, [channel])

    function handleChange(e : any) {
        setValue(e.target.value)
    }

    function sendMessage(e : any) {
        if (e.key === "Enter" && value !== "" && !blocked) {
            socket.emit('message', {
                channelId: channel.id, 
                content: value
            })
            setValue("")
        }
    }

    function renderMessages() {
        return (
            messages.map((m : any) => 
                <Message
                    key={m.id}
                    id={m.id}
                    message={m.content}
                    author={m.sendBy}
                    userId={user.id}
                    group={null}
                    administrators={null}
                />
            )
        );
    }

    /* React.useEffect(() => {
        if (item.conversation)
            setMessages(item.conversation);
        else
            setMessages([]);
        setValue("");
    }, [element]) */

    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [element, blocked, invitation, messages])


    return (
        <>
            <div className="messages-display">
                {
                    messages.length ?
                        renderMessages() : <NoMessages />
                }
                {blocked && <BlockMessage username={element.username || element.name} />}
                <div ref={lastMessageRef}></div>
            </div>
            <div className="messages-input"
            >
                <input
                    className="messenger-input"
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
