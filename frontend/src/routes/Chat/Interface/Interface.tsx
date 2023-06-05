import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";

import Banner from "../components/Banner/Banner";
import Profile from "../Profile/Profile";
import Messenger from "../components/Messenger/Messenger";

import { useChannels, useChatSocket, useFriends, useCurrentUser } from "../../../hooks/Hooks";
import { blockUserRequest, unblockUserRequest } from "../../../requests/block";
import RemoveView from "../components/RemoveElement.tsx/RemoveView";
import { removeUserFriend } from '../../../requests/friends'
import './Interface.css'
 
export function loader({ params }: any) {
    return ({})
}

/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function Interface() {

    const { socket } = useChatSocket();
    const navigate = useNavigate();
    const {
        token,
        user,
        userDispatch
    }: any = useCurrentUser();

    const {
        currentChannel,
        leaveChannel,
    } = useChannels();

    const {
        friends,
        friendsDispatch,
        currentFriend
    }: any = useFriends();

    const [profile, setProfile] = React.useState(false);
    const [removeView, setRemoveView] = React.useState(false);
    const [blocked, setBlocked]: [any, any] = React.useState(false);

    const { setBackToMenu, backToMenu } : any = useOutletContext();

    function block() {
        if (!blocked) {
            userDispatch({ type: 'blockUser', friendId: currentFriend.id })
            blockUserRequest(currentFriend.id, token)
        }
        else {
            unblockUserRequest(currentFriend.id, token)
            userDispatch({ type: 'unblockUser', friendId: currentFriend.id })
        }
        setBlocked((p: any) => !p)
    }


    async function removeFriend(friend: any) {
        if (friend) {
            removeUserFriend(friend.id, token)
                .then(res => {
                    if (res.status === 200 && res.statusText === "OK") {
                        setRemoveView(false)
                        friendsDispatch({ type: 'removeFriend', friend })
                        navigate("/chat");
                    }
                })
        }
    }


    // update current friend selected when he is picked from MenuElement

    React.useEffect(() => {
        setProfile(false);
        setRemoveView(false);
        if (currentFriend && user) {
            if (user.blockedList.length) {
                if (user.blockedList.find((obj: any) => currentFriend.id === obj.blockedId))
                    setBlocked(true);
                else
                    setBlocked(false)
            }
        }
    }, [currentFriend, user])

    return (
        <>
            {
                currentChannel ?
                    <div className={backToMenu ? "flex-column relative interface-container hidden" : "flex-column relative interface-container visible"}>
                        <Banner
                            profile={() => setProfile(prev => !prev)}
                            invitation={() => { }}
                            block={() => block()}
                            remove={() => setRemoveView(prev => !prev)}
                            backToMenu={() => setBackToMenu((p : any) => !p)}
                        />
                        {
                            profile ?
                                <Profile /> :
                                <Messenger
                                    currentChannel={currentChannel}
                                    blocked={blocked}
                                />
                        }

                        {
                            removeView &&
                            <RemoveView
                                currentChannel={currentChannel}
                                currentFriend={currentFriend}
                                cancel={() => setRemoveView(prev => !prev)}
                                leaveChannel={() => {leaveChannel(currentChannel); setRemoveView(false)}}
                                removeFriend={() => removeFriend(currentFriend)}
                            />
                        }
                    </div>
                    : null
            }
        </>
    )
}