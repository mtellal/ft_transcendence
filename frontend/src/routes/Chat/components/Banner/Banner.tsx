import React, { useCallback, useContext, useEffect, useState } from "react";

import Icon from "../../../../components/Icon";
import { UserInfos } from "../../../../components/users/UserInfos";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import { useChannelsContext, useCurrentUser } from "../../../../hooks/Hooks";

import { useWindow } from "../../../../hooks/useWindow";
import ArrowBackMenu from "../ArrowBackMenu";
import { useBlock } from "../../../../hooks/Chat/useBlock";
import { useFriends } from "../../../../hooks/Chat/Friends/useFriends";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import { ChatInterfaceContext } from "../../Chat/Chat";
import { ConfirmView } from "../../Profile/ChannelProfile/ConfirmAction";
import { useFriendRequest } from "../../../../hooks/Chat/Friends/useFriendRequest";
import './Banner.css'
import { getBlockList } from "../../../../requests/block";
import { SetInvitation } from "../Invitation";


type TIconsBanner = {
    whisperUser: any,
    channel: any,
    setBlockedFriend: any,
    type: any,
    mobile?: any
    profile: any,
}

function IconsBanner(props: TIconsBanner) {

    const { user, token } = useCurrentUser();
    const { isUserBlocked, blockUser, unblockUser } = useBlock();
    const { removeFriend, updateFriend } = useFriends();
    const { leaveChannel } = useChannels();
    const { isUserFriend } = useFriends();

    const { sendRequest } = useFriendRequest();

    const { setAction } = useContext(ChatInterfaceContext);

    const [currentUserBlocked, setCurrentUserBlocked] = useState(false);

    const bannerBlock = useCallback(() => {
        if (props.whisperUser) {
            if (isUserBlocked(props.whisperUser))
                unblockUser(props.whisperUser);
            else
                blockUser(props.whisperUser)
            props.setBlockedFriend((p: boolean) => !p);
        }
    }, [props.whisperUser]);



    async function loadBlockList() {
        const blockList = await getBlockList(props.whisperUser && props.whisperUser.id, token).then(res => res.data);
        if (blockList && blockList.length && blockList.find((o: any) => o.userId === user.id))
            setCurrentUserBlocked(true);
    }


    useEffect(() => {
        if (props.whisperUser && props.whisperUser.id) {
            loadBlockList();
        }
    })


    return (
        <>
            <Icon icon="person" onClick={props.profile} description="Profile" />
            <Icon
                icon="sports_esports"
                onClick={() => {
                    setAction(
                        <SetInvitation
                            channelId={props.channel && props.channel.id}
                        />
                    )
                }}
                description="Invitation"
            />
            {
                props.type === "WHISPER" && props.whisperUser &&
                <Icon icon="block" onClick={bannerBlock} description="Block" />
            }
            {
                props.type === "WHISPER" && !isUserFriend(props.whisperUser) && !currentUserBlocked &&
                <Icon
                    icon="person_add"
                    onClick={() => {
                        setAction(
                            <ConfirmView
                                type="send a request friend to"
                                username={props.whisperUser.username}
                                valid={() => { sendRequest(props.whisperUser); setAction(null) }}
                                cancel={() => setAction(null)}
                            />
                        )
                    }}
                    description="Leave"
                />
            }
            {
                props.type === "WHISPER" && isUserFriend(props.whisperUser) && !currentUserBlocked &&
                <Icon
                    icon="person_remove"
                    onClick={() => {
                        setAction(
                            <ConfirmView
                                type="remove"
                                username={props.whisperUser.username}
                                valid={() => { removeFriend(props.whisperUser); setAction(null) }}
                                cancel={() => setAction(null)}
                            />
                        )
                    }}
                    description="Leave"
                />
            }
            {
                props.type !== "WHISPER" &&
                <Icon
                    icon="logout"
                    onClick={() => {
                        setAction(
                            <ConfirmView
                                type="leave"
                                username={props.channel.name}
                                valid={() => { leaveChannel(props.channel); setAction(null) }}
                                cancel={() => setAction(null)}
                            />

                        )
                    }}
                    description="Leave"
                />
            }
        </>
    )

}

type TBanner = {
    whisperUser: any,
    channel: any,
    type: string,
    setBlockedFriend: any,
    profile: any,
}

export default function Banner({ ...props }: TBanner) {

    const { currentChannel } = useChannelsContext();
    const { isMobileDisplay } = useWindow();

    return (
        <>
            <div className="banner">
                <div className="flex-center" style={{ maxWidth: '100%' }} >
                    <ArrowBackMenu />
                    {
                        currentChannel && currentChannel.type === "WHISPER" ?
                            <UserInfos
                                user={props.whisperUser}
                            />
                            :
                            <ChannelInfos
                                channel={currentChannel}
                            />
                    }
                </div>
                {
                    isMobileDisplay && currentChannel ?

                        <div className="mobile-iconsbanner">
                            <IconsBanner
                                channel={currentChannel}
                                whisperUser={props.whisperUser}
                                mobile={true}
                                {...props}
                            />
                        </div>
                        :
                        <IconsBanner
                            channel={currentChannel}
                            whisperUser={props.whisperUser}
                            {...props}
                        />
                }
            </div>
        </>
    )
}
