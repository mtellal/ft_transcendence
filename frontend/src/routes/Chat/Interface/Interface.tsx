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
import { createChannel, getWhisperChannel } from "../../../requests/chat";
import { useChannels } from "../../../hooks/Chat/useChannels";


export const InterfaceContext: React.Context<any> = createContext(null);

export default function Interface() {
    const p: any = useParams();

    const [params, setParams] = useState(p);

    const navigate = useNavigate();
    const { token, user, userDispatch }: any = useCurrentUser();

    const { friends, friendsDispatch, currentFriend, setCurrentFriend }: any = useFriendsContext();

    const { currentChannel, setCurrentChannel, channels } = useChannelsContext();

    const [profile, setProfile] = React.useState(false);
    const [removeView, setRemoveView] = React.useState(false);
    const [blockedFriend, setBlockedFriend]: [any, any] = React.useState(false);

    const { addChannel } = useChannels();

    const [action, setAction]: any = useState(null);

    async function loadFriendChannel(friend: any) {
        let channel;
        setCurrentFriend(friend)
        friendsDispatch({ type: 'removeNotif', friend });

        channel = channels.find((c: any) =>
            c.type === "WHISPER" && c.members.find((id: number) => friend.id === id))
        if (!channel) {
            channel = await getWhisperChannel(user.id, friend.id).then(res => res.data);
            if (!channel) {
                await createChannel({
                    name: "privateMessage",
                    type: "WHISPER",
                    members: [
                        friend.id
                    ],
                }, token)
                    .then(res => { channel = res.data })
            }
            await addChannel(channel, false);
        }
        setCurrentFriend(friend);
        return (setCurrentChannel(channel));
    }


    async function loadInterface() {
        if (channels && channels.length) {
            if (params.channelName) {
                const channel = channels.find((c: any) => c.name === params.channelName)
                if (channel)
                    return (setCurrentChannel(channel));
            }
            else if (params.username && friends && friends.length) {
                const friend = friends.find((f: any) => f.username === params.username);
                if (friend) {
                    return (loadFriendChannel(friend));
                }
            }
            navigate("/chat")
        }
    }


    useEffect(() => {
        loadInterface();
    }, [channels, friends, params])

    // update current friend selected when he is picked from MenuElement

    React.useEffect(() => {
        setProfile(false);
        setRemoveView(false);
        if (currentFriend && user) {
            if (user.blockList.length) {
                if (user.blockList.find((obj: any) => currentFriend.id === obj.userId))
                    setBlockedFriend(true);
                else
                    setBlockedFriend(false)
            }
        }
    }, [currentFriend, user])

    return (
        <InterfaceContext.Provider value={{ setAction }}>
            {
                currentChannel ?
                    <div className={"flex-column relative interface-container visible"}>
                        <Banner
                            channel={currentChannel}
                            type={currentChannel && currentChannel.type}
                            profile={() => setProfile(prev => !prev)}
                            invitation={() => { }}
                            setBlockedFriend={setBlockedFriend}
                            remove={() => setRemoveView(prev => !prev)}
                        />
                        {
                            profile ?
                                <Profile /> :
                                <Messenger
                                    blockedFriend={blockedFriend}
                                />
                        }
                        {
                            action && (action.user || action.channel) && action.function &&
                            <ConfirmPage>
                                <ConfirmView
                                    type={action.type}
                                    username={(action.user && action.user.username) || (action.channel && action.channel.name)}
                                    valid={async () => {
                                        await action.function(action.user, action.channel);
                                        setAction(null)
                                    }}
                                    cancel={() => setAction(null)}
                                />
                            </ConfirmPage>
                        }
                    </div>
                    : null
            }
        </InterfaceContext.Provider >
    )
}