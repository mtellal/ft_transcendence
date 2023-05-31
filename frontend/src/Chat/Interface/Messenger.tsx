
import React, { useEffect, useState } from "react";

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

function Message(props: any) {

    function isAdmin() {
        if (props.currentChannel &&
            props.currentChannel.administrators && props.currentChannel.administrators.length) {
            return (props.currentChannel.administrators.find((id: any) => id === props.sendBy));
        }
    }

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

    return (
        <>
            {
                props.type === "NOTIF" ?
                    <MessageNotification content={props.content} />
                    :
                    <div className="message-div"
                        style={props.sendBy === props.userId ? { justifyContent: 'right', flexDirection: 'row-reverse' } : {}}
                    >
                        <div className="message-resize-pp">
                            {props.author && <ProfilePicture image={pickProfilePicture()} />}
                        </div>

                        <div className="message-infos">

                            <div className="flex-center">
                                {
                                    isAdmin() &&
                                    <div className="admin-icon">
                                        <span className="material-symbols-outlined">
                                            shield_person
                                        </span>
                                    </div>
                                }
                                <p className="message" style={addStyle()} >
                                    {props.content}
                                </p>
                            </div>

                            <p className="message-author" style={props.userId === props.sendBy ? { textAlign: 'right' } : {}}>{pickName()}</p>

                        </div>
                    </div>
            }
        </>
    )
}


function MessageNotification(props: any) {
    return (
        <div className="flex-center" >
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

    function submit(e: any) {
        if (e.key === "Enter" && value !== "" && !blocked && currentChannel) {
            socket.emit('message', {
                channelId: currentChannel.id,
                content: value
            })
            setValue("")
        }
    }

    useEffect(() => {
        setRenderMessages([]);
        if (currentChannel) {

            const members = getMembers(currentChannel.id);

            let block: any;
            let messages: any = currentChannel && currentChannel.messages;
            if (messages && messages.length && members) {
                if (currentChannel.type === "WHISPER" &&
                    user.blockedList.length &&
                    (block = user.blockedList.find((o: any) => o.blockedId === currentFriend.id))) {
                    messages = currentChannel.messages.filter((m: any) => m.createdAt < block.createdAt)
                }

                let author: any;
                messages = messages.map((m: any, index : number) => {
                    if ((index + 1 !== messages.length && m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1))
                        author = members.find((u: any) => u.id === m.sendBy)
                    else 
                        author = null
                    return (
                        <Message
                            key={m.id}
                            id={m.id}
                            content={m.content}
                            sendBy={m.sendBy}
                            type={m.type}
                            author={author}
                            userId={user.id}
                            userImage={image}
                            currentUsername={user.username}
                            currentChannel={currentChannel}
                        />
                    )
                })

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
