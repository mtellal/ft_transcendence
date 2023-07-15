import React, { useCallback, useEffect, useRef, useState } from "react";

import { useChannelsContext, useCurrentUser } from "../../../hooks/Hooks";
import useMembers from "../../../hooks/Chat/useMembers";
import useFetchUsers from "../../../hooks/useFetchUsers";

import Message from "./Message";
import './Messenger.css'
import { useInvitation } from "../../../hooks/Chat/useInvitation";
import { Channel, Message as TMessage, User } from "../../../types";

import ligntningIcon from '../../../assets/lightning.svg'
import gameIcon from '../../../assets/Gamepad.svg'


import './MessengerConversation.css'

function MessageNotification({ content }: any) {
    return (
        <div className="flex-center gray-c message-notification" >
            {content}
        </div>
    )
}

function BlockMessage({ username }: any) {
    return (
        <div className="flex-center sticky-bot">
            <p className="flex-center reset-m">
                You have blocked
                <span className="friend-block">{username}</span></p>
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


type TInvitationMessage = {
    message: any,
    author: User
}

function InvitationMessage(props: TInvitationMessage) {

    const { user } = useCurrentUser();
    const { acceptInvitation } = useInvitation();
    const [accepted, setAccepted] = useState(props.message && props.message.acceptedBy);

    return (
        <div className="flex-center">
            <div className="invitationmessage-label" >
                <img src={gameIcon} style={{ height: '25px' }} />
                <div className="fill flex-center">
                    {
                        props.author && props.message &&
                        <p
                            className="reset"
                            style={{ paddingRight: '10px' }}
                        >
                            {props.author.username} sends a game invitation in {props.message.gametype}
                        </p>

                    }
                    {
                        props.message &&
                        !accepted && user &&
                        props.message.sendBy !== user.id &&
                        <button
                            className="invitationmessage-button"
                            onClick={() => {
                                acceptInvitation(props.message.id);
                                setAccepted(true);
                            }}
                        >
                            Join
                        </button>
                    }
                </div>
                <img src={ligntningIcon} style={{ height: '25px' }} />
            </div>
        </div>
    )
}


type TMessengerConversation = {
    messages: TMessage[],
    whisperUser: User,
    channel: Channel
    blockedFriend: boolean,
    hidden: boolean,
}


export default function MessengerConversation({
    messages,
    whisperUser,
    channel,
    blockedFriend,
    hidden
}: TMessengerConversation) {

    const { fetchUser } = useFetchUsers();
    const { getMemberById, getMembersById, isUserIdMember } = useMembers(channel);
    const [authors, setAuthors]: any = useState([]);
    const messagesContainerRef = useRef(null);

    async function loadAuthors(messages: TMessage[], membersId: number[]) {
        let users: User[] = getMembersById(membersId);
        let ids: number[] = membersId;
        await Promise.all(
            messages.map(async (m: TMessage, index: number) => {
                if ((index + 1 !== messages.length &&
                    m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1) || (m.type === "INVITE")) {
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
        if (users && users.length)
            users = users.filter(u => u);
        setAuthors(users);
    }

    useEffect(() => {
        if (messages && messages.length && channel && channel.members) {
            loadAuthors(messages, channel.members);
        }
        else {
            setAuthors([]);
        }
    }, [messages, channel])

    const rendMessages = useCallback(() => {
        if (messages.length) {
            let displayUser: boolean;
            let _author: User;
            return (
                messages.map((m: TMessage, index: number) => {
                    _author = null;
                    displayUser = false;
                    if ((index + 1 !== messages.length && m.sendBy !== messages[index + 1].sendBy) ||
                        (index === messages.length - 1) || (m.type === "INVITE")) {
                        displayUser = true;
                        _author = authors.find((u: User) => u.id === m.sendBy)
                    }

                    if (m.type === "NOTIF")
                        return (<MessageNotification key={m.id} content={m.content} />)
                    else if (m.type === "INVITE")
                        return (<InvitationMessage key={m.id} author={_author} message={m} />)
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
                                owner={channel.type !== "WHISPER" && channel.ownerId === m.sendBy}
                                channel={channel}
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
        <div
            style={{ paddingBottom: '70px' }}
            className={hidden ? "messages-display hidden " : "messages-display visible"}
            ref={messagesContainerRef}
        >
            {
                !messages.length || !authors.length ?
                    <NoMessages /> : rendMessages()
            }
            {
                blockedFriend && channel && channel.type === "WHISPER" &&
                <BlockMessage username={whisperUser.username || channel.name} />
            }
        </div>
    )
}

