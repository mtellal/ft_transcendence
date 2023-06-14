import React, { useCallback, useEffect, useState } from "react";

import { useChannelsContext, useCurrentUser } from "../../hooks/Hooks";
import ProfilePicture from "../../components/users/ProfilePicture";

import './ChannelInfos.css'
import { RawIcon } from "../Icon";

type TChannelInfos = {
    channel: any,
}

export default function ChannelInfos(props: TChannelInfos) {

    const {channels } = useChannelsContext();

    const [renderMembersPP, setRenderMembersPP] = useState([]);

    const loadMembers = useCallback(async () => {
        if (props.channel.users && props.channel.users.length) {
            setRenderMembersPP(
                props.channel.users.map((user: any) =>
                    <div key={user.id} className="channelinfos-pp-container">
                        <ProfilePicture image={user.url} />
                    </div>
                )
            );
        }
    }, [props.channel, channels])

    useEffect(() => {
        loadMembers();
    }, [props.channel, channels])


    return (
        <div className="flex-center">
            <h2 style={{ whiteSpace: 'nowrap' }}>{props.channel && props.channel.name} - </h2>
            {props.channel.type === "PROTECTED" && <RawIcon icon="shield" />}
            {props.channel.type === "PRIVATE" && <RawIcon icon="lock" />}
            <div className="flex-center channelinfos-members-container">
                {renderMembersPP}
            </div>
        </div>
    )
}
