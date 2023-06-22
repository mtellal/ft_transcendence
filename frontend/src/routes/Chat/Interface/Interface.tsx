import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useOutletContext, useParams } from "react-router-dom";

import Banner from "../components/Banner/Banner";
import Profile from "../Profile/Profile";
import Messenger from "../Messenger/Messenger";

import { useChannelsContext, useChatSocket, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";
import { blockUserRequest, unblockUserRequest } from "../../../requests/block";
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
    const params:any = useParams();
    const navigate = useNavigate();

    const { token } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
    const { user }: any = useCurrentUser();
    const { addChannel } = useChannels();
    const { isUserBlocked } = useBlock();
    const { friends}: any = useFriendsContext();

    const { currentChannel, setCurrentChannel, channels } = useChannelsContext();

    const [blockedFriend, setBlockedFriend]: [any, any] = React.useState(false);

    const [profile, setProfile] = useState(false);

    const [whisperUser, setWhisperUser] = useState();

    const selectWhisper = useCallback(async (_user: any) => {
        let channel;
        if (channels && channels.length) {
            channel = channels.find((c: any) =>
                c.type === "WHISPER" && c.members.find((id: number) => _user.id === id))
        }
        /* if (!channel) {
            await getWhisperChannel(user.id, _user.id, token)
                .then(res => {
                    if (res.data) {
                        channel = res.data
                    }
                })
            await addChannel(channel, false);
        } */
        return (channel);
    }, [channels]);

    const isCurrentUserMember = useCallback((channel: any) => {
        if (user && channel && channel.members && channel.members.find((id: number) => id === user.id))
            return (true);
        return (false);
    }, [user]);

    const loadInterface = useCallback(async () => {
        if (params.channelId) {
            setWhisperUser(null);
            let channel;
            if (channels && channels.length)
                channel = channels.find((c: any) => c.id === Number(params.channelId));
            if (isCurrentUserMember(channel))
                return (setCurrentChannel(channel));
        }
        else if (params.userId) {
            const user = await fetchUser(params.userId);
            setWhisperUser(user);
            let channel = await selectWhisper(user);
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