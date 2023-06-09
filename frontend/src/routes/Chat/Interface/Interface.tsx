import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";

import Banner from "../components/Banner/Banner";
import Profile from "../Profile/Profile";
import Messenger from "../components/Messenger/Messenger";

import { useChannelsContext, useChatSocket, useFriends, useCurrentUser } from "../../../hooks/Hooks";
import { blockUserRequest, unblockUserRequest } from "../../../requests/block";
import RemoveView from "../components/RemoveElement.tsx/RemoveView";
import { removeUserFriend } from '../../../requests/friends'
import './Interface.css'
import { getChannel, getChannelByName } from "../../../requests/chat";
 
/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function Interface() {
    const params: any = useParams();

    const navigate = useNavigate();
    const {
        token,
        user,
        userDispatch
    }: any = useCurrentUser();

    const {
        currentChannel,
        setCurrentChannel,
        leaveChannel,
        channels
    } = useChannelsContext();

    const {
        friends,
        friendsDispatch,
        currentFriend
    }: any = useFriends();

    const [profile, setProfile] = React.useState(false);
    const [removeView, setRemoveView] = React.useState(false);
    const [blocked, setBlocked]: [any, any] = React.useState(false);

    const { setBackToMenu, backToMenu } : any = useOutletContext();


    async function refreshPageAndLoadChannel(name : string)
    {
        const channelArray = await getChannelByName(name).then(res => res.data);
        if (channelArray && channelArray.length)
        {
            const channel = channelArray.find((c: any) => c.members.find((id : number) => user.id === id))
            setCurrentChannel(channel);
        }
        else
            navigate("/chat")

    }

    useEffect(() => {
        if (!currentChannel)
        {
            if (params.channelName)
            {
                // console.log(channels)
                refreshPageAndLoadChannel(params.channelName);
            }
            else if (params.username)
            {

            }
        }
    }, [currentChannel])

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


    function validLeaveChannel()
    {
        leaveChannel(currentChannel); 
        setRemoveView(false);
        navigate("/chat");
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
                                leaveChannel={() => validLeaveChannel()}
                                removeFriend={() => removeFriend(currentFriend)}
                            />
                        }
                    </div>
                    : null
            }
        </>
    )
}