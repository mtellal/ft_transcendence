import React from "react"

import { useChannelsContext } from "../../../hooks/Hooks"
import ChannelProfile from "./ChannelProfile/ChannelProfile";
import './Profile.css'
import { Channel } from "../../../types";

type TProfile = {
    channel: Channel
}

export default function Profile(props: TProfile) {

    return (
        <div className="scroll fill">
            {
                props.channel && props.channel.users && props.channel.type !== "WHISPER" &&
                <ChannelProfile
                    name={props.channel && props.channel.name}
                    members={props.channel && props.channel.users}
                    administrators={props.channel && props.channel.administrators}
                    owner={props.channel && props.channel.ownerId}
                    channel={props.channel}
                />
            }
        </div>
    )
}
