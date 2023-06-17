
import React, { useCallback, useContext, useEffect, useState, createContext} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import UserLabel from "../../../../components/users/UserLabel";
import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../../hooks/Hooks";
import { createChannel, getChannel, getChannelByName, getChannels, getWhisperChannel } from "../../../../requests/chat";
import { useWindow } from "../../../../hooks/useWindow";

import './MenuElement.css'
import Icon, { RawIcon } from "../../../../components/Icon";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import { getBlockList } from "../../../../requests/block";
import { getUserProfilePictrue } from "../../../../requests/user";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import ProfilePicture from "../../../../components/users/ProfilePicture";
import { useFriends } from "../../../../hooks/Chat/Friends/useFriends";
import { useBlock } from "../../../../hooks/Chat/useBlock";
import { ChatInterfaceContext } from "../../Chat/Chat";
import { useFriendRequest } from "../../../../hooks/Chat/Friends/useFriendRequest";
import { FriendRequests } from "../FriendRequests/FriendRequests";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import { ChannelSearchLabel } from "../ChannelSearchLabel/ChannelSearchLabel";
import { ConfirmView } from "../../Profile/ChannelProfile/ConfirmAction";
import { CollectionElement } from "../../../../components/collections/CollectionElement";
import SearchElement from "./SearchElement/SearchElement";



/*
    2 setCurrentxxxxx in parent and child === bad approach
    1 setXXX in parent and called in child (parent will be updated as child)
*/

export default function MenuElement() {

    const location = useLocation();
    const navigate = useNavigate();
    const { isMobileDisplay } = useWindow();

    const { user } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
    const { friends } = useFriendsContext();
    const { channels } = useChannelsContext();

    const [friendsList, setFriendsList] = React.useState([]);
    const [channelsList, setChannelsList] = useState([]);
    const [hideMenu, setHideMenu] = useState(true);
    const [whispersList, setWhispersList] = useState([]);


    useEffect(() => {
        if (location && location.pathname === "/chat" && isMobileDisplay)
            setHideMenu(false)
        else
            setHideMenu(true)
    })

    const setWhispers = useCallback(async () => {
        if (channels && channels.length) {
            const whispers = await Promise.all(
                channels.map(async (channel: any) => {
                    if (channel.type === "WHISPER" && channel.members.length === 2) {
                        let _user = channel.members.find((id: number) => id !== user.id);
                        console.log(_user)
                        _user = await fetchUser(_user);
                        return (
                            <UserLabel
                                key={_user.id}
                                id={_user.id}
                                username={_user.username}
                                profilePictureURL={_user.url}
                                userStatus={_user.userStatus}
                                onClick={() => { }}
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
                    username={user.username}
                    profilePictureURL={user.url}
                    userStatus={user.userStatus}
                    onClick={() => { }}
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
                            onClick={() => navigate(`/chat/channel/${channel.id}`)}
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
        <div
            className={hideMenu ? "menu-container hidden" : "menu-container visible"}
        >

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
                friend={true}
            />
        </div>
    )
}


