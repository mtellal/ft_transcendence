
import React, { useCallback, useEffect, useState } from "react";

import {
    useChannels,
    useChannelsUsers,
    useChatSocket,
    useFriends,
    useUser
} from "../../Hooks";
import './Messenger.css'
import ProfilePicture from "../../Components/ProfilePicture";

function BlockMessage({ username }: any) {
    return (
        <div className="flex-center sticky-bot">
            <p className="flex-center reset-m">You have blocked <span className="friend-block">{username}</span></p>
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

function GameInvitation(props: any) {
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

function MessageDisplay(props: any) {

    return (
        <div>
            {
                props.type === "NOTIF" && 
                    <MessageNotification content={props.content} />
            }        
            {
                props.type !== "NOTIF" && props.type !== "INVITATION" && 
                <Message {...props} />
            }
        </div>
    )
}


function Message(props: any) {
    function addStyle() {
        if (props.sendBy === props.userId)
            return ({ backgroundColor: '#FFF5DD' });
    }

    function pickProfilePicture() {
        if (props.sendBy === props.userId)
            return (props.userImage)
        else if (props.author)
            return (props.author.url)
    }

    function pickName() {
        if (props.sendBy === props.userId)
            return (props.currentUsername)
        else if (props.author)
            return (props.author.username)
    }

    function pickMessageStyle() {
        let style = {};
        if (props.author)
            style = { marginBottom: '15px' }
        if (props.sendBy === props.userId)
            style = { ...style, justifyContent: 'right', flexDirection: 'row-reverse' }
        return (style)
    }

    return (
        <div>

            <div className="message-div"
                style={pickMessageStyle()}
            >
                <div className="message-resize-pp">
                    {props.author && <ProfilePicture image={pickProfilePicture()} />}
                </div>

                <div className="message-infos">

                    <div className="flex-center" style={{ justifyContent: 'flex-end' }}>
                        <p className="message" style={addStyle()} >
                            {props.content}
                        </p>
                    </div>

                    {
                        props.author ?

                            <div
                                className="flex-center"
                                style={
                                    props.sendBy === props.userId ?
                                        { justifyContent: 'flex-end' } : { justifyContent: 'flex-end', flexDirection: 'row-reverse' }
                                }
                            >
                                {
                                    props.ownerId && <span className="material-symbols-outlined">
                                        location_away
                                    </span>
                                }
                                {
                                    props.admin && <span className="material-symbols-outlined">
                                        shield_person
                                    </span>
                                }
                                <p className="message-author" style={props.userId === props.sendBy ? { textAlign: 'right' } : {}}>{pickName()}</p>
                            </div>

                            : null
                    }
                </div>
            </div>
        </div>
    )
}

function MessageNotification(props: any) {
    return (
        <div className="flex-center gray-c message-notification" >
            {props.content}
        </div>
    )
}


export default function Messenger({
    blocked,
}: any) {

    const { user, image } = useUser();
    const { socket } = useChatSocket();
    const lastMessageRef: any = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [renderMessages, setRenderMessages]: any = useState([]);

    const { currentChannel, channels } = useChannels();
    const { currentFriend, friends } = useFriends();
    const { getMembers, channelsUsers } = useChannelsUsers();

    function handleChange(e: any) {
        setValue(e.target.value)
    }

    const submit = useCallback((e : any) => {
        if (e.key === "Enter" && value !== "" && !blocked && currentChannel && socket) {
            console.log("message send", currentChannel, currentChannel.id)
            socket.emit('message', {
                channelId: currentChannel.id,
                content: value
            })
            setValue("")
        }
    }, [value, currentChannel, socket])


    // check if a user is in the user blockedList and filter messages from block timestamp
    function filterMessages(messages: any[]) {
        let blockObj: any;
        if (currentChannel.type === "WHISPER" && user.blockedList.length &&
            (blockObj = user.blockedList.find((o: any) => o.blockedId === currentFriend.id))) {
            messages = currentChannel.messages.filter((m: any) => m.createdAt < blockObj.createdAt)
        }
        return (messages)
    }

    function formatMessages(messages: any[], members: any[]) {
        let author: any;
        let admin: boolean;
        messages = messages.map((m: any, index: number) => {
            admin = false;
            author = null;
            if ((index + 1 !== messages.length && m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1)) {
                if (m.sendBy === user.id)
                    author = user;
                else
                    author = members.find((u: any) => u.id === m.sendBy)
            }
            if (author && currentChannel.type !== "WHISPER" &&
                currentChannel.administrators.find((id: number) => id === author.id))
                admin = true;

            return (
                <MessageDisplay
                    key={m.id}
                    id={m.id}
                    content={m.content}
                    sendBy={m.sendBy}
                    type={m.type}
                    author={author}
                    admin={admin}
                    userId={user.id}
                    userImage={image}
                    currentUsername={user.username}
                    currentChannel={currentChannel}
                    ownerId={currentChannel.type !== "WHISPER" && currentChannel.ownerId === m.sendBy}
                />
            )
        })
        return (messages)
    }

    useEffect(() => {
        setRenderMessages([]);
        if (currentChannel) {
            console.log("currentChannel updated")
            const members = getMembers(currentChannel.id);
            console.log("members => ", members);
            let messages: any = currentChannel && currentChannel.messages;
            if (messages && messages.length && members && members.length) {
                console.log("render messagse")
                messages = filterMessages(messages);
                messages = formatMessages(messages, members)
                setRenderMessages(messages)
            }
        }
    }, [channels, currentChannel, channelsUsers, user])


    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [currentChannel, blocked, renderMessages])

    return (
        <>
            <div className="messages-display">
                {
                    renderMessages.length ?
                        renderMessages : <NoMessages />
                }
                {blocked && <BlockMessage username={currentFriend.username || currentChannel.name} />}
                <div ref={lastMessageRef}></div>
            </div>
            <div className="messages-input"
            >
                <input
                    className="messenger-input"
                    value={value}
                    onChange={handleChange}
                    placeholder={blocked ? "User blocked" : "Write your message"}
                    onKeyDown={submit}
                    disabled={blocked}
                />
            </div>
        </>
    )
}
