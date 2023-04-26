import React, { useEffect } from "react";

import imgProfile from '../../images/user.png'

import './MessagesElement.css'

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

/*
    style and display an invitation
*/

function GameInvitation(props) {
    return (
        <>
            {
                props.author === "me" ?
                    <div className="block">
                        <p className="text-block">You have sent an invitation to<span className="friend-block">{props.to}</span></p>
                    </div> :
                    <div className="block">
                        <p className="text-block">You have recieved an invitation from<span className="friend-block">{props.author}</span></p>
                    </div>
            }
        </>
    )
}

function Banner(props) {

    function selectStatusDiv()
    {
        if (props.status === "onLine")
            return ({color:"gren"} )
        else if (props.status === "disconnected")
            return ({color:"red"})
        else if (props.status === "inGame")
            return ({color: '#FFC600'})
    }

    function selectStatusText()
    {
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
                <img className="banner-pp" src={imgProfile} alt="profile" />
                <p className="banner-name" >{props.name}</p>
                <p
                    className="banner-status"
                    style={selectStatusDiv()}
                >
                    {selectStatusText()}
                </p>
            </div>
            <div className="banner-div2">
                <div className="banner-icon">
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



/*
    display messages and allow user to write messages, 
    messages are updated in parent component (MessageElement)
*/

function Messages(props) {
    const lastMessageRef = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [toggle, setToggle] = React.useState(false);
    const [blocked, setBlocked] = React.useState(false);

    function handleChange(e) {
        setValue(e.target.value)
    }

    function newInvitation()
    {
        console.log("props from Messages", props);
        props.newMessage({

            author: "me",
            type: "invitation",
            to: props.name,
            status: "valid"
        })
    }

    function handleKeys(e) {
        if (e.key === "Enter" && value !== "" && !blocked) {
            let newMessage = {
                type: "text",
                author: "me",
                message: value
            }
            props.newMessage(newMessage);
            setValue("")
            setToggle(prev => !prev);
        }
    }


    function renderMessages() {
        return (
            props.messages.map(m => {
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

    function renderBlock() {
        return (
            <div className="block">
                <p className="text-block">You have blocked <span className="friend-block">{props.name}</span></p>
            </div>
        )
    }

    useEffect(() => {
        setBlocked(false);
    }, [props.name])

    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [toggle, props.messages, blocked])

    return (
        <>
            <Banner
                name={props.name}
                status={props.status}
                block={() => setBlocked(prev => !prev)}
                invitation={() => newInvitation()}
            />
            <div className="messages-display">
                {renderMessages()}
                {blocked && renderBlock()}
                <div ref={lastMessageRef}></div>
            </div>
            <div className="messages-input"
            >
                <input
                    className="input"
                    value={value}
                    onChange={handleChange}
                    placeholder="Write your message"
                    onKeyDown={handleKeys}
                />
            </div>
        </>
    )
}

/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function MessagesElement({ item }) {
    const [messages, setMessages] = React.useState([]);

    function newMessage(message) {

        console.log(message)
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


    useEffect(() => {
        if (item && item.conversation)
            setMessages(item.conversation);
        else
            setMessages([]);
    }, [item])

    return (
        <div className="messages-container">
            {
                messages.length ?

                    <Messages
                        messages={messages}
                        newMessage={newMessage}
                        name={item.username}
                        status={item.status}
                    />
                    :
                    <NoMessages />
            }
        </div>
    )
}