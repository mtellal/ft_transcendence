import React, { useEffect, useState } from "react";

import MenuElement from "../Chat/MenuElement";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
    createChannel,
    getChannels,
    getFriendChannel,
    getUser,
    getUserInvitations,
    getUserProfilePictrue,
} from "../utils/User";

import { useChannels, useChannelsUsers, useChatSocket, useFriends, useUser } from "../Hooks";

import { FriendsProvider } from "../contexts/Chat/FriendsContext";
import { SocketProvider } from "../contexts/Chat/ChatSocketContext";

import './Chat.css'
import { ChannelsProvider } from "../contexts/Chat/ChannelsContext";
import ChannelsUsersProvider from "../contexts/Chat/ChannelsUsersContext";

function ChatInterface() {

    const params: any = useParams();

    const navigate = useNavigate();

    const {
        user,
        token
    }: any = useUser();

    const { socket }: any = useChatSocket();

    const { friendsDispatch, updateFriend }: any = useFriends();
    const {
        channels,
        channelsDispatch,
        currentChannel,
    }: any = useChannels();

    const [friendInvitations, setFriendInvitations]: [any, any] = useState([]);
    const [notifInvitation, setNotifInvitation]: [any, any] = useState(false);

    const {channelsUsers } = useChannelsUsers();

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



    /*
        when messenger (chat/friends/username/id) is refreshed then 
            we need to set manually the current friend  
    */
    /* useEffect(() => {
        if (friends && friends.length &&
            params && params.id) {
            getUser(params.id)
                .then(res => selectCurrentElement(res.data, "friend"))
        }
    }, [friends]) */


    /*
        when a channel is picked we add it in conversations state and join it 
    */
    useEffect(() => {

        if (socket && user) {

            socket.on('message', (m: any) => {
                console.log("message recieved", m)
                if (m.length) {
                    channelsDispatch({ type: 'initMessages', messages: m });
                }
                if (m.content) {
                    /* if (m.sendBy !== user.id && m.sendBy !== currentElement.id) {
                        friendsDispatch({ type: 'addNotif', friendId: m.sendBy })
                    } */
                    channelsDispatch({ type: 'addMessage', message: m });
                }
            });
        }

        return () => {
            if (socket)
                socket.off('message');
        }
    }, [user, socket])


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

            socket.on('updatedUser', async (friend: any) => {
                console.log("UPDATE FRIEND EVENT => ", friend)
                updateFriend(friend)
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
                    notification={notifInvitation}
                    removeNotif={() => setNotifInvitation(false)}
                />
                <Outlet context={
                    {
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
                    <ChannelsUsersProvider>
                        <ChatInterface />
                    </ChannelsUsersProvider>
                </ChannelsProvider>
            </FriendsProvider>
        </SocketProvider>
    )
}