import React, { useContext } from "react";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";

import Banner from "./Banner";
import Profile from "./Profile";
import Messenger from "./Messenger";
import ProfileGroup from "./ProfileChannel";

import './Interface.css'

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
        currentUser,
        user,
        currentElement,
        friends,
        removeFriend,
        channel,
        conversations,
        sendMessage,
        blockUser,
        unblockUser
    }: any = useOutletContext();

    const [render, setRender] = React.useState(false);
    const [profile, setProfile] = React.useState(false);
    const [current, setCurrent] = React.useState(currentElement);
    const [removeFriendView, setRemoveFriendView] = React.useState(false);
    const [blocked, setBlocked]: [any, any] = React.useState(false);

    function block() {
        console.log("block function called")
        setBlocked((p: any) => {
            if (!p)
                blockUser(current.id)
            else
                unblockUser(current.id);
            return (!p);
        });
    }


    React.useEffect(() => {
        console.log("INTERFACE MOUNT")
        return () => {
            console.log("INTERFACE UNMOUNT")
        }
    }, [])

    // when a friend is selected but the page is refreshed
    // then it reload user data from URI id

    React.useEffect(() => {
        if (friends)
            setCurrent(friends.find((u: any) => u.id.toString() === id.toString()))
    }, [friends])


    // update current friend selected when he is picked from MenuElement

    React.useEffect(() => {
        setProfile(false);
        setRemoveFriendView(false);
        if (currentElement) {
            setCurrent(currentElement);
            if (currentUser && currentUser.blockedList.length) {
                if (currentUser.blockedList.find((id: any) => currentElement.id === id))
                    setBlocked(true);
                else 
                    setBlocked(false)
            }
        }
    }, [currentElement, currentUser])

    return (
        <div className="flex-column relative interface-container">
            <Banner
                element={current}
                name={current && current.username}
                img={current && current.avatar}
                status={current && current.userStatus}
                access={current.access}
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
                                    conversation={conversations.find((c: any) => c.id === channel.id)}
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
                    remove={() => removeFriend()}
                />
            }
        </div>
    )
}