
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

import {
    useChannelsContext,
    useChatSocket,
    useFriendsContext,
    useCurrentUser
} from "../../../../hooks/Hooks";
import './Messenger.css'
import ProfilePicture from "../../../../components/users/ProfilePicture";
import { RawIcon } from "../../../../components/Icon";
import ResizeContainer from "../../../../components/ResizeContainer";
import useAdinistrators from "../../../../hooks/Chat/useAdministrators";
import useMembers from "../../../../hooks/Chat/useMembers";
import { ConfirmPage, ConfirmView } from "../../Profile/ChannelProfile/ConfirmAction";
import { useBlock } from "../../../../hooks/Chat/useBlock";
import { InterfaceContext } from "../../Interface/Interface";
import useFetchUsers from "../../../../hooks/useFetchUsers";

const MessengerContext: React.Context<any> = createContext(null);


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


type TUserManu = {
    user: any,
    setShowUserMenu: any
}


function UserMenu(props: TUserManu) {

    const { setAction } = useContext(InterfaceContext);
    const { blockUser, unblockUser, isUserBlocked } = useBlock();

    function profile() {
        console.log("profile");
    }

    function block() {
        setAction({ type: 'block', user: props.user, function: blockUser });
    }

    function unblock() {
        setAction({ type: 'unblock', user: props.user, function: unblockUser });
    }

    return (
        <div className="flex-column messenger-usermenu"
            style={{ zIndex: 1 }}
        >
            <div
                className="fill pointer relative flex-center messenger-usermenu-option"
                style={{ borderBottom: '1px solid black' }}
                onClick={() => { profile(); props.setShowUserMenu((p: boolean) => !p) }}
            >
                <p>profile</p>
            </div>
            {
                isUserBlocked(props.user) ?
                    <div
                        className="fill pointer flex-center relative messenger-usermenu-option"
                        onClick={() => { unblock(); props.setShowUserMenu((p: boolean) => !p) }}
                    >
                        <p>unblock</p>
                    </div>
                    :
                    <div
                        className="fill pointer flex-center relative messenger-usermenu-option"
                        onClick={() => { block(); props.setShowUserMenu((p: boolean) => !p) }}
                    >
                        <p>block</p>
                    </div>
            }
        </div>
    )
}


type TMessengerUserLabel = {
    id: number,
    user: any,
    url: string,
    username: string,
    type: string,
    owner?: boolean,
    admin?: boolean,
}

