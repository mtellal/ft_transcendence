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
import { useChannels } from "../../../hooks/Chat/useChannels";

export const InterfaceContext: React.Context<any> = createContext(null);

export default function Interface() {
    const params: any = useParams();

    const { fetchUser } = useFetchUsers();
    const { user, token }: any = useCurrentUser();
    const { isUserBlocked } = useBlock();
    const { friends }: any = useFriendsContext();
    const { selectWhisperChannel, createWhisperChannel } = useChannels();

    const [currentChannel, setCurrentChannel]: any = useState(null);

    const { channels, channelsLoaded } = useChannelsContext();

    const [blockedFriend, setBlockedFriend]: [any, any] = useState(false);

    const [profile, setProfile] = useState(false);

    const [whisperUser, setWhisperUser] = useState();


    const isCurrentUserMember = useCallback((channel: Channel) => {
        if (user && channel && channel.members && channel.members.find((id: number) => id === user.id))
            return (true);
        return (false);
    }, [user]);

    const loadInterface = useCallback(async () => {
        let channel;
        if (params.channelId) {
            setWhisperUser(null);
            if (channelsLoaded)
                channel = channels.find((c: Channel) => c.id === Number(params.channelId));
            if (isCurrentUserMember(channel))
                return (setCurrentChannel(channel));
        }
        else if (params.userId) {
            const user = await fetchUser(params.userId);
            setWhisperUser(user);
            if (user && channelsLoaded) {
                channel = await selectWhisperChannel(user);
                if (!channel)
                {
                    channel = await createWhisperChannel(Number(params.userId));
                    if (channel)
                        setCurrentChannel(channel)
                }
                else if (isCurrentUserMember(channel))
                    return (setCurrentChannel(channel));
            }
            return;
        }
    }, [channels, friends, channelsLoaded, params]);

    console.log(currentChannel)

    useEffect(() => {
        loadInterface();
    }, [channels, friends, params])


    React.useEffect(() => {
        setProfile(false);
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
                        {profile && <Profile channel={currentChannel} />}

                        <Messenger
                            whisperUser={whisperUser}
                            channel={currentChannel}
                            blockedFriend={blockedFriend}
                            hidden={profile}
                        />
                    </div>
                    :
                    <div className="interface-container flex-center">
                        <p>No conversation found</p>
                    </div>
            }
        </ >
    )
}