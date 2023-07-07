import React, { useCallback, useEffect, useState } from "react";

import { useChannelsContext } from "../../hooks/Hooks";
import ProfilePicture from "../../components/users/ProfilePicture";

import './ChannelInfos.css'
import { RawIcon } from "../Icon";
import { Channel } from "../../types";
import { NavLink, useNavigate, useParams } from "react-router-dom";

type TChannelInfos = {
    channel: Channel,
}

export default function ChannelInfos(props: TChannelInfos) {

    const { channels } = useChannelsContext();

    const [renderMembersPP, setRenderMembersPP] = useState([]);

    const loadMembers = useCallback(async () => {
        if (props.channel && props.channel.users && props.channel.users.length) {
            setRenderMembersPP(
                props.channel.users.map((user: any) => {
                    if (user) {
                        return (
                            <div key={user.id} className="channelinfos-pp-container">
                                <ProfilePicture image={user.url} />
                            </div>
                        )
                    }
                }
                )
            );
        }
    }, [props.channel, channels])

    useEffect(() => {
        loadMembers();
    }, [props.channel, channels])


    return (
        <div
            className="userinfos-container"
        >
            <div className="channelinfos-infos flex-column" style={{ paddingLeft: '5px', justifyContent: 'space-around' }}>
                <p className="userinfos-username">{props.channel && props.channel.name}</p>
                <p className="userinfos-status">{props.channel && props.channel.members.length} members</p>
            </div>
            <div className="flex-ai channelinfos-members-container"
                style={{flexShrink: '0'}}
            >
                {renderMembersPP}
            </div>
        </div>
    )
}


type TChannelLabel = {
    channel: Channel,
    notifs?: number,
    onClick?: () => {} | any
    disable?: boolean
}

export function ChannelLabel(props: TChannelLabel) {

    const { userId } = useParams();
    const [hover, setHover] = useState(false);

    return (
        <NavLink to={`/chat/channel/${props.channel && props.channel.id}`}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="user-label"
            style={props.channel && (Number(userId) === props.channel.id || hover) && !props.disable ? { backgroundColor: '#fff3e6' } : { backgroundColor: 'white' }}
            onClick={props.onClick && props.onClick}
        >
            <ChannelInfos {...props} />
        </NavLink>
    )
}