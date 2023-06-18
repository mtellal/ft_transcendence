import React, { useCallback, useEffect, useRef, useState } from "react";
 
import { useChannelsContext } from "../../../hooks/Hooks";
import useMembers from "../../../hooks/Chat/useMembers";
import useFetchUsers from "../../../hooks/useFetchUsers";

import Message from "./Message";
import './Messenger.css'


function MessageNotification(props: any) {
    return (
        <div className="flex-center gray-c message-notification" >
            {props.content}
        </div>
    )
}

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
            <p className="no-messages">
                No messages
            </p>
        </div>
    )
}



export default function MessengerConversation({ messages, blockedFriend, hidden, whisperUser }: any) {
    
    const { fetchUser } = useFetchUsers();
    const { currentChannel } = useChannelsContext();
    const { getMemberById, isUserIdMember } = useMembers();

    const [authors, setAuthors]: any = useState([]);
    const messagesContainerRef = useRef(null);


    async function loadAuthors(messages: any[]) {
        let users: any[] = [];
        let ids: number[] = [];
        await Promise.all(
            messages.map(async (m: any, index: number) => {
                if ((index + 1 !== messages.length &&
                    m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1)) {
                    if (!ids.length || !ids.find((id: number) => id === m.sendBy)) {
                        ids = [...ids, m.sendBy];
                        if (!isUserIdMember(m.sendBy)) {
                            users.push(await fetchUser(m.sendBy));
                        }
                        else {
                            users.push(getMemberById(m.sendBy));
                        }
                    }
                }
            }))
        users = users.filter(u => u);
        setAuthors(users);
    }

    useEffect(() => {
        if (messages && messages.length && currentChannel) {
            loadAuthors(messages);
        }
        else {
            setAuthors([]);
        }
    }, [messages, currentChannel])


    const rendMessages = useCallback(() => {
        if (messages.length) {
            let displayUser: boolean;
            let _author: any;
            return (
                messages.map((m: any, index: number) => {
                    _author = null;
                    displayUser = false;
                    if ((index + 1 !== messages.length && m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1)) {
                        displayUser = true;
                        _author = authors.find((u: any) => u.id === m.sendBy)
                    }

                    if (m.type === "NOTIF")
                        return (<MessageNotification key={m.id} content={m.content} />)
                    else if (m.type !== "NOTIF") {

                        return (
                            <Message
                                lastMessage={index + 1 === messages.length}
                                key={m.id}
                                id={m.id}
                                content={m.content}
                                sendBy={m.sendBy}
                                author={_author}
                                displayUser={displayUser}
                                owner={currentChannel.type !== "WHISPER" && currentChannel.ownerId === m.sendBy}
                            />
                        )
                    }
                }));
        }
    }, [messages, authors]);

    useEffect(() => {
        if (messagesContainerRef) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [messagesContainerRef, authors, hidden])

    return (
        <div className={hidden ? "messages-display hidden" : "messages-display visible"} ref={messagesContainerRef}>
            {
                !messages.length || !authors.length ?
                    <NoMessages />
                    :
                    rendMessages()
            }
            {
                blockedFriend && currentChannel && currentChannel.type === "WHISPER" &&
                <BlockMessage username={whisperUser.username || currentChannel.name} />
            }
        </div>
    )
}

