
import React, { useEffect } from "react";

import './Messenger.css'
import { getMessages } from "../../utils/User";
import userEvent from "@testing-library/user-event";

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
    const [render, setRender] = React.useState(false);
    const [messages, setMessages] : [any, any]= React.useState([]);

    async function loadMessages()
    {
        console.log(channel)
        const messagesRes = await getMessages(channel.id);
        if (messagesRes.status === 200 && messagesRes.statusText === "OK")
        {
            console.log("MESSAGES EXISTS => ", messagesRes.data);
            setMessages(messagesRes.data);
        }
        else
        {
            console.log("NO MESSAGES");
        }

        socket.on('message', (e:any) => console.log(e));
    }

    React.useEffect(() => {
        if (channel)
            loadMessages();
    }, [channel])



    function pushMessage(message : any) {
        let newMessage = {
            id: messages.length + 1,
            ...message
        }
        if (messages.length) {
            setMessages((prev: any) => ([
                ...prev,
                newMessage
            ]))
        }
        else {
            setMessages([newMessage])
        }
    }

    function handleChange(e : any) {
        setValue(e.target.value)
    }

    function newTextMessage() {
        pushMessage({
            type: "text",
            author: "me",
            message: value
        })
    }

    function sendMessage(e : any) {
        if (e.key === "Enter" && value !== "" && !blocked) {
            socket.emit('message', {
                channelId: channel.id, 
                content: value
            })
            //newTextMessage();
            setValue("")
            setRender(prev => !prev);
        }
    }

    console.log(user)

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
    }, [render, element, blocked, invitation])


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
