import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";

import Banner from "../components/Banner/Banner";
import Profile from "../Profile/Profile";
import Messenger from "../components/Messenger/Messenger";

import { useChannelsContext, useChatSocket, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";
import { blockUserRequest, unblockUserRequest } from "../../../requests/block";
import RemoveView from "../components/RemoveElement.tsx/RemoveView";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";
import './Interface.css'
import { useBlock } from "../../../hooks/Chat/useBlock";
import { ConfirmPage, ConfirmView } from "../Profile/ChannelProfile/ConfirmAction";
import { createChannel, getChannel, getWhisperChannel } from "../../../requests/chat";
import { useChannels } from "../../../hooks/Chat/useChannels";
import { convertTypeAcquisitionFromJson } from "typescript";
import useFetchUsers from "../../../hooks/useFetchUsers";
import useBanUser from "../../../hooks/Chat/useBanUser";
import useMembers from "../../../hooks/Chat/useMembers";


export const InterfaceContext: React.Context<any> = createContext(null);

export default function Interface() {
    const p: any = useParams();
    const navigate = useNavigate();

    const [params, setParams] = useState(p);

    const { token, user }: any = useCurrentUser();
    const { addChannel } = useChannels();
    const { isUserBlocked } = useBlock();

    const { friends, friendsDispatch, currentFriend, setCurrentFriend }: any = useFriendsContext();
    const { currentChannel, setCurrentChannel, channels } = useChannelsContext();

    const [blockedFriend, setBlockedFriend]: [any, any] = React.useState(false);
    const { fetchUser } = useFetchUsers();

    const [profile, setProfile] = useState(false);
    const { isUserMember } = useMembers();

    const [whisperUser, setWhisperUser] = useState();

    const selectWhisper = useCallback(async (_user: any) => {
        let channel;
        if (channels && channels.length) {
            channel = channels.find((c: any) =>
                c.type === "WHISPER" && c.members.find((id: number) => _user.id === id))
        }
        if (!channel) {
            await getWhisperChannel(user.id, _user.id)
                .then(res => {
                    if (res.data) {
                        channel = res.data
                    }
                })
            await addChannel(channel, false);
        }
        return (channel);
    }, [channels]);

    const loadChannel = useCallback(async () => {
        let channel = channels.find((c: any) => c.name === params.channelName);
        if (!channel) {
            await getChannel(params.channelId)
                .then(res => {
                    if (res.data)
                        channel = res.data;
                })
        }
        return (channel);
    }, [user]);

    function isCurrentUserMember(channel: any) {
        if (channel && channel.members && !channel.members.find((id: number) => id === user.id))
            return (false);
        return (true);
    }

    const loadInterface = useCallback(async () => {
        if (params.channelId) {
            let channel = await loadChannel();
            if (!isCurrentUserMember(channel))
                channel = null;
            if (channel)
                return (setCurrentChannel(channel));
        }
        else if (params.userId) {
            const user = await fetchUser(params.userId);
            setWhisperUser(user);
            let channel = await selectWhisper(user);
            if (!isCurrentUserMember(channel))
                channel = null;
            if (channel)
                return (setCurrentChannel(channel));
            return;
        }
        navigate("/chat")
    }, [channels, friends]);


    useEffect(() => {
        loadInterface();
    }, [channels, friends, params])

    // update current friend selected when he is picked from MenuElement

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
                            type={currentChannel && currentChannel.type}
                            invitation={() => { }}
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