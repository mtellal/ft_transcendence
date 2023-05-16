
import React, { useEffect } from "react";

import './Messenger.css'

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

        if (props.author === "me")
            obj = { backgroundColor: '#FFF5DD' };
        return (obj);
    }

    return (
        <div className="message-div"
            style={props.author === "me" ? { justifyContent: 'right' } : {}}
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


export default function Messenger({ item, blocked, invitation, group } : any) {

    const lastMessageRef : any = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [render, setRender] = React.useState(false);
    const [messages, setMessages] : [any, any]= React.useState([]);

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
        item.conversation.push(newMessage);
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
            newTextMessage();
            setValue("")
            setRender(prev => !prev);
        }
    }


    function renderMessages() {
        return (
            item.conversation.map((m: any) => {
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
