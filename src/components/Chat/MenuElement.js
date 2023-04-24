
import React from "react";
import FriendElement from "../FriendElement";
import { examplesFriends, examplesGroup, exampleMessages } from "../../exampleDatas";

import './MenuElement.css'

function CollectionElement(props)
{
    return (
        <div className="collection">
            <div className="collection-label">
                <h2 className="collection-title">{props.title}</h2>
                <div onClick={props.addClick} className="collection-add">
                    <span className="material-symbols-outlined">
                        add
                    </span>
                </div>
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
        <div className="group"
            style={props.selected ? {backgroundColor:'#F4F4F4'} : null}
            onClick={() => props.click(props)}
        >
            <p className="group-name">{props.name}</p>
            <p className="group-separator">-</p>
            <p className="group-members">{props.members} members</p>
        </div>
    )
}


export default function MenuElement(props)
{

    const [groups, setGroups] = React.useState(examplesGroup);
    const [friends, setFriends] = React.useState(examplesFriends);
    const [currentFriend, setCurrentFriend] = React.useState();
    const [currentGroup, setCurrentGroup] = React.useState();

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
            members={e.members}
            selected={currentGroup === e.id ? true : false}
            click={handleCurrentGroup}
        />
    )

    const friendsList = friends.map(e => (
        <FriendElement 
            key={e.id}
            id={e.id}
            username={e.username}
            connected={e.connected}
            chat={false}
            hover={true}
            selected={currentFriend === e.id ? true : false}
            className="chat"
            click={handleFriendsMessage}
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