import React, { useReducer } from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import {
    getChannelByIDs,
    getFriendList,
    getMessages,
    getUserInvitations,
    removeUserFriend
} from "../utils/User";

import { io } from 'socket.io-client';


import { useConversations, useFriends, useUser } from "../Hooks";
import { isEqual } from "../utils";

import { FriendsProvider } from "../contexts/Chat/FriendsContext";
import { ConversationsProvider } from "../contexts/Chat/ConversationsContexts";

import './Chat.css'

function ChatInterface() {

    const navigate = useNavigate();

    const { 
        user, 
        token 
    } : any = useUser();

    const [socket, setSocket]: [any, any] = React.useState();
    const [currentElement, setCurrentElement]: [any, any] = React.useState();

    const [friends, friendsDispatch] : any = useFriends();
    const [conversations, conversationsDispatch] : any = useConversations();

    const [channel, setChannel]: [any, any] = React.useState();

    const [friendInvitations, setFriendInvitations]: [any, any] = React.useState([]);
    const [notifInvitation, setNotifInvitation]: [any, any] = React.useState(false);

    React.useEffect(() => {
        if (channel) {
            if (conversations && 
                    !conversations.find((e: any) => e.id === channel.id)) {
                conversationsDispatch({type: 'addConv', conversation: channel})
            }

            socket.emit('joinChannel', {
                channelId: channel.id,
            })

        }
    }, [socket, channel])


    function initMessages(arrayMessages: any) {
        conversationsDispatch({type: 'initMessages', messages: arrayMessages});
    }

    function addMessage(message: any) {
        if (message.sendBy !== user.id && message.sendBy !== currentElement.id) {
            friendsDispatch({type: 'addNotif', friendId: message.sendBy})
        }

        conversationsDispatch({type: 'addMessage', message});
    }

    React.useEffect(() => {
        if (socket && socket.connected) {
            socket.on('message', (m: any) => {
                if (m.length) {
                    initMessages(m)
                }
                if (m.content) {
                    addMessage(m)
                }
            });
        }

        return () => {
            if (socket)
                socket.off('message');
        }
    }, [conversations, socket, channel])


    function sendMessage(channelId: any, content: any) {
        socket.emit('message', {
            channelId,
            content
        })
    }


    function removeFriendRequest(inviteId: any) {
        setNotifInvitation(false);
        setFriendInvitations((p: any) => p.filter((i: any) => i.id !== inviteId))
    }


    async function loadFriends() {
        const friendListRes = await getFriendList(user.id);
        if (friendListRes.status === 200 && friendListRes.statusText === "OK") {
            let friendList = friendListRes.data;
            friendList = friendList.sort((a: any, b: any) => a.username > b.username ? 1 : -1)
            friendsDispatch({type: 'set', newFriends: friendList})
        }
    }

    /*
        if a friend exists inside friendList[] then it updates, 
        else he is added in the array 
    */

    function updateFriendList(friend: any) {
        friendsDispatch({type: 'updateFriend', friend});
    }

    async function removeFriend() {
        const res = await removeUserFriend(currentElement.id, token)
        if (res.status === 200 && res.statusText === "OK") {
            friendsDispatch({type: 'removeFriend', friend: currentElement})
            navigate("/chat");
        }
    }

    async function loadInvitations() {
        const invitationsRes = await getUserInvitations(user.id);
        if (invitationsRes.status === 200 && invitationsRes.statusText === "OK") {
            if (invitationsRes.data.length) {
                setFriendInvitations((p: any) => {
                    if (!isEqual(p, invitationsRes.data)) {
                        setNotifInvitation(true);
                        return (invitationsRes.data);
                    }
                    return (p);
                });
            }
        }
    }

    React.useEffect(() => {
        loadInvitations();
        loadFriends();
        const loadFriendsInterval = setInterval(async () => {
            loadInvitations();
            loadFriends();
        }, 3000)

        let s = io('http://localhost:3000', {
            transports: ['websocket'],
            extraHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });

        setSocket(s);

        return (() => {
            clearInterval(loadFriendsInterval);
            s.disconnect();
        })


    }, [])


    async function selectCurrentElement(e: any) {
        friendsDispatch({type: 'removeNotif', friend: e});
        setCurrentElement({ ...e, notifs: 0 });

        getChannelByIDs(user.id, e.id)
            .then(d => {
                setChannel(d.data)
            })
            .catch(e => {
                socket.emit('createChannel', {
                    name: "privateMessage",
                    type: "WHISPER",
                    memberList: [e.id]
                })
            })
    }

    return (
            <div className="chat">
                <div className="chat-container">
                    <MenuElement
                        friends={friends}
                        user={user}
                        addGroup={() => { }}
                        setCurrentElement={selectCurrentElement}
                        notification={notifInvitation}
                        removeNotif={() => setNotifInvitation(false)}
                        />
                    <Outlet context={
                        {
                            user,
                            currentElement,
                            friends,
                            token,
                            removeFriend,
                            channel,
                            conversations,
                            sendMessage,
                            friendInvitations,
                            removeFriendRequest,
                        }
                    }
                    />
                </div>
            </div>
    )
}


export default function Chat()
{
    return (
        <FriendsProvider>
            <ConversationsProvider>
                <ChatInterface />
            </ConversationsProvider>
        </FriendsProvider>
    )
}