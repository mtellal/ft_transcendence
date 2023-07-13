
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import UserLabel from "../../../components/users/UserLabel";
import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";

import { FriendRequests } from "../components/FriendRequests/FriendRequests";
import { ChannelLabel } from "../../../components/channels/ChannelInfos";
import SearchElement from "./SearchElement";
import './MenuElement.css'
import { Channel, User } from "../../../types";
import Icon from "../../../components/Icon";


import arrowTop from '../../../assets/arrowTop.svg'
import arrowBot from '../../../assets/arrowBot.svg'

import plusIcon from '../../../assets/Plus.svg'
import joinIcon from '../../../assets/Login.svg'

export default function MenuElement() {

    const { user } = useCurrentUser();
    const { friends } = useFriendsContext();
    const { channels, channelsLoaded } = useChannelsContext();

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
                    ))}
            />
            <MenuCollectionChannel
                title="Channels"
                collection={getChannels()}
                icon={plusIcon}
            />
        </div>
    )
}



type TCollectionElement = {
    title: string,
    collection: any[],
    borderTop?: boolean,
    icon?: any
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

type TCollectionChannel = {
    title: string,
    collection: any[],
    borderTop?: boolean,
    icon?: any
}

export function MenuCollectionChannel(props: TCollectionChannel) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

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
                    <div className="flex " style={{ height: '30px', gap: '5px' }}>
                        <Icon
                            icon={plusIcon}
                            onClick={() => {
                                setShow((p: boolean) => !p);
                                navigate("/chat/channel/create")
                            }}
                        />
                        <Icon
                            icon={joinIcon}
                            onClick={() => {
                                setShow((p: boolean) => !p);
                                navigate("/chat/channel/join")
                            }}
                        />
                    </div>
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
