import React, { useContext } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";

import Banner from "./Banner";
import Profile from "./Profile";
import Messenger from "./Messenger";
import ProfileGroup from "./ProfileChannel";

import './Interface.css'
import { useConversations, useFriends, useUser } from "../../Hooks";
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
                    <Profile element={props.element} /> :
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

export default function Interface({ friend, group }: any) {

    const { id }: any = useParams();
    const {
        token,
        user,
        userDispatch,
    }: any = useUser();

    const {
        currentElement,
        channel,
        sendMessage,
    }: any = useOutletContext();

    const navigate = useNavigate();

    const [friends, friendsDispatch]: any = useFriends();
    const [conversations, conversationsDispatch]: any = useConversations();

    const [render, setRender] = React.useState(false);
    const [profile, setProfile] = React.useState(false);
    const [current, setCurrent] = React.useState(currentElement);
    const [removeFriendView, setRemoveFriendView] = React.useState(false);
    const [blocked, setBlocked]: [any, any] = React.useState(false);

    function block() {
        if (!blocked) {
            userDispatch({ type: 'blockUser', friendId: current.id })
            blockUserRequest(current.id, token)
        }
        else {
            unblockUserRequest(current.id, token)
            userDispatch({ type: 'unblockUser', friendId: current.id })
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
        if (currentElement) {
            setCurrent(currentElement);
            if (user.blockedList.length) {
                if (user.blockedList.find((obj: any) => currentElement.id === obj.blockedId))
                    setBlocked(true);
                else
                    setBlocked(false)
            }
        }
    }, [currentElement])


    return (
        <>
            {
                current ?
                    <div className="flex-column relative interface-container">
                        <Banner
                            element={current}
                            name={current && current.username}
                            img={current && current.avatar}
                            status={current && current.userStatus}
                            access={null}
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
                                            <Profile element={current} /> :
                                            <Messenger
                                                user={user}
                                                element={current}
                                                conversation={conversations &&
                                                    conversations.find((c: any) => c.id === channel.id)}
                                                sendMessage={sendMessage}
                                                blocked={blocked}
                                                invitation={render}
                                                group={null}
                                            />
                                    }
                                </>
                                :
                                <InterfaceGroup
                                    group={group}
                                    profile={profile}
                                    item={current}
                                    blocked={blocked}
                                    invitation={render}
                                    user={user}
                                />
                        }
                        {
                            removeFriendView &&
                            <RemoveFriend
                                user={current.username}
                                cancel={() => setRemoveFriendView(prev => !prev)}
                                remove={() => removeFriend(current)}
                            />
                        }
                    </div>
                    : null
            }
        </>
    )
}