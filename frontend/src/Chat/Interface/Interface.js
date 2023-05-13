import React from "react";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";

import Banner from "./Banner";
import Profile from "./Profile";
import Messenger from "./Messenger";
import ProfileGroup from "./ProfileChannel";

import { currentUser } from "../../exampleDatas";

import './Interface.css'

function RemoveFriend(props)
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


function InterfaceFriend(props)
{
    return (
        <>
            {
                props.profile ? 
                <Profile item={props.item} /> :
                <Messenger 
                    item={props.item} 
                    blocked={props.blocked} 
                    invitation={props.invitation} 
                />
            }
        </>
    )
}

function InterfaceGroup(props)
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

function getFriend(username)
{
    return (currentUser.friendList.find(friend => friend.username === username));
}

function getGroup(name)
{
    return (currentUser.channelList.find(channel => channel.name === name));
}

export function loader({params})
{
    let item;
    if (params.username)
        item = getFriend(params.username);
    else if (params.groupid)
    {
        item = getGroup(params.groupid);
    }
    return (item);
}

/*
    - MessagesElement is the rigth side of Chat interface,
    - reclaim an item, which is Friend or Group object, and display messages from this item if they exist,
    - catch user messages from <Messages /> and update messages array 

*/

export default function Interface({ group, friend }) {

    const {id} = useParams();
    const item = useLoaderData();
    const {user, currentElement, friends, removeFriend} = useOutletContext();

    const [render, setRender] = React.useState(false);
    const [profile, setProfile] = React.useState(false);
    const [blocked, setBlocked] = React.useState(item.blocked);
    const [current, setCurrent] = React.useState(currentElement);
    const [removeFriendView, setRemoveFriendView] = React.useState(false);

    function pushMessage(message) {
        let newMessage = {
            id: item.conversation.length + 1,
            ...message
        }
        item.conversation.push(newMessage);
    }

    function newInvitation() {
        if (!blocked && !profile) {
            pushMessage({
                author: "me",
                type: "invitation",
                to: item.username || item.name,
                status: "valid"
            })
        }
        setRender(prev => !prev)
    }
    
    function blockUser() {
        if (!profile)
        {
            setBlocked(prev => !prev);
            item.blocked = !item.blocked;
        }
    }

    async function handleRemoveFriend()
    {
        removeFriend();
    }

    function toggleProfile()
    {
        setProfile(prev => !prev);
    }


    // when a friend is selected but the page is refreshed
    // then it reload user data from URI id

    React.useEffect(() => {
        if (friends)
            setCurrent(friends.find(u => u.id.toString() === id.toString()))
    }, [friends])


    // update current friend selected when he is picked from MenuElement

    React.useEffect(() => {
        setCurrent(currentElement);
        setRemoveFriendView(false);
    }, [currentElement])

    //
    React.useEffect(() => {
        setBlocked(item.blocked);
        setProfile(false);
    }, [item])

    return (
        <div className="flex-column relative interface-container">
            <Banner
                element={current || item}
                name={current && current.username}
                img={current && current.avatar}
                status={current && current.userStatus}
                access={item.access}
                profile={() => toggleProfile()}
                invitation={() => newInvitation()}
                block={() => blockUser()}
                remove={() => setRemoveFriendView(prev => !prev)}
            />
            {
                friend ? 
                <InterfaceFriend 
                    profile={profile} 
                    item={item} 
                    blocked={blocked} 
                    invitation={render} 
                /> :
                <InterfaceGroup 
                    group={group} 
                    profile={profile} 
                    item={item} 
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