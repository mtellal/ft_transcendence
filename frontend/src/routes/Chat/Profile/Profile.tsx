import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import './Profile.css'
import { useChannelsContext, useFriendsContext, useCurrentUser, useChatSocket } from "../../../hooks/Hooks"
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
    const { currentFriend } = useFriendsContext();
    const { currentChannel } = useChannelsContext();

    console.log("CURRENT CHANNEL => ", currentChannel)

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
            {
                currentChannel && currentChannel.users && currentChannel.type === "WHISPER" &&
                <FriendProfile
                    currentFriend={currentFriend}
                />
            }
        </div>
    )
}
