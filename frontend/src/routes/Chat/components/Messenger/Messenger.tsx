
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
import { useOutletContext } from "react-router-dom";
import userEvent from "@testing-library/user-event";

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
            <p className="no-messages">
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
/* 

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
            className="flex-column gray"
            style={{ maxWidth: '30%' }}
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
} */

type TMessengerCurrentUserLabel = {
    author: any,
    content: string
}

function MessengerCurrentUserLabel(props: TMessengerCurrentUserLabel) {

    const { currentChannel } = useChannelsContext();
    const { isUserAdministrators } = useAdinistrators();

    return (
        <div
            className=""
        >
            <div className="flex-column">

                <div className="flex" style={{ justifyContent: 'flex-end' }} >

                    <p className="message"
                        style={props.author ?
                            { marginRight: '5px' } :
                            { marginRight: '35px' }}
                    >
                        {props.content}
                    </p>
                    {
                        props.author &&
                        <ResizeContainer height="30px" width="30px">
                            <ProfilePicture image={props.author && props.author.url} />
                        </ResizeContainer>
                    }
                </div>

                <div className="flex" style={{ justifyContent: 'flex-end', alignItems: 'flex-end', paddingBottom: '2px' }}>
                    {
                        currentChannel && currentChannel.type !== "WHISPER" &&
                        <ResizeContainer height="auto">
                            {
                                currentChannel.type !== "WHISPER" && props.author &&
                                currentChannel.ownerId === props.author.id &&
                                <RawIcon icon="location_away" />
                            }
                            {props.author && isUserAdministrators(props.author) && <RawIcon icon="shield_person" />}
                        </ResizeContainer>
                    }
                    {
                        props.author &&
                        <p className="message-author"
                            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '70px' }}
                        >{props.author.username}</p>
                    }
                </div>

            </div>
        </div>
    )
}


type TMessage = {
    id: number,
    content: string,
    sendBy: number,
    lastMessage: boolean,
    displayUser: boolean,
    author: any,
    owner: boolean,
}


function Message(props: TMessage) {

    const { user } = useCurrentUser();

    return (
        <>
            {
                props.sendBy === user.id ?
                    <MessengerCurrentUserLabel
                        {...props}
                    /> :
                    <AuthorMessage
                        {...props}
                    />
            }
        </>
    )
}


type TAuthorProfilePicture = {
    author: any,
    id: number,
    type: string,
    setShowUserMenu: any,
    showUserMenu: any
}


function AuthorProfilePicture(props: TAuthorProfilePicture) {

    return (
        <div className="relative">
            <ResizeContainer height="30px" width="30px"
                className={props.type !== "WHISPER" ? "pointer" : ""}
                onClick={() => props.setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
            >
                <ProfilePicture image={props.author.url} />
            </ResizeContainer>
            {
                props.type !== "WHISPER" &&
                props.showUserMenu && props.showUserMenu.show && props.showUserMenu.id === props.id &&
                <UserMenu
                    setShowUserMenu={props.setShowUserMenu}
                    user={props.author}
                />
            }
        </div>
    )
}


type TAuthorAccess = {
    author: any,
    id: number,
    type: string,
    setShowUserMenu: any,
}

function AuthorAccess(props: TAuthorAccess) {
    const { currentChannel } = useChannelsContext();
    const { isUserAdministrators } = useAdinistrators();

    return (
        <div
            className="flex"
            style={{ alignItems: 'flex-end' }}
            onClick={() => props.setShowUserMenu((o: any) => ({ show: !o.show, id: props.id }))}
        >

            <p className="message-author"
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textDecoration: 'underline',
                }}
            >{props.author.username}</p>


            <ResizeContainer height="auto" className="flex" style={{ alignItems: 'flex-end' }}>
                {
                    currentChannel.type !== "WHISPER" && props.author &&
                    currentChannel.ownerId === props.author.id &&
                    <RawIcon icon="location_away" />
                }
                {props.author && isUserAdministrators(props.author) && <RawIcon icon="shield_person" />}
            </ResizeContainer>
        </div>
    )
}


type TUserMessage = {
    lastMessage: boolean,
    author: any,
    id: number,
    content: string
}

function AuthorMessage(props: TUserMessage) {

    const { showUserMenu, setShowUserMenu } = useContext(MessengerContext);
    const { currentChannel } = useChannelsContext();

    let type = currentChannel && currentChannel.type;


    function style() {
        let style: any = { scrollMargin: '30px' };
        if (props.author && !props.lastMessage) {
            style = { ...style, marginBottom: '30px' }
        }
        return (style);
    }

    return (
        <div className="message-div" style={style()}
        >
            <div className="flex-column"
            >

                <div className="flex" style={{ alignItems: 'flex-end' }}>
                    {
                        props.author &&
                        <AuthorProfilePicture
                            id={props.id}
                            author={props.author}
                            type={type}
                            setShowUserMenu={setShowUserMenu}
                            showUserMenu={showUserMenu}
                        />
                    }

                    <p className="message"
                        style={props.author ?
                            { marginLeft: '5px' } :
                            { marginLeft: '35px' }}
                    >
                        {props.content}
                    </p>
                </div>

                {
                    props.author && type !== "WHISPER" &&
                    <AuthorAccess
                        id={props.id}
                        author={props.author}
                        type={type}
                        setShowUserMenu={setShowUserMenu}
                    />
                }
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
    blockedFriend: boolean,
    hidden: boolean,
    whisperUser:any, 
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
    }, [currentChannel && currentChannel.messages, user])

    useEffect(() => {
        if (currentChannel && currentChannel.messages && currentChannel.messages.length) {
            initMessages();
        }
        else
            setMessages([]);
    }, [currentChannel && currentChannel.messages, user.blockList])

    return (
        <MessengerContext.Provider value={
            {
                showUserMenu,
                setShowUserMenu,
            }
        }
        >
                {
                    messages && currentChannel && 
                    <MessengerConversation
                        messages={messages}
                        {...props}
                    />
                }
                <MessengerInput
                    {...props}
                />
        </MessengerContext.Provider>
    )
}


function MessengerConversation({ messages, blockedFriend, hidden, whisperUser }: any) {
    const { currentChannel } = useChannelsContext();

    const { getMemberById, isUserIdMember } = useMembers();
    const { fetchUser } = useFetchUsers();

    const messagesContainerRef = useRef(null);

    const [authors, setAuthors]: any = useState([]);


    async function loadAuthors(messages: any[]) {
        let users: any[] = [];
        let ids: number[] = [];
        console.log("author re fetched")
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
        console.log("messages => ", messages)
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

    // console.log("messages props => ", messages, "currentchannel messages => ", currentChannel.messages)

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
    }, [currentChannel, props.blockedFriend]);

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
        <div className={props.hidden ? "messages-input hidden" : "messages-input visible"}
        >
            <input
                className={props.hidden ? "messenger-input hidden" : "messenger-input visible"}
                value={value}
                onChange={handleChange}
                placeholder={canSendMessages()}
                onKeyDown={submit}
                disabled={props.blockedFriend}
            />
        </div>
    )
}