import React, { useCallback, useEffect, useState } from "react";

import { useChannelsContext, useCurrentUser } from "../../hooks/Hooks";
import { getUserProfilePictrue } from "../../requests/user";
import ProfilePicture from "../../components/users/ProfilePicture";

import './ChannelInfos.css'

type TChannelInfos = {
    channel: any,
}

export default function ChannelInfos(props: TChannelInfos) {

    const {getMembers, channels } = useChannelsContext();

    const [renderMembersPP, setRenderMembersPP] = useState([]);

    const loadMembers = useCallback(async () => {
        let members = getMembers(props.channel.id);
        if (members && members.length) {
            setRenderMembersPP(
                members.map((user: any) =>
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
            <div className="flex-center channelinfos-members-container">
                {renderMembersPP}
            </div>
        </div>
    )
}
