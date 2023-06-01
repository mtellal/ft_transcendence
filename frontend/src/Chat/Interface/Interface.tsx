import React, { useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";

import Banner from "./Banner";
import Profile from "./Profile";
import Messenger from "./Messenger";
import ProfileGroup from "./ProfileChannel";

import './Interface.css'
import { useChannels, useChatSocket, useFriends, useUser } from "../../Hooks";
import { blockUserRequest, removeUserFriend, unblockUserRequest } from "../../utils/User";

function RemoveFriend(props: any) {
    return (
        <div className="absolute flex-column-center remove-friend">
            <div className="flex-column-center remove-friend-div">
                <p>Are you sure to remove <span className="remove-friend-username">{props.user}</span> ?</p>
                <div className="remove-friend-buttons">
                    <button
                        className="button red white-color remove-friend-button"
                        onClick={props.remove}
                    >
                        Remove
                    </button>
                    <button
                        className="button white remove-friend-button"
                        onClick={props.cancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}


function RemoveView(props: any) {
    return (
        <>
            {
                props.currentChannel && props.currentChannel.type !== "WHISPER" &&
                <RemoveFriend
                    user={props.currentChannel && props.currentChannel.name}
                    cancel={props.cancel}
                    remove={() => props.leaveChannel(props.currentChannel)}
                />
            }
            {
                props.currentFriend &&
                <RemoveFriend
                    user={props.currentFriend && props.currentFriend.username}
                    cancel={props.cancel}
                    remove={() => props.removeFriend(props.currentFriend)}
                />
            }
        </>
    )
}


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
    }: any = useUser();

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
                    <div className="flex-column relative interface-container">
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
                                leaveChannel={() => leaveChannel(currentChannel)}
                                removedFriend={() => removeFriend(currentFriend)}
                            />
                        }
                    </div>
                    : null
            }
        </>
    )
}