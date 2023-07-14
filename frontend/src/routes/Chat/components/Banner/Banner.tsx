import React, { useCallback, useContext, useEffect, useState } from "react";

import Icon, { CheckedIcon } from "../../../../components/Icon";
import { UserInfos } from "../../../../components/users/UserInfos";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import { useCurrentUser } from "../../../../hooks/Hooks";

import { useWindow } from "../../../../hooks/useWindow";
import ArrowBackMenu from "../ArrowBackMenu";
import { useBlock } from "../../../../hooks/Chat/useBlock";
import { useFriends } from "../../../../hooks/Chat/Friends/useFriends";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import { ChatInterfaceContext } from "../../Chat/Chat";
import { ConfirmView } from "../../Profile/ChannelProfile/ConfirmAction";
import { useFriendRequest } from "../../../../hooks/Chat/Friends/useFriendRequest";
import { getBlockList } from "../../../../requests/block";
import { SetGameInvitation } from "../GameInvitation";
import { useNavigate } from "react-router-dom";
import { Channel, User } from "../../../../types";


import userIcon from '../../../../assets/User.svg'
import useraddIcon from '../../../../assets/addUser.svg'
import userRemoveIcon from '../../../../assets/UserRemove.svg'
import gameIcon from '../../../../assets/Gamepad.svg'
import stopIcon from '../../../../assets/stop.svg'
import exitIcon from '../../../../assets/Exit.svg'

import './Banner.css'


function IconBannerFriend(props: any) {
    const { user, token } = useCurrentUser();
    const { isUserBlocked, blockUser, unblockUser } = useBlock();
    const { removeFriend } = useFriends();
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
            {
                props.type === "WHISPER" && 
                props.whisperUser &&
                <Icon icon={stopIcon} onClick={bannerBlock} description="block" />
            }
            {
                props.type === "WHISPER" && 
                !currentUserBlocked && 
                !isUserFriend(props.whisperUser) && 
                !isUserBlocked(props.whisperUser) && 
                <CheckedIcon
                    icon={useraddIcon}
                    onClick={() => sendRequest(props.whisperUser)}
                    description="add"
                />
            }
            {
                props.type === "WHISPER" && 
                !currentUserBlocked &&
                isUserFriend(props.whisperUser) && 
                <Icon
                    icon={userRemoveIcon}
                    onClick={() => {
                        setAction(
                            <ConfirmView
                                type="remove"
                                username={props.whisperUser.username}
                                valid={() => { removeFriend(props.whisperUser, true); setAction(null) }}
                                cancel={() => setAction(null)}
                            />
                        )
                    }}
                    description="remove"
                />
            }
        </>
    )
}

function IconsBannerProfile({ type, profile, whisperUser }: any) {
    const navigate = useNavigate();
    return (
        <>
            {
                type === "WHISPER" && whisperUser &&
                <Icon icon={userIcon} onClick={() => { navigate(`/user/${whisperUser.id}`) }} description="profile" />
            }
            {
                type !== "WHISPER" &&
                <Icon icon={userIcon} onClick={profile} description="profile" />
            }
        </>
    )
}


type TIconsBanner = {
    whisperUser: User,
    channel: Channel,
    type: string,
    mobile?: boolean
    setBlockedFriend: (p: any) => void,
    profile: () => void
}

function IconsBanner(props: TIconsBanner) {

    const { leaveChannel } = useChannels();
    const { setAction } = useContext(ChatInterfaceContext);

    return (
        <div
            key={props.channel.id}
            className="iconsbanner"
            style={props.mobile ? { width: '100%', justifyContent: 'space-around' } : {}}
        >
            <IconsBannerProfile {...props} />
            <Icon
                icon={gameIcon}
                onClick={() => {
                    setAction(
                        <SetGameInvitation
                            channelId={props.channel && props.channel.id}
                        />
                    )
                }}
                description="invitation"
            />
            <IconBannerFriend {...props} />
            {
                props.type !== "WHISPER" &&
                <Icon
                    icon={exitIcon}
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
                    description="leave"
                />
            }
        </div>
    )

}

type TBanner = {
    whisperUser: User,
    channel: Channel,
    type: string,
    setBlockedFriend: (p: boolean) => void,
    profile: () => void,
}

export default function Banner({ ...props }: TBanner) {

    const { isMobileDisplay } = useWindow();

    return (
        <>
            <div
                className="banner"
                style={isMobileDisplay ? { padding: '5px' } : {}}
            >
                <div className="banner-infos">
                    {isMobileDisplay && <ArrowBackMenu />}
                    {
                        props.channel && props.channel.type === "WHISPER" ?
                            <UserInfos user={props.whisperUser} />
                            :
                            <ChannelInfos channel={props.channel} />
                    }
                </div>
                <IconsBanner
                    channel={props.channel}
                    mobile={isMobileDisplay}
                    {...props}
                />
            </div>
        </>
    )
}
