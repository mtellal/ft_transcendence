
import React, { useCallback, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

import UserLabel from "../../../components/users/UserLabel";
import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";

import useFetchUsers from "../../../hooks/useFetchUsers";
import { FriendRequests } from "../components/FriendRequests/FriendRequests";
import ChannelInfos from "../../../components/channels/ChannelInfos";
import SearchElement from "./SearchElement";
import './MenuElement.css'
import { Channel, User } from "../../../types";
import Icon from "../../../components/Icon";

import edit from '../../../assets/Edit.png'
import join from '../../../assets/Login.png'

import arrowTop from '../../../assets/arrowTop.svg'
import arrowBot from '../../../assets/arrowBot.svg'
import ProfilePicture from "../../../components/users/ProfilePicture";


export default function MenuElement() {

    const navigate = useNavigate();

    const { user } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
    const { friends } = useFriendsContext();
    const { channels } = useChannelsContext();

    const [friendsList, setFriendsList] = React.useState([]);
    const [channelsList, setChannelsList] = useState([]);
    const [whispersList, setWhispersList] = useState([]);

    const setWhispers = useCallback(async () => {
        if (channels && channels.length) {
            const whispers = await Promise.all(
                channels.map(async (channel: Channel) => {
                    if (channel.type === "WHISPER" && channel.members.length === 2) {
                        const _userId = channel.members.find((id: number) => id !== user.id);
                        const _user = await fetchUser(_userId);
                        return (
                            <UserLabel
                                key={_user.id}
                                id={_user.id}
                                user={_user}
                                onClick={() => { }}
                                notifs={_user.notifs}
                                message={
                                    channel.messages && channel.messages.length && 
                                    channel.messages[channel.messages.length - 1].content
                                }
                            />
                        )
                    }
                })
            )
            setWhispersList(whispers)
        }
    }, [channels]);

    async function setFriendsLabel() {
        setFriendsList(
            friends.map((user: User) => (
                <UserLabel
                    key={user.id}
                    id={user.id}
                    user={user}
                    onClick={() => { }}
                    disable={true}
                />
            ))
        )
    }

    React.useEffect(() => {
        setChannelsList([]);
        setFriendsList([]);

        if (channels && channels.length) {
            setWhispers();

            setChannelsList(
                channels.filter((channel: Channel) =>
                    channel.type !== "WHISPER" && (
                        <div
                            key={channel.id}
                            className="pointer"
                            style={{ borderTop: '1px solid black' }}
                            onClick={() => {
                                navigate(`/chat/channel/${channel.id}`)
                            }}
                        >
                            <ChannelInfos
                                key={channel.id}
                                channel={channel}
                            />
                        </div>
                    ))
            )
        }

        if (friends && friends.length) {
            setFriendsLabel();
        }

    }, [friends, channels])

    console.log(channelsList)

    return (
        <div className="menu-container">
            <SearchElement 
            />
            <FriendRequests />
            <MenuCollectionElement
                title="Messages"
                collection={whispersList}
                borderTop={true}
            />
            <MenuCollectionElement
                title="Friends"
                collection={friendsList}
            />
            <MenuCollectionElement
                title="Channels"
                collection={channelsList}
            />
        </div>
    )
}



type TCollectionElement = {
    title: string,
    collection: any[],
    borderTop?: boolean,
}

export function MenuCollectionElement(props: TCollectionElement) {
    const [show, setShow] = useState(props.title === "Messages");
    return (
        <div className="menu-collection">
            <div className="menu-collection-label pointer"
                onClick={() => setShow((p: boolean) => !p)}
            >
                <h2 className="reset menu-collection-title">{props.title}</h2>
                <p className="menu-collection-length"
                    style={{}}
                >{props.collection && props.collection.length}</p>
                <div className="flex" style={{ marginLeft: 'auto' }}>
                    <img src={show ? arrowBot : arrowTop} style={{ marginLeft: '10px' }} />
                </div>
            </div>
            {
                show &&
                <div className="flex-column">
                    {props.collection}
                </div>
            }
        </div>
    )
}