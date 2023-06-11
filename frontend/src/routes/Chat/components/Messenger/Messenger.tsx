
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

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
import { ConfirmPage, ConfirmView } from "../../Profile/ChannelProfile/ConfirmAction";
import { useBlock } from "../../../../hooks/Chat/useBlock";

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

type TUserManu = {
    user: any,
    setShowUserMenu: any
}


function UserMenu(props: TUserManu) {

    const { setUserAction } = useContext(MessengerContext);
    const { blockUser, unblockUser, isUserBlocked } = useBlock();

    function profile() {
        console.log("profile");
    }

    function block() {
        setUserAction({ type: 'block', user: props.user, function: blockUser });
    }

    function unblock() {
        setUserAction({ type: 'unblock', user: props.user, function: unblockUser });
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
    owner?: boolean,
    admin?: boolean,
}

function MessengerUserLabel(props: TMessengerUserLabel) {

    const { showUserMenu, setShowUserMenu } = useContext(MessengerContext);

    return (
        <div
            className="flex-column absolute"
            style={{ bottom: '-20px' }}
        >
            <div>
                <ResizeContainer height="30px" width="30px"
                    className="pointer"
                    onClick={() => setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
                >
                    <ProfilePicture image={props.url} />
                </ResizeContainer>
                {
                    showUserMenu && showUserMenu.show && showUserMenu.id === props.id &&
                    <UserMenu
                        setShowUserMenu={setShowUserMenu}
                        user={props.user}
                    />
                }
            </div>
            <div className="flex pointer" style={{ alignItems: 'flex-end' }}
                onClick={() => setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
            >
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
        <div
            className="flex-column absolute"
            style={{ alignSelf: 'flex-end', bottom: '-20px', alignItems: 'flex-end' }}
        >
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
    username: string,
    currentUser: any,
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


export default function Messenger() {

    const { user, image } = useCurrentUser();
    const { socket } = useChatSocket();

    const { currentChannel, channels, getMembers } = useChannelsContext();

    const { currentFriend, friends } = useFriends();
    const { isUserAdministrators } = useAdinistrators();
    const { getMemberById } = useMembers();

    const { isUserBlocked } = useBlock();


    const [userAction, setUserAction]: any = useState();

    const [messages, setMessages] = useState([]);


    const [showUserMenu, setShowUserMenu] = useState({ show: false });


    let rendMessages: any[] = [];


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


    const formatMessages = useCallback(async (messages: any[]) => {
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
            messages = filterMessages(messages, members);
            setMessages(messages);
        }
    }, [currentChannel && currentChannel.messages, user])



    useEffect(() => {
        if (currentChannel) {
            initMessages();
        }
    }, [currentChannel && currentChannel.messages, user, user.blockList])


    async function loadConversation() {
        rendMessages = await Promise.all(await formatMessages(messages));
    }

    useEffect(() => {
        if (messages && messages.length) {
            loadConversation();
        }
    }, [currentChannel])



    return (
        <MessengerContext.Provider value={
            {
                setUserAction,
                showUserMenu,
                setShowUserMenu,
            }
        }
        >
            <MessengerConversation 
                messages={messages} 
            />
            <MessengerInput />
            {
                userAction && userAction.user && userAction.function &&
                <ConfirmPage>
                    <ConfirmView
                        type={userAction.type}
                        username={userAction.user && userAction.user.username}
                        valid={async () => { await userAction.function(userAction.user); setUserAction(null) }}
                        cancel={() => setUserAction(null)}
                    />
                </ConfirmPage>
            }
        </MessengerContext.Provider>
    )
}


function MessengerConversation({ messages }: any) {
    const [render, setRender] = useState(false);

    const { user } = useCurrentUser();
    const { currentFriend } = useFriends();

    const { currentChannel } = useChannelsContext();

    const { isUserAdministrators } = useAdinistrators();
    const { getMemberById } = useMembers();
    const { isUserBlocked } = useBlock();


    let renderMessages: any = useRef(null);
    const lastMessageRef: any = React.useRef(null);


    async function rendMessages() {
        if (!messages) {
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
                }))
            setRender((p: boolean) => !p);
        }
    }

    useEffect(() => {
        rendMessages();
    }, [messages])


    React.useEffect(() => {
        lastMessageRef.current.scrollIntoView();
    }, [currentChannel, render])

    return (
        <div className="messages-display">

            {
                renderMessages.current
            }
            {
                isUserBlocked(currentFriend) && currentChannel.type === "WHISPER" &&
                <BlockMessage username={currentFriend.username || currentChannel.name} />
            }
            <div ref={lastMessageRef}></div>
        </div>
    )
}


function MessengerInput() {
    const { user } = useCurrentUser();
    const { socket } = useChatSocket();
    const { currentChannel } = useChannelsContext();
    const { currentFriend } = useFriends();
    const { isUserBlocked } = useBlock();

    const [value, setValue] = React.useState("");


    function handleChange(e: any) {
        setValue(e.target.value)
    }

    function canSendMessages() {
        if (isUserBlocked(currentFriend))
            return ("User blocked")
        return ("Write your message")
    }

    const submit = useCallback((e: any) => {
        if (e.key === "Enter" && value && !isUserBlocked(user) && currentChannel && socket) {
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
                disabled={isUserBlocked(currentFriend)}
            />
        </div>
    )
}