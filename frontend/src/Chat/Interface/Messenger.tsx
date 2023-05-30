
import React, { useEffect, useState } from "react";

import {
    useChannels,
    useChannelsUsers,
    useChatSocket,
    useFriends,
    useUser
} from "../../Hooks";
import './Messenger.css'

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
        if (props.currentChannel) {
            return (props.currentChannel.administrators.find((id: any) => id === props.sendBy));
        }
    }

    function addStyle() {
        if (props.sendBy === props.userId)
            return ({ backgroundColor: '#FFF5DD' });
    }

    return (
        <div className="message-div"
            style={props.sendBy === props.userId ? { justifyContent: 'right' } : {}}
        >
            <div className="message-infos">
                <p className="message"
                    style={addStyle()}
                >
                    {props.message.content}
                </p>
                {props.group && <p className="message-author">{props.author}</p>}
            </div>
            {
                props.group && isAdmin() &&
                <span className="material-symbols-outlined">
                    shield_person
                </span>
            }
        </div>
    )
}


export default function Messenger({
    blocked,
    invitation,
}: any) {

    const { user } = useUser();
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
            console.log(members)

            let block: any;
            let messages: any = currentChannel && currentChannel.messages;
            if (messages && messages.length && members) {
                if (currentChannel.type === "WHISPER" &&
                    user.blockedList.length &&
                    (block = user.blockedList.find((o: any) => o.blockedId === currentFriend.id))) {
                    messages = currentChannel.messages.filter((m: any) => m.createdAt < block.createdAt)
                }
                setRenderMessages(
                    messages.map((m: any) =>
                        <Message
                            key={m.id}
                            message={m}
                            id={m.id}
                            sendBy={m.sendBy}
                            author={members.map((u : any) => u.id === m.sendBy ? u.username : "")}
                            userId={user.id}
                            currentChannel={currentChannel}
                            group={currentChannel && currentChannel.type !== "WHISPER"}
                            administrators={null}
                        />
                    )
                )
            }
        }
    }, [channels, currentChannel, channelsUsers, user])


    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [currentChannel, blocked, invitation, renderMessages])

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