function MessengerUserLabel(props: TMessengerUserLabel) {

    const { showUserMenu, setShowUserMenu } = useContext(MessengerContext);

    return (
        <div
            className="flex-column absolute"
            style={{ bottom: '-20px', maxWidth: '30%'}}
        >
            <div>
                <ResizeContainer height="30px" width="30px"
                    className={props.type !== "WHISPER" ? "pointer" : ""}
                    onClick={() => setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
                >
                    <ProfilePicture image={props.url} />
                </ResizeContainer>
                {
                    props.type !== "WHISPER" && showUserMenu && showUserMenu.show && showUserMenu.id === props.id &&
                    <UserMenu
                        setShowUserMenu={setShowUserMenu}
                        user={props.user}
                    />
                }
            </div>
            <div
                className={`flex ${props.type !== "WHISPER" ? "pointer" : ""}`}
                style={{ alignItems: 'flex-end'}}
                onClick={() => setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
            >
                <p className="message-author" 
                style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline' }} >{props.username}</p>
                {
                    props.type !== "WHISPER" &&
                    <ResizeContainer height="20px">
                        {props.owner && <RawIcon icon="location_away" />}
                        {props.admin && <RawIcon icon="shield_person" />}
                    </ResizeContainer>
                }
            </div>
        </div>
    )
}

type TMessengerCurrentUserLabel = {
    url: string,
    username: string,
    type: string,
    owner?: boolean,
    admin?: boolean
}

function MessengerCurrentUserLabel(props: TMessengerCurrentUserLabel) {

    return (
        <div
            className="flex-column absolute"
            style={{ alignSelf: 'flex-end', bottom: '-20px', alignItems: 'flex-end',  maxWidth: '40%', overflow: 'hidden' }}
        >
            <ResizeContainer height="30px" width="30px">
                <ProfilePicture image={props.url} />
            </ResizeContainer>
            <div className="flex" style={{ alignItems: 'flex-end', paddingBottom: '2px' }}>
                {
                    props.type !== "WHISPER" &&
                    <ResizeContainer height="20px">
                        {props.owner && <RawIcon icon="location_away" />}
                        {props.admin && <RawIcon icon="shield_person" />}
                    </ResizeContainer>
                }
                <p className="message-author"
                    style={{overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70px'}} 
                >{props.username}</p>
            </div>
        </div>
    )
}


type TMessage = {
    id: number,
    content: string,
    sendBy: number,
    author: any,
    username: string,
    currentUser: any,
    type: string,
    admin: boolean,
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
                                        id={props.id}
                                        user={props.author}
                                        url={props.author && props.author.url}
                                        username={props.username}
                                        owner={props.owner}
                                        admin={props.admin}
                                        type={props.type}
                                    /> :
                                    <MessengerCurrentUserLabel
                                        url={props.author && props.author.url}
                                        username={props.username}
                                        owner={props.owner}
                                        admin={props.admin}
                                        type={props.type}
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


type TMessenger = {
    blockedFriend: boolean
}

export default function Messenger(props: TMessenger) {

    const { user } = useCurrentUser();
    const { currentChannel } = useChannelsContext();

    const [messages, setMessages] = useState([]);
    const [showUserMenu, setShowUserMenu] = useState({ show: false });

    // check if a user is in the user blockList and filter messages from block timestamp
    const filterMessages = useCallback((messages: any[], members: any[]) => {
        if (user.blockList.length) {
            messages = messages.filter((m: any) => {
                let blockObject = user.blockList.find((o: any) => o.userId === m.sendBy);
                if (!blockObject || (blockObject && new Date(m.createdAt) < new Date(blockObject.createdAt)))
                    return (m)
            })
        }
        return (messages)
    }, [currentChannel, user])


    const initMessages = useCallback(async () => {
        const members = currentChannel.users;
        let messages: any = currentChannel && currentChannel.messages;
        if (messages && messages.length && members && members.length) {
            messages = filterMessages(messages, members);
            setMessages(messages);
        }
    }, [currentChannel && currentChannel.messages, user])



    useEffect(() => {
        if (currentChannel) {
            initMessages();
        }
    }, [currentChannel.messages, user.blockList])

    return (
        <MessengerContext.Provider value={
            {
                showUserMenu,
                setShowUserMenu,
            }
        }
        >
            <MessengerConversation
                messages={messages}
                blockedFriend={props.blockedFriend}
            />
            <MessengerInput
                blockedFriend={props.blockedFriend}
            />
        </MessengerContext.Provider>
    )
}


function MessengerConversation({ messages, blockedFriend }: any) {
    const [render, setRender] = useState(false);

    const { user } = useCurrentUser();
    const { currentFriend } = useFriendsContext();

    const { currentChannel } = useChannelsContext();

    const { isUserAdministrators } = useAdinistrators();
    const { getMemberById } = useMembers();

    const { fetchUser } = useFetchUsers(); 


    let renderMessages: any = useRef(null);
    const lastMessageRef: any = React.useRef(null);


    async function rendMessages() {
        if (!messages || !messages.length) {
            renderMessages.current = <NoMessages />
            setRender((p: boolean) => !p);
        }
        else {
            let author: any;
            renderMessages.current =
                await Promise.all(messages.map(async (m: any, index: number) => {
                    author = null;
                    if ((index + 1 !== messages.length && m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1)) {
                        author = getMemberById(m.sendBy);
                        if (!author)
                            author = await fetchUser(m.sendBy);
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
                                currentUser={user}
                                type={currentChannel.type}
                                admin={author && isUserAdministrators(author)}
                                owner={currentChannel.type !== "WHISPER" && currentChannel.ownerId === m.sendBy}
                            />
                        )
                    }
                }))
            setRender((p: boolean) => !p);
        }
    }

    useEffect(() => {
        rendMessages();
    }, [messages])

    React.useEffect(() => {
        if (!blockedFriend)
            lastMessageRef.current.scrollIntoView();
    }, [currentChannel, render])

    return (
        <div className="messages-display">
            {renderMessages.current}
            {blockedFriend && <BlockMessage username={currentFriend.username || currentChannel.name} />}
            <div ref={lastMessageRef}></div>
        </div>
    )
}


function MessengerInput(props: any) {
    const { socket } = useChatSocket();
    const { currentChannel } = useChannelsContext();

    const [value, setValue] = React.useState("");

    const handleChange = useCallback((e: any) => {
        setValue(e.target.value)
    }, []);

    const canSendMessages = useCallback(() => {
        if (props.blockedFriend)
            return ("User blocked")
        return ("Write your message")
    }, []);

    const submit = useCallback((e: any) => {
        if (e.key === "Enter" && value && !props.blockedFriend && currentChannel && socket) {
            socket.emit('message', {
                channelId: currentChannel.id,
                content: value
            })
            setValue("")
        }
    }, [value, currentChannel, socket])


    return (
        <div className="messages-input"
        >
            <input
                className="messenger-input"
                value={value}
                onChange={handleChange}
                placeholder={canSendMessages()}
                onKeyDown={submit}
                disabled={props.blockedFriend}
            />
        </div>
    )
}