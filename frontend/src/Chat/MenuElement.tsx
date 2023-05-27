
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import FriendElement from "../Components/FriendElement";
import './MenuElement.css'
import { useChannels, useConversations } from "../Hooks";

export function CollectionElement(props: any) {
    return (
        <div className="collection">
            <div className="collection-label">
                <h2 className="collection-title">{props.title}</h2>
                {
                    props.add ?
                        <Link
                            to={`/chat/add-${props.title.toLowerCase().slice(0, -1)}`}
                            className="collection-add"
                            onClick={props.removeNotif}
                        >
                            {
                                props.notification ?
                                    <div
                                        className="collection-element-notif"
                                    >

                                    </div> : null
                            }
                            {
                                props.title === "Friends" ?
                                    <span className="material-symbols-outlined">
                                        person_add
                                    </span>
                                    :
                                    <span className="material-symbols-outlined">
                                        group_add
                                    </span>
                            }
                        </Link>
                        : null
                }
            </div>
            <div className="flex-column">
                {props.collection}
            </div>
        </div>
    )
}

/*
key={channel.id}
                        id={channel.id}
                        username={channel.name}
                        avatar={null}
                        userStatus={"OFFLINE"}
                        click={(user: any) => props.setCurrentElement(user)}
                        notifs={0}
    */

function ChannelElement(props: any) {
    return (
        <Link to={`/chat/groups/${props.name}`} className="group hover-fill-grey"
            style={props.selected ? { backgroundColor: '#F4F4F4' } : {}}
            onClick={() => props.click(props)}
        >
            <p>{props.name}</p>
            <p className="group-separator">-</p>
            <p className="group-members">{props.nbMembers} members</p>
        </Link>
    )
}


/*
    2 setCurrentxxxxx in parent and child === bad approach
    1 setXXX in parent and called in child (parent will be updated as child)
*/

export default function MenuElement({ ...props }) {
    const [friendsList, setFriendsList] = React.useState([]);
    const [channelsList, setChannelsList] = useState([]);
    const [conversations, conversationsDispatch] = useConversations();

    React.useEffect(() => {
        if (props.friends && props.friends.length) {
            setFriendsList(
                props.friends.map((user: any) => (
                    <FriendElement
                        key={user.id}
                        id={user.id}
                        username={user.username}
                        avatar={user.avatar}
                        userStatus={user.userStatus}
                        click={(user: any) => props.setCurrentElement(user, "friend")}
                        notifs={user.notifs}
                    />
                ))
            )
        }
        else
            setFriendsList([]);
    }, [props.friends])


    useEffect(() => {
        if (props.channels && props.channels.length) {
            setChannelsList(
                props.channels.map((channel: any) => (
                    <ChannelElement
                        key={channel.id}
                        id={channel.id}
                        name={channel.name}
                        nbMembers={channel.members.length}
                        click={(user: any) => props.setCurrentElement(user, "channel")}
                        notifs={0}
                    />
                ))
            )
        }
        else
            setChannelsList([]);
    }, [props.channels])

    return (
        <div className="menu-container">
            <CollectionElement
                title="Groups"
                collection={channelsList}
                addClick={props.addGroup}
                add={true}
            />
            <CollectionElement
                title="Friends"
                collection={friendsList}
                add={true}
                notification={props.notification}
                removeNotif={props.removeNotif}
            />
        </div>
    )
}