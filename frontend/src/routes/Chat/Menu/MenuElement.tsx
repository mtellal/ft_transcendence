
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserLabel from "../../../components/users/UserLabel";
import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";

import { FriendRequests } from "../components/FriendRequests";
import { ChannelLabel } from "../../../components/channels/ChannelInfos";
import SearchElement from "./Search/SearchElement";
import { Channel, User } from "../../../types";

import plusIcon from '../../../assets/Plus.svg'
import { MenuCollectionChannel, MenuCollectionElement } from "./MenuCollection/MenuCollection";
import './MenuElement.css'

export default function MenuElement() {

    const { user } = useCurrentUser();
    const { friends } = useFriendsContext();
    const { channels } = useChannelsContext();

    function extractLastMessage(channel: Channel) {
        if (channel.messages && channel.messages.length) {
            for (let i = channel.messages.length - 1; i >= 0; i--) {
                if (channel.messages[i].type === "MESSAGE")
                    return (channel.messages[i].content)
            }
        }
    }

    const getWhispers = useCallback(() => {
        if (channels && channels.length && user) {
            let whispers = channels.map((channel: Channel) => {
                if (channel.type === "WHISPER" && channel.members.length === 2) {
                    const _friend = channel.users.find((f: User) => f.id !== user.id);
                    if (!_friend)
                        return (null);
                    return (
                        <UserLabel
                            key={'user' + _friend.id}
                            id={_friend.id}
                            user={_friend}
                            message={extractLastMessage(channel)}
                        />
                    )
                }
                else if (channel.messages && channel.messages.length) {
                    return (
                        <ChannelLabel
                            key={'channel' + channel.id}
                            channel={channel}
                            message={extractLastMessage(channel)}
                        />
                    )
                }
            })
            whispers = whispers.filter((c: Channel) => c);
            return (whispers);
        }
    }, [channels, user]);


    const getChannels = useCallback(() => {
        let c: Channel[] = channels.map((channel: Channel) =>
            channel.type !== "WHISPER" ?
                <ChannelLabel
                    key={'channel' + channel.id}
                    channel={channel}
                /> : null
        )
        c = c.filter((c: Channel) => c)
        return (c);
    }, [channels]);


    return (
        <div className="menu-container">
            <SearchElement
            />
            <FriendRequests />
            <MenuCollectionElement
                title="Messages"
                collection={getWhispers()}
                borderTop={true}
            />
            <MenuCollectionElement
                title="Friends"
                collection={
                    friends.map((user: User) => (
                        <UserLabel
                            key={user.id}
                            id={user.id}
                            user={user}
                        />
                    ))
                }
            />
            <MenuCollectionChannel
                title="Channels"
                collection={getChannels()}
                icon={plusIcon}
            />
        </div>
    )
}


