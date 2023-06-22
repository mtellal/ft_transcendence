import React, { useCallback, useEffect, useState } from "react";

import { useChannelsContext, useCurrentUser } from "../../hooks/Hooks";
import ProfilePicture from "../../components/users/ProfilePicture";

import './ChannelInfos.css'
import { RawIcon } from "../Icon";
import { Channel } from "../../types";

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
        <div className="flex-center" style={{ height: '50px' }}>
            <p style={{ whiteSpace: 'nowrap', fontSize: 'large', fontWeight: '400' }}>{props.channel && props.channel.name} - </p>
            {props.channel && props.channel.type === "PROTECTED" && <RawIcon icon="shield" />}
            {props.channel && props.channel.type === "PRIVATE" && <RawIcon icon="lock" />}
            <div className="flex-ai channelinfos-members-container">
                {renderMembersPP}
            </div>
        </div>
    )
}
