
import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import UserLabel from "../../../../components/users/UserLabel";
import './MenuElement.css'
import { useChannels, useChatSocket, useFriends, useCurrentUser } from "../../../../hooks/Hooks";
import { createChannel, removeChannel } from "../../../../requests/chat";

/*
    tittle
    add => {
        removeNotif
        notification
    }
    collection
*/

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

    const { token } = useCurrentUser();
    const { friends, friendsDispatch, setCurrentFriend } = useFriends();
    const { 
        channels, 
        channelsDispatch, 
        joinChannel, 
        setCurrentChannel,
        addChannel 
    } = useChannels();

    const [friendsList, setFriendsList] = React.useState([]);
    const [channelsList, setChannelsList] = useState([]);

    const selectCurrentChannel = useCallback(async (element: any, type: string) => {
        let channelSelected: any;
        if (type == "friend") {
            friendsDispatch({ type: 'removeNotif', friend: element });
            if (channels.length) {
                channelSelected = channels.find((c: any) =>
                    c.type === "WHISPER" && c.members.find((id: number) => element.id === id)
                )
            }
            if (!channelSelected) {
                console.log("channel not found and created")
                await createChannel({
                    name: "privateMessage",
                    type: "WHISPER",
                    members: [
                        element.id
                    ],
                }, token)
                    .then(res => {
                        channelSelected = res.data
                    })
                //channelsDispatch({ type: 'addChannel', channel: channelSelected });
                addChannel(channelSelected);
            }
            setCurrentFriend(element);
        }
        else
            channelSelected = element;
        //joinChannel(channelSelected);
        setCurrentChannel(channelSelected);
    }, [channels, friends])

    React.useEffect(() => {
        if (friends && friends.length) {
            setFriendsList(
                friends.map((user: any) => (
                    <UserLabel
                        key={user.id}
                        id={user.id}
                        username={user.username}
                        profilePictureURL={user.url}
                        userStatus={user.userStatus}
                        onClick={() => selectCurrentChannel(user, "friend")}
                        notifs={user.notifs}
                    />
                ))
            )
        }
        else
            setFriendsList([]);
    }, [friends])


    useEffect(() => {
        if (channels && channels.length) {
            setChannelsList(
                channels.map((channel: any) =>
                    channel.type !== "WHISPER" && (
                        <ChannelElement
                            key={channel.id}
                            id={channel.id}
                            name={channel.name}
                            nbMembers={channel.members.length}
                            click={() => selectCurrentChannel(channel, "channel")}
                            notifs={0}
                        />
                    ))
            )
        }
        else
            setChannelsList([]);
    }, [channels])

    return (
        <div className="menu-container">
            <CollectionElement
                title="Groups"
                collection={channelsList}
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