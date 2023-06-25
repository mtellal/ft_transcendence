import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Banner from "../components/Banner/Banner";
import Profile from "../Profile/Profile";
import Messenger from "../Messenger/Messenger";

import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";

import { useBlock } from "../../../hooks/Chat/useBlock";
import useFetchUsers from "../../../hooks/useFetchUsers";

import './Interface.css'
import { Channel, User } from "../../../types";

export const InterfaceContext: React.Context<any> = createContext(null);

export default function Interface() {
    const params:any = useParams();

    const { fetchUser } = useFetchUsers();
    const { user }: any = useCurrentUser();
    const { isUserBlocked } = useBlock();
    const { friends }: any = useFriendsContext();

    const { currentChannel, setCurrentChannel, channels } = useChannelsContext();

    const [blockedFriend, setBlockedFriend]: [any, any] = React.useState(false);

    const [profile, setProfile] = useState(false);

    const [whisperUser, setWhisperUser] = useState();

    const selectWhisper = useCallback(async (_user: User) => {
        let channel;
        if (channels && channels.length && _user) {
            channel = channels.find((c: Channel) => 
                c && c.type === "WHISPER" && c.members.find((id: number) => _user.id === id))
        }
        return (channel);
    }, [channels]);

    const isCurrentUserMember = useCallback((channel: Channel) => {
        if (user && channel && channel.members && channel.members.find((id: number) => id === user.id))
            return (true);
        return (false);
    }, [user]);

    const loadInterface = useCallback(async () => {
        if (params.channelId) {
            setWhisperUser(null);
            let channel;
            if (channels && channels.length)
                channel = channels.find((c: Channel) => c.id === Number(params.channelId));
            if (isCurrentUserMember(channel))
                return (setCurrentChannel(channel));
        }
        else if (params.userId) {
            const user = await fetchUser(params.userId);
            setWhisperUser(user);
            let channel;
            if (user)
                channel = await selectWhisper(user);
            if (isCurrentUserMember(channel))
                return (setCurrentChannel(channel));
            return;
        }
    }, [channels, friends]);

 
    useEffect(() => {
        loadInterface();
    }, [channels, friends, params])


    React.useEffect(() => {
        if (whisperUser && user && currentChannel && currentChannel.type === "WHISPER") {
            if (isUserBlocked(whisperUser))
                setBlockedFriend(true);
        }
        else {
            setBlockedFriend(false)
        }
    }, [whisperUser, user, currentChannel])


    return (
        <>
            {
                currentChannel ?
                    <div className={"flex-column relative interface-container visible"}>
                        <Banner
                            whisperUser={whisperUser}
                            channel={currentChannel}
                            type={currentChannel.type}
                            profile={() => setProfile((p: boolean) => !p)}
                            setBlockedFriend={setBlockedFriend}
                        />
                        {profile && <Profile />}

                        <Messenger
                            whisperUser={whisperUser}
                            blockedFriend={blockedFriend}
                            hidden={profile}
                        />
                    </div>
                    :
                    <div className="fill flex-center">
                        <p>No conversation found</p>
                    </div>
            }
        </ >
    )
}