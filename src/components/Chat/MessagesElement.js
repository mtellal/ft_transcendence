import React, { useEffect } from "react";

import './MessagesElement.css'

function Message(props)
{
    function addStyle()
    {
        let obj;

        if (props.author === "me")
            obj = {backgroundColor: '#FFF5DD'};
        return (obj);
    }

    return (
        <div className="message-div"
            style={props.author === "me" ? {justifyContent: 'right'} : null}
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

export default function MessagesElement({item})
{
    const lastMessageRef = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [toggle, setToggle] = React.useState(false);
    const [messages, setMessages] = React.useState([]);

    function handleChange(e)
    {
        setValue(e.target.value)
    }

    function submitMessage()
    {
        if (value.length && messages.length)
        {
            let newMessage = {
                    id: messages.length ? messages.length + 1 : 0,
                    author: "me",
                    message: value
            }
            if (messages.length)
            {
                setMessages(prev => ([
                    ...prev, 
                    newMessage
                ]))
            }
            else
            {
                setMessages([ newMessage ])
            }
        }
        setValue("");
        setToggle(prev => !prev)
    }

    function handleKeys(e)
    {
        if (e.key === "Enter")
        {
            submitMessage();
        }
    }

    function noMessages()
    {
        return (
            <div className="no-messages-div">
                <p key={0} className="no-messages">
                    No messages
                </p>
            </div>
        )
    }

    function renderMessages()
    {
        if (messages.length)
        {
            console.log(messages)
            return (messages.map((m, index) => {
                return (
                    <Message 
                        key={m.id}
                        id={m.id}
                        message={m.message} 
                        author={m.author}
                    />
                )
                }));
        }
        else
            return (noMessages());
    }

    useEffect(() => {
        if (item && item.messages)
            setMessages(item.messages);
        else 
            setMessages([]);
    }, [item])
    

    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [toggle, messages])

    return (
        <div  className="messages-container">
            <div className="messages-display">
                {renderMessages()}
                <div ref={lastMessageRef}></div>
            </div>
            <div className="messages-input"
                style={messages.length ? null : {padding: '0', border:'none'}}
            >
                {
                    messages.length? 
                    <input
                        className="input"
                        value={value}
                        onChange={handleChange}
                        placeholder="Write your message"
                        onKeyDown={handleKeys}
                    /> :
                    null
                }
            </div>
        </div>
    )
}