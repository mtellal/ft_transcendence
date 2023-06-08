
import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useOutlet, useOutletContext, useParams } from "react-router-dom";

import UserLabel from "../../../../components/users/UserLabel";
import { useChannelsContext, useFriends, useCurrentUser } from "../../../../hooks/Hooks";
import { createChannel } from "../../../../requests/chat";
import { useWindow } from "../../../../hooks/useWindow";

import './MenuElement.css'

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

    const location = useLocation();

    const { token } = useCurrentUser();
    const { friends, friendsDispatch, setCurrentFriend } = useFriends();
    const {
        channels,
        setCurrentChannel,
        addChannel,
        currentChannel
    } = useChannelsContext();

    const [friendsList, setFriendsList] = React.useState([]);
    const [channelsList, setChannelsList] = useState([]);

    const { isMobileDisplay } = useWindow();
    const [hideMenu, setHideMenu] = useState(true);

    useEffect(() => {
        if (location && location.pathname === "/chat" && isMobileDisplay)
            setHideMenu(false)
        else
            setHideMenu(true)
    },)


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
        setChannelsList([]);
        setFriendsList([]);

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

    }, [friends, channels])

    return (
        <div
            className={hideMenu ? "menu-container hidden" : "menu-container visible"}
        >
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