import React, { useCallback, useEffect, useState } from "react";

import { useChannels, useCurrentUser } from "../../hooks/Hooks";
import { getUserProfilePictrue } from "../../requests/user";
import ProfilePicture from "../../components/users/ProfilePicture";

import './ChannelInfos.css'

type TChannelInfos = {
    name: string
}

export default function ChannelInfos(props: TChannelInfos) {

    const { user, image } = useCurrentUser();
    const { currentChannel, getMembers } = useChannels();

    const [renderMembersPP, setRenderMembersPP] = useState([]);

    const loadMembers = useCallback(async () => {
        let members = getMembers(currentChannel.id);
        if (members && members.length) {
            members = members.map((u: any) => u.id);
            members = await Promise.all(members.map(async (id: number) =>
            await getUserProfilePictrue(id).
            then(res => window.URL.createObjectURL(new Blob([res.data])))
            ))
            setRenderMembersPP(
                members.map((url: string) =>
                    <div key={url} className="channelinfos-pp-container">
                        <ProfilePicture image={url} />
                    </div>
                )
            );
        }
    }, [currentChannel])

    useEffect(() => {
        setRenderMembersPP([])
        if (currentChannel) {
            loadMembers();
        }
    }, [currentChannel])

    return (
        <div className="flex-center">
            <h2 style={{ whiteSpace: 'nowrap' }}>{props.name} - </h2>
            <div className="flex-center channelinfos-members-container">
                {renderMembersPP}
            </div>
        </div>
    )
}
