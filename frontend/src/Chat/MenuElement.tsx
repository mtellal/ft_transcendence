
import React from "react";
import { Link, useParams } from "react-router-dom";

import FriendElement from "../Components/FriendElement";
import './MenuElement.css'

function CollectionElement(props : any)
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

function GroupElement(props : any)
{
    return (
        <Link to={`/chat/groups/${props.name}`} className="group hover-fill-grey"
            style={props.selected ? {backgroundColor:'#F4F4F4'} : {}}
            onClick={() => props.click(props)}
        >
            <p className="group-name">{props.name}</p>
            <p className="group-separator">-</p>
            <p className="group-members">{props.members} members</p>
        </Link>
    )
}


/*
    2 setCurrentxxxxx in parent and child === bad approach
    1 setXXX in parent and called in child (parent will be updated as child)
*/

export default function MenuElement({...props})
{    
    const [friendsList, setFriendsList] = React.useState();

    React.useEffect(() => {
        if (props.friends)
        {     
            setFriendsList(
                props.friends.map((user : any) => (
                    <FriendElement 
                        key={user.id}
                        id={user.id}
                        username={user.username}
                        avatar={user.avatar}
                        userStatus={user.userStatus}
                        click={(user : any) => props.setCurrentElement(user)}
                    />
                ))
            )
        }
    }, [props.friends])


    return (
        <div className="menu-container">
            <CollectionElement
                title="Groups"
                collection={null}
                addClick={props.addGroup}
            />
            <CollectionElement
                title="Friends"
                collection={friendsList}
            />
        </div>
    )
}