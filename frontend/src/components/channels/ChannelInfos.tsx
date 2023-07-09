import React, { useCallback, useEffect, useState } from "react";

import { useChannelsContext } from "../../hooks/Hooks";
import ProfilePicture from "../../components/users/ProfilePicture";

import './ChannelInfos.css'
import { Channel } from "../../types";
import { NavLink, useNavigate, useParams } from "react-router-dom";

type TChannelInfos = {
    channel: Channel,
    message?: string
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
            <div className="flex-column">
                <div className="flex-ai channelinfos-members-container"
                    style={{ flexShrink: '0', height: '30px', overflow: 'hiddern' }}
                >
                    {renderMembersPP}
                </div>
                {
                    props.message &&
                    <p className=" reset userinfos-status" style={{paddingTop: '2px'}}>
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
            className="user-label"
            style={props.channel && Number(channelId) === props.channel.id ? { backgroundColor: '#fff3e6' } : {}}
            onClick={props.onClick && props.onClick}
        >
            <ChannelInfos {...props} />
        </NavLink>
    )
}