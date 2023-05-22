import React from "react";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";

import Banner from "./Banner";
import Profile from "./Profile";
import Messenger from "./Messenger";
import ProfileGroup from "./ProfileChannel";

import './Interface.css'

function RemoveFriend(props : any)
{
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


function InterfaceFriend(props : any)
{
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

function InterfaceGroup(props : any)
{
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

export function loader({params} : any)
{
    return ({})
}

/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function Interface({friend , group} : any) {

    const {id} : any = useParams();
    const {
        user, 
        currentElement, 
        friends, 
        removeFriend, 
        channel,
        conversations,
        sendMessage
    } : any = useOutletContext();

    const [render, setRender] = React.useState(false);
    const [profile, setProfile] = React.useState(false);
    const [blocked, setBlocked] = React.useState(false);
    const [current, setCurrent] = React.useState(currentElement);
    const [removeFriendView, setRemoveFriendView] = React.useState(false);
    const [blockedList, setBlockedList] : [any, any] = React.useState([]);

    console.log(blockedList, currentElement.id, blocked)

    async function handleRemoveFriend()
    {
        removeFriend();
    }

    function toggleProfile()
    {
        setProfile(prev => !prev);
    }

    function blockFriend()
    {
        if (!blocked)
            setBlockedList((p : any[]) => [...p, currentElement.id])
        else
            setBlockedList((p : any) => p.filter((id : any) => id !== currentElement.id))
        setBlocked(p => !p)
    }

    React.useEffect(() => {
        if (user)
        {
            setBlockedList(user.blockedList);
            if (user.blockedList.find((id : any) => id === currentElement.id))
                setBlocked(true);
        }
    }, [user])



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
            setCurrent(friends.find((u : any) => u.id.toString() === id.toString()))
    }, [friends])


    // update current friend selected when he is picked from MenuElement

    React.useEffect(() => {
        setProfile(false);
        setRemoveFriendView(false);
        if (currentElement)
        {
            if (blockedList.length && 
                    blockedList.find((id : any) => id === currentElement.id))
            {
                setBlocked(true);
            }
            else
                setBlocked(false);
            setCurrent(currentElement);
        }
    }, [currentElement])


    return (
        <div className="flex-column relative interface-container">
            <Banner
                element={current}
                name={current && current.username}
                img={current && current.avatar}
                status={current && current.userStatus}
                access={current.access}
                profile={() => toggleProfile()}
                invitation={() => {}}
                block={() => blockFriend()}
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
                                conversation={conversations.find((c : any) => c.id === channel.id)}
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
                    remove={() => handleRemoveFriend()}
                />
            }
        </div>
    )
}