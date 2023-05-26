import React, { useEffect, useReducer, useState } from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useNavigate, useOutletContext, useParams } from "react-router-dom";
import {
    getChannelByIDs,
    getFriendList,
    getMessages,
    getUser,
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

    const params: any = useParams();

    const navigate = useNavigate();

    const {
        user,
        token
    }: any = useUser();

    const [socket, setSocket]: [any, any] = useState();
    const [currentElement, setCurrentElement]: [any, any] = useState();

    const [friends, friendsDispatch]: any = useFriends();
    const [conversations, conversationsDispatch]: any = useConversations();

    const [channel, setChannel]: [any, any] = useState();

    const [friendInvitations, setFriendInvitations]: [any, any] = useState([]);
    const [notifInvitation, setNotifInvitation]: [any, any] = useState(false);

    /////////////////////////////////////////////////////////////////////////
    //                         M E S S A G E S                             //
    /////////////////////////////////////////////////////////////////////////

    function sendMessage(channelId: any, content: any) {
        socket.emit('message', {
            channelId,
            content
        })
    }

    useEffect(() => {
        if (socket && socket.connected) {
            socket.on('message', (m: any) => {
                if (m.length) {
                    conversationsDispatch({ type: 'initMessages', messages: m });
                }
                if (m.content) {
                    if (m.sendBy !== user.id && m.sendBy !== currentElement.id) {
                        friendsDispatch({ type: 'addNotif', friendId: m.sendBy })
                    }
                    conversationsDispatch({ type: 'addMessage', message: m });
                }
            });
        }

        return () => {
            if (socket)
                socket.off('message');
        }
    }, [socket, channel])

    /////////////////////////////////////////////////////////////////////////
    //                         I N V I T A T I O N S                       //
    /////////////////////////////////////////////////////////////////////////


    function removeFriendRequest(inviteId: any) {
        setNotifInvitation(false);
        setFriendInvitations((p: any) => p.filter((i: any) => i.id !== inviteId))
    }

    async function loadInvitations() {
        getUserInvitations(user.id)
            .then(invitationsRes => {
                if (invitationsRes.status === 200 &&
                    invitationsRes.statusText === "OK" && invitationsRes.data.length) {
                    setNotifInvitation(true);
                    setFriendInvitations(invitationsRes.data);
                }
            })

    }

    /////////////////////////////////////////////////////////////////////////
    //                            C H A N N E L                            //
    /////////////////////////////////////////////////////////////////////////

    async function selectCurrentElement(e: any) {
        friendsDispatch({ type: 'removeNotif', friend: e });
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

    /*
        when messenger (chat/friends/username/id) is refreshed then 
            we need to set manually the current friend  
    */
    useEffect(() => {
        if (friends && friends.length &&
            params && params.id) {
            getUser(params.id)
                .then(res => selectCurrentElement(res.data))
        }
    }, [friends])


    /*
        when a channel is picked we add it in conversations state and join it 
    */
    useEffect(() => {
        if (socket && channel) {
            if (conversations &&
                !conversations.find((e: any) => e.id === channel.id)) {
                conversationsDispatch({ type: 'addConv', conversation: channel })
            }

            socket.emit('joinChannel', {
                channelId: channel.id,
            })

        }
    }, [socket, channel])

    /////////////////////////////////////////////////////////////////////////
    //                       U S E    E F F E C T S                        //
    /////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        loadInvitations();
        let s = io(`${process.env.REACT_APP_BACK}`, {
            transports: ['websocket'],
            extraHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });

        setSocket(s);

        s.on('receivedRequest', (e: any) => {
            if (e)
            {
                setNotifInvitation(true);
                setFriendInvitations((p: any) => [...p, e])
            }
            console.log("EVENT RECIEVED REQUEST => ", e)
        })

        s.on('updatedFriend', (friend: any) => {
            console.log("UPDATE FRIEND EVENT => ", friend)
            if (friend.length && friend[0].id)
            {
                friendsDispatch({ type: 'updateFriend', friend: friend[0] });
            }
        })

        return (() => {
            s.disconnect();
        })
    }, [])

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
                        currentElement,
                        channel,
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


export default function Chat() {
    return (
        <FriendsProvider>
            <ConversationsProvider>
                <ChatInterface />
            </ConversationsProvider>
        </FriendsProvider>
    )
}