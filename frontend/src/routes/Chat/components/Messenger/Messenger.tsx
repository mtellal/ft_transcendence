
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
import { useChannels } from "../../../../hooks/Chat/useChannels";

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
    author: any,
    id: number,
    owner?: boolean,
}

function MessengerUserLabel(props: TMessengerUserLabel) {

    const { showUserMenu, setShowUserMenu } = useContext(MessengerContext);
    const { currentChannel } = useChannelsContext();

    const [type, setType] = useState(currentChannel && currentChannel.type);

    const { isUserAdministrators } = useAdinistrators();

    return (
        <div
            className="flex-column absolute"
            style={{ bottom: '-20px', maxWidth: '30%' }}
        >
            <div>
                <ResizeContainer height="30px" width="30px"
                    className={type !== "WHISPER" ? "pointer" : ""}
                    onClick={() => setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
                >
                    <ProfilePicture image={props.author.url} />
                </ResizeContainer>
                {
                    type !== "WHISPER" &&
                    showUserMenu && showUserMenu.show && showUserMenu.id === props.id &&
                    <UserMenu
                        setShowUserMenu={setShowUserMenu}
                        user={props.author}
                    />
                }
            </div>
            <div
                className={`flex ${type !== "WHISPER" ? "pointer" : ""}`}
                style={{ alignItems: 'flex-end' }}
                onClick={() => setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
            >
                <p className="message-author"
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: 'underline' }} >{props.author.username}</p>
                {
                    type !== "WHISPER" &&
                    <ResizeContainer height="20px">
                        {
                            currentChannel.type !== "WHISPER" &&
                            currentChannel.ownerId === props.author.id &&
                            <RawIcon icon="location_away" />
                        }
                        {isUserAdministrators(props.author) && <RawIcon icon="shield_person" />}
                    </ResizeContainer>
                }
            </div>
        </div>
    )
}

type TMessengerCurrentUserLabel = {
    author: any,
    owner?: boolean,
}

function MessengerCurrentUserLabel(props: TMessengerCurrentUserLabel) {

    const { currentChannel } = useChannelsContext();
    const { isUserAdministrators } = useAdinistrators();

    return (
        <div
            className="flex-column absolute"
            style={{ alignSelf: 'flex-end', bottom: '-20px', alignItems: 'flex-end', maxWidth: '40%', overflow: 'hidden' }}
        >
            <ResizeContainer height="30px" width="30px">
                <ProfilePicture image={props.author.url} />
            </ResizeContainer>
            <div className="flex" style={{ alignItems: 'flex-end', paddingBottom: '2px' }}>
                {
                    currentChannel && currentChannel.type !== "WHISPER" &&
                    <ResizeContainer height="20px">
                        {
                            currentChannel.type !== "WHISPER" &&
                            currentChannel.ownerId === props.author.id &&
                            <RawIcon icon="location_away" />
                        }
                        {isUserAdministrators(props.author) && <RawIcon icon="shield_person" />}
                    </ResizeContainer>
                }
                <p className="message-author"
                    style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70px' }}
                >{props.author.username}</p>
            </div>
        </div>
    )
}


type TMessage = {
    id: number,
    content: string,
    sendBy: number,

    displayUser: boolean,

    owner: boolean
}


function Message(props: TMessage) {

    const { user } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
    const { getMemberById } = useMembers();

    const [author, setAuthor]: any = useState();

    useEffect(() => {
        if (props.displayUser) {
            let _author = getMemberById(props.sendBy);
            if (_author)
                setAuthor(_author);
            else {
                _author = fetchUser(props.sendBy);
                if (_author)
                    setAuthor(_author);
            }

        }
        else
            setAuthor(null)
    }, [props.displayUser])

    function addStyle() {
        if (user && props.sendBy === user.id)
            return ({ backgroundColor: '#FFF5DD' });
    }

    const pickMessageStyle = useCallback(() => {
        let style = {};
        if (author)
            style = { marginBottom: '30px' }
        if (user && props.sendBy === user.id)
            style = { ...style, justifyContent: 'right', flexDirection: 'rowreverse' }
        return (style)
    }, [author]);

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
                        author &&
                        <>
                            {
                                user && user.id !== props.sendBy ?
                                    <MessengerUserLabel
                                        id={props.id}
                                        author={author}
                                        owner={props.owner}
                                    /> :
                                    <MessengerCurrentUserLabel
                                        author={author}
                                        owner={props.owner}
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
        let messages: any = currentChannel.messages;
        if (messages && messages.length && members && members.length) {
            messages = filterMessages(messages, members);
            setMessages(messages);
        }
    }, [currentChannel.messages, user])



    useEffect(() => {
        if (currentChannel.messages) {
            initMessages();
        }
        else
            setMessages([]);
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
    const { currentFriend } = useFriendsContext();
    const { currentChannel } = useChannelsContext();
    
    const [render, setRender] = useState(false);

    let renderMessages: any = useRef(null);
    const lastMessageRef: any = React.useRef(null);



    const rendMessages = useCallback(async () => {
        console.log("render messages called")
        if (!messages.length) {
            setRender((p: boolean) => !p);
            renderMessages.current = <NoMessages />
        }
        else {
            setRender((p: boolean) => !p);
            let displayUser: boolean;
            renderMessages.current =
                messages.map((m: any, index: number) => {
                    displayUser = false;
                    if ((index + 1 !== messages.length && m.sendBy !== messages[index + 1].sendBy) || (index === messages.length - 1)) {
                        displayUser = true;
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
                                displayUser={displayUser}
                                owner={currentChannel.type !== "WHISPER" && currentChannel.ownerId === m.sendBy}
                            />
                        )
                    }
                })
        }
    }, [messages]);

    useEffect(() => {
        rendMessages();
    }, [messages])


    React.useEffect(() => {
        if (!blockedFriend)
            lastMessageRef.current.scrollIntoView();
    }, [currentChannel, render])

    console.log("render Messages => ", renderMessages.current, messages)

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