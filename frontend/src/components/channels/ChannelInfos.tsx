import React, { useCallback, useEffect, useState } from "react";

import { useChannelsContext } from "../../hooks/Hooks";
import ProfilePicture from "../../components/users/ProfilePicture";

import './ChannelInfos.css'
import { Channel } from "../../types";
import { NavLink, useParams } from "react-router-dom";
import Icon from "../Icon";

import shield from '../../assets/ShieldCheck.svg';
import stopIcon from '../../assets/stop.svg'

import { useChannels } from "../../hooks/Chat/useChannels";


type TChannelInfos = {
    channel: Channel,
    message?: string
}

export default function ChannelInfos(props: TChannelInfos) {

    const { isChannelProtected, isChannelPrivate } = useChannels();

    return (
        <div className="channelinfos-container" >
            <div className="channelinfos-infos flex-column" >
                <p className="channelinfos-infos-username">{props.channel && props.channel.name}</p>
                <div className="flex">
                    <p className="channelinfos-infos-username-status reset">{props.channel && props.channel.members.length} members</p>
                    {
                        isChannelProtected(props.channel) && 
                        <img src={shield} style={{ paddingLeft: '5px', height: '20px', width: '20px' }} />
                    }
                     {
                        isChannelPrivate(props.channel) && 
                        <img src={stopIcon} style={{ paddingLeft: '5px', height: '20px', width: '20px' }} />
                    }
                </div>
            </div>
            <div className="flex-column">
                <div className="channelinfos-members-container" >
                    {
                        props.channel && props.channel.users && props.channel.users.length &&
                        props.channel.users.map((user: any) => user &&
                            <div key={user.id} className="channelinfos-pp-container">
                                <ProfilePicture image={user.url} />
                            </div>
                        )
                    }
                </div>
                {
                    props.message &&
                    <p className="channelinfos-infos-message">
                        {props.message}
                    </p>
                }
            </div>
        </div>
    )
}


type TChannelLabel = {
    channel: Channel,
    notifs?: number,
    onClick?: () => {} | any,
    message?: string
}

export function ChannelLabel(props: TChannelLabel) {

    const { channelId } = useParams();

    return (
        <NavLink to={`/chat/channel/${props.channel && props.channel.id}`}
            className="channel-label"
            style={props.channel && Number(channelId) === props.channel.id ? { backgroundColor: '#fff3e6' } : {}}
            onClick={props.onClick && props.onClick}
        >
            <ChannelInfos {...props} />
        </NavLink>
    )
}