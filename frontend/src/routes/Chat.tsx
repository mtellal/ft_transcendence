import React, { useEffect, useState } from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
    getChannels,
    getFriendChannel,
    getUser,
    getUserInvitations,
} from "../utils/User";

import { useChannels, useChatSocket, useConversations, useFriends, useUser } from "../Hooks";

import { FriendsProvider } from "../contexts/Chat/FriendsContext";
import { ConversationsProvider } from "../contexts/Chat/ConversationsContexts";
import { SocketProvider } from "../contexts/Chat/ChatSocketContext";

import './Chat.css'
import { ChannelsProvider } from "../contexts/Chat/ChannelsContext";

function ChatInterface() {

    const params: any = useParams();

    const navigate = useNavigate();

    const {
        user,
        token
    }: any = useUser();

    const { socket }: any = useChatSocket();
    const [currentElement, setCurrentElement]: [any, any] = useState();

    const [friends, friendsDispatch]: any = useFriends();
    const [conversations, conversationsDispatch]: any = useConversations();
    const [channels, channelsDispatch] : any = useChannels();

    const [channel, setChannel]: [any, any] = useState();

    const [friendInvitations, setFriendInvitations]: [any, any] = useState([]);
    const [notifInvitation, setNotifInvitation]: [any, any] = useState(false);

    /////////////////////////////////////////////////////////////////////////
    //                         M E S S A G E S                             //
    /////////////////////////////////////////////////////////////////////////

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

    async function selectCurrentElement(e: any, type: string) {

        if (type === "friend") {
            friendsDispatch({ type: 'removeNotif', friend: e });
            setCurrentElement({ ...e, notifs: 0 });

            const res = await getFriendChannel(user.id, e.id);
            if (res.status === 200 &&
                res.statusText === "OK") {
                setChannel(res.data)
            }
            else {
                console.log("channel created EMIT")
                socket.emit('createChannel', {
                    name: "privateMessage",
                    type: "WHISPER",
                    memberList: [e.id]
                })
                
                socket.on('newChannel', (e : any) => {
                    console.log("neChannel called, and channel setted")
                    setChannel(e)
                })
                socket.off('createChannel')
            }
        }
    }

    /*
        when messenger (chat/friends/username/id) is refreshed then 
            we need to set manually the current friend  
    */
    useEffect(() => {
        if (friends && friends.length &&
            params && params.id) {
            getUser(params.id)
                .then(res => selectCurrentElement(res.data, "friend"))
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
        if (socket) {
            socket.on('receivedRequest', (e: any) => {
                if (e) {
                    setNotifInvitation(true);
                    setFriendInvitations((p: any) => [...p, e])
                }
                console.log("EVENT RECIEVED REQUEST => ", e)
            })

            socket.on('updatedUser', (friend: any) => {
                console.log("UPDATE FRIEND EVENT => ", friend)
                if (friend && friend.id) {
                    friendsDispatch({ type: 'updateFriend', friend });
                }
            })

            socket.on('removedFriend', (friend: any) => {
                console.log("REMOVE FRIEND EVENT")
                if (friend && friend.id) {
                    friendsDispatch({ type: 'removeFriend', friend });
                    navigate("/chat")
                }
            })
        }

    }, [socket])

    return (
        <div className="chat">
            <div className="chat-container">
                <MenuElement
                    friends={friends}
                    channels={channels}
                    user={user}
                    addGroup={() => { }}
                    setCurrentElement={selectCurrentElement}
                    notification={notifInvitation}
                    removeNotif={() => setNotifInvitation(false)}
                />
                <Outlet context={
                    {
                        channel,
                        channels,
                        currentElement,
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
        <SocketProvider>
            <FriendsProvider>
                <ChannelsProvider>
                    <ConversationsProvider>
                        <ChatInterface />
                    </ConversationsProvider>
                </ChannelsProvider>
            </FriendsProvider>
        </SocketProvider>
    )
}