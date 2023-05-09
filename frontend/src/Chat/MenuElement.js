
import React from "react";
import { Link } from "react-router-dom";

import FriendElement from "../components/FriendElement";
import './MenuElement.css'

function CollectionElement(props)
{
    return (
        <div className="collection">
            <div className="collection-label">
                <h2 className="collection-title">{props.title}</h2>
                <Link 
                    to={`/chat/add-${props.title.toLowerCase().slice(0, -1)}`} 
                    onClick={props.addClick} 
                    className="collection-add"
                >
                    <span className="material-symbols-outlined">
                        add
                    </span>
                </Link>
            </div>
            <div className="collection-list">
                {props.collection}
            </div>
        </div>
    )
}

function GroupElement(props)
{
    return (
        <Link to={`/chat/groups/${props.name}`} className="group"
            style={props.selected ? {backgroundColor:'#F4F4F4'} : null}
            onClick={() => props.click(props)}
        >
            <p className="group-name">{props.name}</p>
            <p className="group-separator">-</p>
            <p className="group-members">{props.members} members</p>
        </Link>
    )
}


export default function MenuElement(props)
{
    const [groups, setGroups] = React.useState(props.user.channelList);
    const [friends, setFriends] = React.useState(props.user.friendList);
    const [currentFriend, setCurrentFriend] = React.useState();
    const [currentGroup, setCurrentGroup] = React.useState();

    
    React.useEffect(() => {

        setFriends(props.friends.map(res => {
            if (res.status === 200 && res.statusText === "OK")
                return (res.data)
            else
                console.log("Menu element, res => ", res) 
        }))

    }, [props.friends])

    function handleFriendsMessage(p)
    {
        setCurrentFriend(p.id);
        setCurrentGroup(null);
        props.getElement(p);
    }

    function handleCurrentGroup(p)
    {
        setCurrentGroup(p.id);
        setCurrentFriend(null);
        props.getElement(p);
    }

    const groupList = groups.map(e => 
        <GroupElement
            key={e.id}
            id={e.id}
            name={e.name}
            members={e.members.length}
            selected={currentGroup === e.id ? true : false}
            click={handleCurrentGroup}
        />
    )

    const friendsList = friends.map(user => (
        <FriendElement 
            key={user.id}
            id={user.id}
            username={user.username}
            avatar={user.avatar}
            userStatus={user.userStatus}
            hover={true}
            selected={currentFriend === user.id ? true : false}
            className="chat"
            click={() => handleFriendsMessage(user)}
        />
    ))

    return (
        <div className="menu-container">
            <CollectionElement
                title="Groups"
                collection={groupList}
                addClick={props.addGroup}
            />
            <CollectionElement
                title="Friends"
                collection={friendsList}
                addClick={props.addFriend}
            />
        </div>
    )
}