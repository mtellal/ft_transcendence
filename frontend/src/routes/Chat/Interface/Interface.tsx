import React, { useCallback, useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";

import Banner from "../components/Banner/Banner";
import Profile from "../Profile/Profile";
import Messenger from "../components/Messenger/Messenger";

import { useChannelsContext, useChatSocket, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";
import { blockUserRequest, unblockUserRequest } from "../../../requests/block";
import RemoveView from "../components/RemoveElement.tsx/RemoveView";
import { removeUserFriend } from '../../../requests/friends'
import './Interface.css'

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
        currentFriend,
        setCurrentFriend
    }: any = useFriendsContext();

    const [profile, setProfile] = React.useState(false);
    const [removeView, setRemoveView] = React.useState(false);
    const [blocked, setBlocked]: [any, any] = React.useState(false);



    useEffect(() => {
        if (!currentChannel && channels && channels.length) {
            if (params.channelName) {
                const channel = channels.find((c: any) => c.name === params.channelName)
                if (channel)
                    return (setCurrentChannel(channel));
            }
            else if (params.username && friends && friends.length) {
                const friend = friends.find((f: any) => f.username === params.username);
                if (friend) {
                    setCurrentFriend(friend)
                    const whispersChannel = channels.filter((c: any) => c.type === "WHISPER");
                    const channel = whispersChannel.find((c: any) =>
                        c.members.length === 2 && c.members.find((id: number) => id === user.id)
                        && c.members.find((id: number) => id === friend.id))
                    if (channel)
                        return (setCurrentChannel(channel));
                }
            }
            navigate("/chat")
        }
    }, [currentChannel, channels, friends])

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


    function validLeaveChannel() {
        leaveChannel(currentChannel);
        setRemoveView(false);
        navigate("/chat");
    }

    // update current friend selected when he is picked from MenuElement

    React.useEffect(() => {
        setProfile(false);
        setRemoveView(false);
        if (currentFriend && user) {
            if (user.blockList.length) {
                if (user.blockList.find((obj: any) => currentFriend.id === obj.userId))
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
                    <div className={"flex-column relative interface-container visible"}>
                        <Banner
                            profile={() => setProfile(prev => !prev)}
                            invitation={() => { }}
                            block={() => block()}
                            remove={() => setRemoveView(prev => !prev)}
                        />
                        {
                            profile ?
                                <Profile /> :
                                <Messenger />
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