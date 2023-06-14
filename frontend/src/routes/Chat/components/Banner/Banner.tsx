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

function IconsBanner(props: any) {

    const { currentFriend } = useFriendsContext();
    const { isUserBlocked, blockUser, unblockUser } = useBlock();
    const { removeFriend } = useFriends();
    const { leaveChannel } = useChannels();

    const { setAction } = useContext(InterfaceContext);

    function bannerBlock() {
        if (currentFriend) {
            if (isUserBlocked(currentFriend))
                unblockUser(currentFriend);
            else
                blockUser(currentFriend)
            props.setBlockedFriend((p: boolean) => !p);
        }
    }

    const pickRemoveIcon = useCallback(() => {
        if (props.channel) {
            if (props.channel.type === "WHISPER")
                return (
                    <Icon
                        icon="person_remove"
                        onClick={() => {
                            setAction({
                                type: 'remove',
                                user: currentFriend,
                                channel: props.channel,
                                function: (user: any, channel: any) => {
                                    removeFriend(user);
                                    console.log("leaveChannel called ", channel)
                                    leaveChannel(channel);
                                }
                            })
                        }}
                        description="Remove"
                    />
                )
            else {
                if (props.channel.ownerId === props.user.id)
                    return (
                        <Icon
                            icon="delete_forever"
                            onClick={() => {
                                setAction({
                                    type: 'delete',
                                    channel: props.channel,
                                    function: (user: any, channel: any) => {
                                        leaveChannel(channel)
                                    }
                                })
                            }}
                            description="Delete"
                        />
                    )
                else
                    return (
                        <Icon
                            icon="logout"
                            onClick={() => {
                                setAction({
                                    type: 'leave',
                                    channel: props.channel,
                                    function: (user: any, channel: any) => { 
                                        leaveChannel(channel);
                                    }
                                })
                            }}
                            description="Leave"
                        />
                    )
            }
        }
    }, [props.channel])

    return (
        <>
            {
                props.channel && props.channel.type === "WHISPER" ?
                    <Icon icon="person" onClick={props.profile} description="Profile" />
                    : <Icon icon="groups" onClick={props.profile} description="Channel" />
            }
            <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
            {
                props.type === "WHISPER" && currentFriend &&
                <Icon icon="block" onClick={bannerBlock} description="Block" />
            }
            {pickRemoveIcon()}
        </>
    )

}

type TBanner = {
    channel: any,
    type: string,
    setBlockedFriend: any,
    profile: () => {} | any,
    invitation: () => {} | any,
    remove: () => {} | any,
}

export default function Banner({ ...props }: TBanner) {

    const { user } = useCurrentUser();
    const { currentFriend } = useFriendsContext();
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
                                username={currentFriend && currentFriend.username}
                                userStatus={currentFriend && currentFriend.userStatus}
                                profilePictureURL={currentFriend && currentFriend.url}
                            />
                            :
                            <ChannelInfos
                                channel={currentChannel}
                            />
                    }
                </div>
                {
                    isMobileDisplay ?

                        <div className="mobile-iconsbanner">
                            <IconsBanner
                                channel={currentChannel}
                                user={user}
                                mobile={true}
                                {...props}
                            />
                        </div>
                        :
                        <IconsBanner
                            channel={currentChannel}
                            user={user}
                            {...props}
                        />
                }
            </div>
        </>
    )
}
