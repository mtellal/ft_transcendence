import React, { useCallback, useContext, useEffect, useState } from "react";

import Icon from "../../../../components/Icon";
import { UserInfos } from "../../../../components/users/UserInfos";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../../hooks/Hooks";

import './Banner.css'
import { useWindow } from "../../../../hooks/useWindow";
import ArrowBackMenu from "../ArrowBackMenu";
import { useBlock } from "../../../../hooks/Chat/useBlock";
import { InterfaceContext } from "../../Interface/Interface";
import { useFriends } from "../../../../hooks/Chat/Friends/useFriends";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import { ChatInterfaceContext } from "../../Chat/Chat";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import { ConfirmView } from "../../Profile/ChannelProfile/ConfirmAction";


type TIconsBanner = {
    whisperUser: any,
    channel: any,
    setBlockedFriend: any,
    invitation: any,
    type: any,
    mobile?: any
    profile: any,
}

function IconsBanner(props: TIconsBanner) {

    const { user } = useCurrentUser();
    const { isUserBlocked, blockUser, unblockUser } = useBlock();
    const { removeFriend } = useFriends();
    const { leaveChannel } = useChannels();
    const { isUserFriend } = useFriends();

    const { setAction } = useContext(ChatInterfaceContext);

    const bannerBlock = useCallback(() => {
        if (props.whisperUser) {
            if (isUserBlocked(props.whisperUser))
                unblockUser(props.whisperUser);
            else
                blockUser(props.whisperUser)
            props.setBlockedFriend((p: boolean) => !p);
        }
    }, [props.whisperUser]);

    return (
        <>
            <Icon icon="person" onClick={props.profile} description="Profile" />
            <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
            {
                props.type === "WHISPER" && props.whisperUser &&
                <Icon icon="block" onClick={bannerBlock} description="Block" />
            }
            {
                props.type === "WHISPER" && isUserFriend(props.whisperUser) && 
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
    invitation: () => {} | any,
    profile: any,
}

export default function Banner({ ...props }: TBanner) {

    const { currentChannel } = useChannelsContext();
    const { isMobileDisplay } = useWindow();

    const { fetchUser } = useFetchUsers();

    return (
        <>
            <div className="banner">
                <div className="flex-center" style={{ maxWidth: '100%' }} >
                    <ArrowBackMenu />
                    {
                        currentChannel && currentChannel.type === "WHISPER" ?
                            <UserInfos
                                username={props.whisperUser && props.whisperUser.username}
                                userStatus={props.whisperUser && props.whisperUser.userStatus}
                                profilePictureURL={props.whisperUser && props.whisperUser.url}
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
