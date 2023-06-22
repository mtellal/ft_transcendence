
import React, { useCallback, useState } from "react";
import {  useNavigate } from "react-router-dom";

import UserLabel from "../../../components/users/UserLabel";
import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";

import useFetchUsers from "../../../hooks/useFetchUsers";
import { FriendRequests } from "../components/FriendRequests/FriendRequests";
import ChannelInfos from "../../../components/channels/ChannelInfos";
import { CollectionElement } from "../../../components/collections/CollectionElement";
import SearchElement from "./SearchElement";
import './MenuElement.css'



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
                channels.map(async (channel: any) => {
                    if (channel.type === "WHISPER" && channel.members.length === 2) {
                        let _user = channel.members.find((id: number) => id !== user.id);
                        _user = await fetchUser(_user);
                        return (
                            <UserLabel
                                key={_user.id}
                                id={_user.id}
                                user={_user}
                                onClick={() => {}}
                                notifs={_user.notifs}
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
            friends.map((user: any) => (
                <UserLabel
                    key={user.id}
                    id={user.id}
                    user={user}
                    onClick={() => {}}
                    notifs={user.notifs}
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
                channels.map((channel: any) =>
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

    return (
        <div className="menu-container fill">
            <SearchElement />
            <FriendRequests />
            <CollectionElement
                title="Channels"
                collection={channelsList}
                add={true}
            />
            <CollectionElement
                title="Whispers"
                collection={whispersList}
            />
            <CollectionElement
                title="Friends"
                collection={friendsList}
            />
        </div>
    )
}


