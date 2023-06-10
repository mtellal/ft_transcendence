
import React, { useCallback, useEffect, useState } from "react";

import {
    useChannelsContext,
    useChatSocket,
    useFriends,
    useCurrentUser
} from "../../../../hooks/Hooks";
import './Messenger.css'
import ProfilePicture from "../../../../components/users/ProfilePicture";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import useMuteUser from "../../../../hooks/Chat/useMuteUser";
import { RawIcon } from "../../../../components/Icon";
import ResizeContainer from "../../../../components/ResizeContainer";
import useAdinistrators from "../../../../hooks/Chat/useAdministrators";
import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import useMembers from "../../../../hooks/Chat/useMembers";

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

type TMessengerUserLabel = {
    url: string,
    username: string,
    owner?: boolean,
    admin?: boolean
}

function MessengerUserLabel(props: TMessengerUserLabel) {
    return (
        <div className="flex-column absolute" style={{ bottom: '-20px' }}>
            <ResizeContainer height="30px" width="30px">
                <ProfilePicture image={props.url} />
            </ResizeContainer>
            <div className="flex" style={{ alignItems: 'flex-end' }}>
                <p className="message-author">{props.username}</p>
                <ResizeContainer height="20px">
                    {props.owner && <RawIcon icon="location_away" />}
                    {props.admin && <RawIcon icon="shield_person" />}
                </ResizeContainer>
            </div>
        </div>
    )
}

type TMessengerCurrentUserLabel = {
    url: string,
    username: string,
    owner?: boolean,
    admin?: boolean
}

function MessengerCurrentUserLabel(props: TMessengerCurrentUserLabel) {
    return (
        <div className="flex-column absolute" style={{ alignSelf: 'flex-end', bottom: '-20px', alignItems: 'flex-end' }} >
            <ResizeContainer height="30px" width="30px">
                <ProfilePicture image={props.url} />
            </ResizeContainer>
            <div className="flex" style={{ alignItems: 'flex-end' }}>
                <ResizeContainer height="20px">
                    {props.owner && <RawIcon icon="location_away" />}
                    {props.admin && <RawIcon icon="shield_person" />}
                </ResizeContainer>
                <p className="message-author">{props.username}</p>
            </div>
        </div>
    )
}


type TMessage = {
    id: number, 
    content: string, 
    sendBy: number,
    author: any,
    username:string, 
    currentUser: any,
    admin:boolean, 
    owner: boolean
}


function Message(props: TMessage) {

    function addStyle() {
        if (props.currentUser && props.sendBy === props.currentUser.id)
            return ({ backgroundColor: '#FFF5DD' });
    }

    function pickMessageStyle() {
        let style = {};
        if (props.author)
            style = { marginBottom: '30px' }
        if (props.currentUser && props.sendBy === props.currentUser.id)
            style = { ...style, justifyContent: 'right', flexDirection: 'rowreverse' }
        return (style)
    }

    return (
        <div>
            <div className="message-div relative"
                style={pickMessageStyle()}
            >
                <div className="flex-column" >
                    <div className="message-infos">
                        <p className="message" style={addStyle()} >
                            {props.content}
                        </p>
                    </div>
                    {
                        props.author &&
                        <>
                            {
                                props.currentUser && props.currentUser.id !== props.sendBy ?
                                    <MessengerUserLabel
                                        url={props.author && props.author.url}
                                        username={props.username}
                                        owner={props.owner}
                                        admin={props.admin}
                                    /> :
                                    <MessengerCurrentUserLabel
                                        url={props.author && props.author.url}
                                        username={props.username}
                                        owner={props.owner}
                                        admin={props.admin}
                                    />
                            }
                        </>
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

    const { user, image } = useCurrentUser();
    const { socket } = useChatSocket();
    const lastMessageRef: any = React.useRef(null);
    const [value, setValue] = React.useState("");
    const [renderMessages, setRenderMessages]: any = useState([]);

    const { currentChannel, channels, getMembers } = useChannelsContext();
    const { currentFriend, friends } = useFriends();
    const { fetchUser } = useFetchUsers();

    const { isUserAdministrators } = useAdinistrators();
    const { isUserAdmin, isUserOwner } = useUserAccess();

    const { getMemberById } = useMembers();

    function handleChange(e: any) {
        setValue(e.target.value)
    }

    const submit = useCallback((e: any) => {
        if (e.key === "Enter" && value && !blocked && currentChannel && socket) {
            socket.emit('message', {
                channelId: currentChannel.id,
                content: value
            })
            setValue("")
        }
    }, [value, currentChannel, socket])


    // check if a user is in the user blockedList and filter messages from block timestamp
    const filterMessages = useCallback((messages: any[]) => {
        let blockObj: any;
        if (currentChannel.type === "WHISPER" && user.blockedList.length &&
            (blockObj = user.blockedList.find((o: any) => o.blockedId === currentFriend.id))) {
            messages = currentChannel.messages.filter((m: any) => m.createdAt < blockObj.createdAt)
        }
        return (messages)
    }, [currentChannel, user])


    const formatMessages = useCallback(async (messages: any[], members: any[]) => {
        let author: any;
        messages = messages.map(async (m: any, index: number) => {
            author = null;
            if ((index + 1 !== messages.length && m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1)) {
                author = getMemberById(m.sendBy);
            }
            
            if (m.type === "NOTIF")
                return (<MessageNotification key={m.id} content={m.content} />)
            else if (m.type !== "NOTIF") {
                return (
                    <Message
                        key={m.id}
                        id={m.id}
                        content={m.content}
                        sendBy={m.sendBy}
                        author={author}
                        username={author && author.username}
                        admin={author && isUserAdministrators(author)}
                        currentUser={user}
                        owner={currentChannel.type !== "WHISPER" && currentChannel.ownerId === m.sendBy}
                    />
                )
            }
        })
        return (messages)
    }, [currentChannel && currentChannel.messages, user])


    const initMessages = useCallback(async () => {
        const members = getMembers(currentChannel.id);
        let messages: any = currentChannel && currentChannel.messages;
        if (messages && messages.length && members && members.length) {
            messages = filterMessages(messages);
            messages = await Promise.all(await formatMessages(messages, members));
            setRenderMessages(messages)
        }
    }, [currentChannel && currentChannel.messages, user])

    useEffect(() => {
        setRenderMessages([]);
        if (currentChannel) {
            initMessages();
        }
    }, [currentChannel && currentChannel.messages, user])

    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [currentChannel, blocked, renderMessages])

    function canSendMessages() {
        if (blocked)
            return ("User blocked")
        return ("Write your message")
    }

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
                    placeholder={canSendMessages()}
                    onKeyDown={submit}
                    disabled={blocked}
                />
            </div>
        </>
    )
}
