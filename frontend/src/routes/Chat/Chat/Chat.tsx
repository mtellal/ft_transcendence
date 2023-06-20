import React, { useEffect, useState } from "react";

import MenuElement from "../components/Menu/MenuElement";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import {
    getUserInvitations,
} from "../../../requests/friendsRequest";

import { useChannels, useChatSocket, useFriends, useCurrentUser } from "../../../hooks/Hooks";

import { FriendsProvider } from "../../../contexts/Chat/FriendsContext";
import { SocketProvider } from "../../../contexts/Chat/ChatSocketContext";

import { ChannelsProvider } from "../../../contexts/Chat/ChannelsContext";
import './Chat.css'

function ChatInterface() {

    const navigate = useNavigate();

    const {
        user,
        token
    }: any = useCurrentUser();

    const { socket }: any = useChatSocket();

    const { friendsDispatch, updateFriend }: any = useFriends();
    const {
        channels,
        channelsDispatch,
        currentChannel,
    }: any = useChannels();

    const [friendInvitations, setFriendInvitations]: [any, any] = useState([]);
    const [notifInvitation, setNotifInvitation]: [any, any] = useState(false);

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
                console.log("UPDATE FRIEND EVENT => ", friend.username)
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
                        <ChatInterface />
                </ChannelsProvider>
            </FriendsProvider>
        </SocketProvider>
    )
}