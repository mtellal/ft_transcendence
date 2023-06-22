import React from "react"

import { useChannelsContext } from "../../../hooks/Hooks"
import ChannelProfile from "./ChannelProfile/ChannelProfile";
import './Profile.css'


export default function Profile() {
    const { currentChannel } = useChannelsContext();

    return (
        <div className="scroll">
            {
                currentChannel && currentChannel.users && currentChannel.type !== "WHISPER" &&
                <ChannelProfile
                    name={currentChannel && currentChannel.name}
                    members={currentChannel && currentChannel.users}
                    administrators={currentChannel && currentChannel.administrators}
                    owner={currentChannel && currentChannel.owner}
                    channel={currentChannel}
                />
            }
        </div>
    )
}
