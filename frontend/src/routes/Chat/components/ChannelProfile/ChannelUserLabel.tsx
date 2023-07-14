import React, { useCallback, useContext, useEffect, useState } from "react"

import { useChannelsContext, useCurrentUser, } from "../../../../hooks/Hooks"

import { UserInfos } from "../../../../components/users/UserInfos";
import Icon from "../../../../components/Icon";
import useKickUser from "../../../../hooks/Chat/usekickUser";
import useBanUser from "../../../../hooks/Chat/useBanUser";
import useAdinistrators from "../../../../hooks/Chat/useAdministrators";
import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import useMembers from "../../../../hooks/Chat/useMembers";
import { PofileChannelContext } from '../../Profile/ChannelProfile/ChannelProfile';
import useMuteUser from "../../../../hooks/Chat/useMuteUser";
import { CollectionElement } from "../../../../components/collections/Collection";
import { Channel, User } from "../../../../types";


import muteIcon from '../../../../assets/Chat_Close.svg'
import unmuteIcon from '../../../../assets/Chat_Check.svg'
import userAddIcon from '../../../../assets/User_Add.svg'
import exitIcon from '../../../../assets/Exit.svg'
import adminIcon from '../../../../assets/ShieldCheck.svg'
import unadminIcon from '../../../../assets/ShieldCross.svg'
import banIcon from '../../../../assets/User_Close.svg'
import unbanIcon from '../../../../assets/User_Check.svg'
import ownerIcon from '../../../../assets/House.svg'


import './ChannelUserLabel.css'


function MuteIcon(props: any) {

    const { muteUser, unmuteUser, isUserMuted } = useMuteUser(props.channel);
    const { setUserAction, setConfirmView }: any = useContext(PofileChannelContext)

    return (
        <>
            {
                isUserMuted(props.user) ?
                    <Icon
                        icon={unmuteIcon}
                        description="Unmute"
                        onClick={() => {
                            setConfirmView(true);
                            setUserAction(
                                {
                                    user: props.user,
                                    function: unmuteUser,
                                    type: "unmute"
                                }
                            )
                        }}
                    />
                    :
                    <Icon
                        icon={muteIcon}
                        description="Mute"
                        onClick={() => {
                            setConfirmView(true);
                            setUserAction(
                                {
                                    user: props.user,
                                    function: muteUser,
                                    type: "mute"
                                }
                            )
                        }}
                    />
            }
        </>
    )
}

function AdminIcon(props: any) {

    const { isCurrentUserOwner } = useUserAccess(props.channel);
    const { makeAdmin, removeAdmin, isUserAdministrators } = useAdinistrators(props.channel);
    const { setUserAction, setConfirmView }: any = useContext(PofileChannelContext)

    return (
        <>
            {
                isCurrentUserOwner && !isUserAdministrators(props.user) &&
                <Icon
                    icon={adminIcon}
                    description="make admin"
                    onClick={() => {
                        setConfirmView(true);
                        setUserAction(
                            {
                                user: props.user,
                                function: makeAdmin,
                                type: "make admin"
                            }
                        )
                    }}
                />
            }
            {
                isCurrentUserOwner && isUserAdministrators(props.user) &&
                <Icon
                    icon={unadminIcon}
                    description="remove admin"
                    onClick={() => {
                        setConfirmView(true);
                        setUserAction(
                            {
                                user: props.user,
                                function: removeAdmin,
                                type: "remove admin"
                            }
                        )
                    }}
                />
            }
        </>
    )
}


type TChannelUserLabel = {
    user: User,
    channel: Channel,
    showChannelStatus: boolean | number,
    isAddable: boolean,
}

export function ChannelUserLabel(props: TChannelUserLabel) {

    const { user } = useCurrentUser();
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserAccess(props.channel);
    const { setUserAction, setConfirmView }: any = useContext(PofileChannelContext)

    const { kickUser } = useKickUser(props.channel);
    const { banUser, unbanUser } = useBanUser(props.channel);
    const { isUserAdministrators } = useAdinistrators(props.channel);
    const { isUserMember, isUserOwner, isUserBanned, addMember } = useMembers(props.channel);

    const canAct = useCallback(() => {
        if (isCurrentUserAdmin &&
            props.user && props.user.username !== (user && user.username) &&
            props.channel.ownerId !== props.user.id &&
            (!isUserAdministrators(props.user) || isCurrentUserOwner))
            return (true);
        return (false);
    }, [props.user, props.channel, user, isCurrentUserAdmin]);

    function functionalities() {
        if (canAct()) {
            if (isUserBanned(props.user)) {
                return (
                    <div>
                        <Icon
                            icon={unbanIcon}
                            description="Unban"
                            onClick={() => {
                                setConfirmView(true);
                                setUserAction(
                                    {
                                        user: props.user,
                                        function: unbanUser,
                                        type: "unban"
                                    }
                                )
                            }}
                        />
                    </div>
                )
            }
            else if (!isUserMember(props.user)) {
                if (props.isAddable) {
                    return (
                        <div>
                            <Icon
                                icon={userAddIcon}
                                description="Add"
                                onClick={() => {
                                    setConfirmView(true);
                                    setUserAction(
                                        {
                                            user: props.user,
                                            function: addMember,
                                            type: "add"
                                        }
                                    )
                                }}
                            />
                        </div>
                    )
                }
            }
            else if (props.user) {
                return (
                    <>
                        <AdminIcon {...props} />
                        <Icon
                            icon={exitIcon}
                            description="Kick"
                            onClick={() => {
                                setConfirmView(true);
                                setUserAction(
                                    {
                                        user: props.user,
                                        function: kickUser,
                                        type: "kick"
                                    }
                                )
                            }}
                        />
                        <MuteIcon {...props} />
                        <Icon
                            icon={banIcon}
                            description="Ban"
                            onClick={() => {
                                setConfirmView(true);
                                setUserAction(
                                    {
                                        user: props.user,
                                        function: banUser,
                                        type: "ban"
                                    }
                                )
                            }}
                        />
                    </>
                )
            }
        }
    }

    function showChannelStatus() {
        if (props.showChannelStatus && props.user) {
            return (
                <>
                    {
                        isUserAdministrators(props.user) &&
                        <img src={adminIcon} />
                    }
                    {
                        isUserOwner(props.user) &&
                        <img src={ownerIcon} />
                    }
                </>
            )
        }
    }

    return (
        <div className="channeluserlabel label">
            <UserInfos
                profile={true}
                user={props.user}
            />
            <div className="channeluserlabel-icons">
                {
                    props.showChannelStatus ?
                        showChannelStatus() : functionalities()
                }
            </div>
        </div>
    )
}

