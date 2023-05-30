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


export function loader({ params }: any) {
    return ({})
}

/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function Interface() {

    const { id }: any = useParams();
    const { socket } = useChatSocket();
    const {
        token,
        user,
        userDispatch
    }: any = useUser();

    const { sendMessage }: any = useOutletContext();

    const { currentChannel } = useChannels();

    const navigate = useNavigate();

    const {
        friends,
        friendsDispatch,
        currentFriend
    }: any = useFriends();

    const [render, setRender] = React.useState(false);
    const [profile, setProfile] = React.useState(false);
    const [removeFriendView, setRemoveFriendView] = React.useState(false);
    const [blocked, setBlocked]: [any, any] = React.useState(false);

    const [friend, setFriend]: any = useState();


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
        setRemoveFriendView(false);
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
                            remove={() => setRemoveFriendView(prev => !prev)}
                        />
                        {
                            profile ?
                                <Profile /> :
                                <Messenger
                                    currentChannel={currentChannel}
                                    blocked={blocked}
                                    invitation={render}
                                />
                        }

                        {
                            removeFriendView &&
                            <RemoveFriend
                                user={currentFriend && currentFriend.username}
                                cancel={() => setRemoveFriendView(prev => !prev)}
                                remove={() => removeFriend(currentFriend)}
                            />
                        }
                    </div>
                    : null
            }
        </>
    )
}