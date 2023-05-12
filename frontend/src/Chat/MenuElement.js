
import React from "react";
import { Link, useParams } from "react-router-dom";

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
                    className="collection-add"
                >
                    <span className="material-symbols-outlined">
                        add
                    </span>
                </Link>
            </div>
            <div className="flex-column">
                {props.collection}
            </div>
        </div>
    )
}

function GroupElement(props)
{
    return (
        <Link to={`/chat/groups/${props.name}`} className="group hover-fill-grey"
            style={props.selected ? {backgroundColor:'#F4F4F4'} : null}
            onClick={() => props.click(props)}
        >
            <p className="group-name">{props.name}</p>
            <p className="group-separator">-</p>
            <p className="group-members">{props.members} members</p>
        </Link>
    )
}


export default function MenuElement({...props})
{
    const {id} = useParams();
    
    const [groups, setGroups] = React.useState(props.user.channelList);
    const [friendsList, setFriendsList] = React.useState(props.friends);
    const [currentGroup, setCurrentGroup] = React.useState();
    const [currentID, setCurrentID] = React.useState();


    React.useEffect(() => {
        setCurrentID(id)
    }, [])

    function currentElementSelected(user)
    {
        if (currentID)
            return (user.id.toString() === currentID.toString())
    }

    function handleCurrentFriend(user)
    {
        setCurrentID(user.id)
        props.getElement(user)
    }

    function handleCurrentGroup(p)
    {
        setCurrentGroup(p.id);
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

    React.useEffect(() => {
        if (props.friends)
        {     
            setFriendsList(
                props.friends.map(user => (
                    <FriendElement 
                        key={user.id}
                        id={user.id}
                        username={user.username}
                        avatar={user.avatar}
                        userStatus={user.userStatus}
                        selected={currentElementSelected(user)}
                        click={() => handleCurrentFriend(user)}
                    />
                ))
            )
        }
    }, [props.friends, currentID])


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
            />
        </div>
    )
}