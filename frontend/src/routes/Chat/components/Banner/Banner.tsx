import React, { useCallback, useContext, useEffect, useState } from "react";

import Icon, { CheckedIcon } from "../../../../components/Icon";
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
import { useNavigate } from "react-router-dom";
import { Channel, User } from "../../../../types";


import userIcon from '../../../../assets/User.svg'
import useraddIcon from '../../../../assets/addUser.svg'
import userRemoveIcon from '../../../../assets/UserRemove.svg'
import gameIcon from '../../../../assets/Gamepad.svg'
import stopIcon from '../../../../assets/stop.svg'
import exitIcon from '../../../../assets/Exit.svg'



type TIconsBanner = {
    whisperUser: User,
    channel: Channel,
    setBlockedFriend: any,
    type: any,
    mobile?: any
    profile: any,
}

function IconsBanner(props: TIconsBanner) {

    const navigate = useNavigate();
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
        <div className="iconsbanner" style={props.mobile ? {width: '100%', justifyContent: 'space-around'} : { marginLeft: 'auto' }}>
            {
                props.type === "WHISPER" && props.whisperUser &&
                <div>
                    <Icon icon={userIcon} onClick={() => { navigate(`/user/${props.whisperUser.id}`) }} description="profile" />
                </div>
            }
            {
                props.type !== "WHISPER" &&
                <div>
                    <Icon icon={userIcon} onClick={props.profile} description="profile" />
                </div>
            }
            <div>
                <Icon
                    icon={gameIcon}
                    onClick={() => {
                        setAction(
                            <SetInvitation
                                channelId={props.channel && props.channel.id}
                            />
                        )
                    }}
                    description="invitation"
                />
            </div>
            {
                props.type === "WHISPER" && props.whisperUser &&
                <div>
                    <Icon icon={stopIcon} onClick={bannerBlock} description="block" />
                </div>
            }
            {
                props.type === "WHISPER" && !isUserFriend(props.whisperUser) && !currentUserBlocked &&
                <div>
                    <CheckedIcon
                        icon={useraddIcon}
                        onClick={() => sendRequest(props.whisperUser)}
                        description="add"
                    />
                </div>
            }
            {
                props.type === "WHISPER" && isUserFriend(props.whisperUser) && !currentUserBlocked &&
                <div>
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
                </div>
            }
            {
                props.type !== "WHISPER" &&
                <div>
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
                </div>
            }
        </div>
    )

}

type TBanner = {
    whisperUser: User,
    channel: Channel,
    type: string,
    setBlockedFriend: any,
    profile: any,
}

export default function Banner({ ...props }: TBanner) {

    const { isMobileDisplay } = useWindow();

    return (
        <>
            <div className="banner" style={isMobileDisplay ? { padding: '5px' } : {}}>
                <div className="flex-center" style={{ maxWidth: '100%', overflow: 'hidden' }} >
                    {isMobileDisplay && <ArrowBackMenu />}
                    {
                        props.channel && props.channel.type === "WHISPER" ?
                            <UserInfos
                                user={props.whisperUser}
                            />
                            :
                            <ChannelInfos
                                channel={props.channel}
                            />
                    }
                </div>
                <IconsBanner
                    channel={props.channel}
                    mobile={isMobileDisplay && props.channel}
                    {...props}
                />

            </div>
        </>
    )
}
