import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import './Profile.css'
import { useChannelsContext, useFriends, useCurrentUser, useChatSocket } from "../../../hooks/Hooks"
import ChannelProfile from "./ChannelProfile/ChannelProfile";


function FriendProfile(props: any) {
    return (
        <div className="reset flex-column profilepage">
            <h2>Historic</h2>
            <h2>Stats</h2>
        </div>
    )
}

export default function Profile() {
    const { currentFriend } = useFriends();
    const { currentChannel } = useChannelsContext();

    return (
        <div className="scroll">
            {
                currentChannel && currentChannel.users && currentChannel.type !== "WHISPER" &&
                <ChannelProfile
                    name={currentChannel && currentChannel.name}
                    members={currentChannel && currentChannel.users}
                    channel={currentChannel}
                />
            }
            {
                currentChannel && currentChannel.users && currentChannel.type === "WHISPER" &&
                <FriendProfile
                    currentFriend={currentFriend}
                />
            }
        </div>
    )
}
