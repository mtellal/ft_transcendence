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


export const InterfaceContext: React.Context<any> = createContext(null);

export default function Interface() {
    const params: any = useParams();

    const navigate = useNavigate();
    const { token, user, userDispatch }: any = useCurrentUser();

    const { friends, currentFriend, setCurrentFriend }: any = useFriendsContext();
    const { removeFriend } = useFriends();
    const { isUserBlocked, blockUser, unblockUser } = useBlock();


    const { currentChannel, setCurrentChannel, leaveChannel, channels } = useChannelsContext();

    const [profile, setProfile] = React.useState(false);
    const [removeView, setRemoveView] = React.useState(false);
    const [blockedFriend, setBlockedFriend]: [any, any] = React.useState(false);


    const [action, setAction]: any = useState(null);


    useEffect(() => {
        if (!currentChannel && channels && channels.length) {
            if (params.channelName) {
                const channel = channels.find((c: any) => c.name === params.channelName)
                if (channel)
                    return (setCurrentChannel(channel));
            }
            else if (params.username && friends && friends.length) {
                const friend = friends.find((f: any) => f.username === params.username);
                if (friend) {
                    setCurrentFriend(friend)
                    const whispersChannel = channels.filter((c: any) => c.type === "WHISPER");
                    const channel = whispersChannel.find((c: any) =>
                        c.members.length === 2 && c.members.find((id: number) => id === user.id)
                        && c.members.find((id: number) => id === friend.id))
                    if (channel)
                        return (setCurrentChannel(channel));
                }
            }
            navigate("/chat")
        }
    }, [currentChannel, channels, friends])

    function block() {
        if (!blockedFriend) {
            userDispatch({ type: 'blockUser', friendId: currentFriend.id })
            blockUserRequest(currentFriend.id, token)
        }
        else {
            unblockUserRequest(currentFriend.id, token)
            userDispatch({ type: 'unblockUser', friendId: currentFriend.id })
        }
        setBlockedFriend((p: any) => !p)
    }

    function bannerBlock() {
        if (currentFriend) {
            if (isUserBlocked(currentFriend))
                unblockUser(currentFriend);
            else
                blockUser(currentFriend)
        }
    }



    function validLeaveChannel() {
        leaveChannel(currentChannel);
        setRemoveView(false);
        navigate("/chat");
    }

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
                                        if (action.user)
                                            await action.function(action.user);
                                        else if (action.channel)
                                            await action.function(action.channel)
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