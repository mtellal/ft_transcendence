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


function InterfaceFriend(props: any) {
    return (
        <>
            {
                props.profile ?
                    <Profile /> :
                    <Messenger
                        user={props.user}
                        element={props.element}
                        channel={props.channel}
                        blocked={props.blocked}
                        invitation={props.invitation}
                        group={null}
                    />
            }
        </>
    )
}

function InterfaceGroup(props: any) {
    return (
        <>
            {
                props.profile &&
                <ProfileGroup
                    channel={props.item}
                    user={props.user}
                />
            }
            {
                !props.profile &&
                <Messenger
                    group={props.group}
                    item={props.item}
                    blocked={props.blocked}
                    invitation={props.invitation}
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

    const { id }: any = useParams();
    const { socket } = useChatSocket();
    const {
        token,
        user,
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
      /*   if (!blocked) {
            userDispatch({ type: 'blockUser', friendId: current.id })
            blockUserRequest(current.id, token)
        }
        else {
            unblockUserRequest(current.id, token)
            userDispatch({ type: 'unblockUser', friendId: current.id })
        }
        setBlocked((p: any) => !p) */
    }


    async function removeFriend(friend: any) {
        console.log(friend)
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
        if (currentChannel && user) {
            if (user.blockedList.length) {
                if (user.blockedList.find((obj: any) => currentChannel.id === obj.blockedId))
                    setBlocked(true);
                else
                    setBlocked(false)
            }
        }
    }, [currentChannel, user])

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
                            friend ?
                                <>
                                    {
                                        profile ?
                                            <Profile /> :
                                            <Messenger
                                                blocked={blocked}
                                                invitation={render}
                                            />
                                    }
                                </>
                                :
                                <InterfaceGroup
                                    group={true}
                                    profile={profile}
                                    item={currentChannel}
                                    blocked={blocked}
                                    invitation={render}
                                    user={user}
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