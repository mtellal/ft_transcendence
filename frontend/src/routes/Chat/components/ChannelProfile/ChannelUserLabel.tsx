import React, { useContext, useEffect, useState } from "react"

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
import { CollectionElement } from "../../../../components/collections/CollectionElement";
import { User } from "../../../../types";


import muteIcon from '../../../../assets/Chat_Close.svg'
import unmuteIcon from '../../../../assets/Chat_Check.svg'
import userAddIcon from '../../../../assets/User_Add.svg'
import exitIcon from '../../../../assets/Exit.svg'
import adminIcon from '../../../../assets/ShieldCheck.svg'
import unadminIcon from '../../../../assets/ShieldCross.svg'
import banIcon from '../../../../assets/User_Close.svg'
import unbanIcon from '../../../../assets/User_Check.svg'


import './ChannelUserLabel.css'

type TCollectionUsers = {
    title: string,
    users: User[],
    isAdmin?: boolean,
    currentUser?: User,
}

export function CollectionUsers(props: TCollectionUsers) {
    const [renderUsers, setRenderUsers] = useState([]);
    const { channels } = useChannelsContext();

    useEffect(() => {
        setRenderUsers([]);
        if (props.users && props.users.length)
            setRenderUsers(props.users.map((user: any) =>
                <ChannelUserLabel
                    key={`${props.title}-${user.id}`}
                    user={user}
                    showChannelStatus={false}
                    isAddable={false}
                />
            ))
    }, [props.users, props.title, props.isAdmin, props.currentUser, channels])

    return (
        <CollectionElement
            title={props.title}
            collection={renderUsers}
        />
    )
}

type TChannelUserLabel = {
    user: User,
    showChannelStatus: boolean | number,
    isAddable: boolean,
}


export function ChannelUserLabel(props: TChannelUserLabel) {

    const { user } = useCurrentUser();
    const { currentChannel } = useChannelsContext();
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserAccess();

    const { kickUser } = useKickUser();
    const { muteUser, unmuteUser, isUserMuted } = useMuteUser();
    const { banUser, unbanUser } = useBanUser();
    const { makeAdmin, removeAdmin, isUserAdministrators } = useAdinistrators();
    const { isUserMember, isUserOwner, isUserBanned, addMember } = useMembers();

    const { setUserAction, setConfirmView }: any = useContext(PofileChannelContext)

    const [mutedUser, setMutedUser] = useState(false);

    useEffect(() => {
        setMutedUser(isUserMuted(props.user, currentChannel));
    }, [currentChannel, currentChannel.muteList, isUserMuted, props.user])

    function mutedIcon() {
        if (mutedUser)
            return (

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
            )
        else
            return (

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
            )
    }

    function functionalities() {
        if (props.user && isCurrentUserAdmin && props.user.username !== (user && user.username) &&
            currentChannel.ownerId !== props.user.id && (!isUserAdministrators(props.user) || isCurrentUserOwner)) {
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
            else if (props.user && !isUserMember(props.user)) {
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
                else
                    return (<p>Blocked</p>)
            }
            else if (props.user) {
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
                        {
                            mutedIcon()
                        }
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
                        <span className="material-symbols-outlined">
                            shield_person
                        </span>
                    }
                    {
                        isUserOwner(props.user) &&
                        <span className="material-symbols-outlined">
                            location_away
                        </span>
                    }
                </>
            )
        }
    }

    return (
        <div className="channeluserlabel label">
            <UserInfos
                user={props.user}
            />
            <div className="channeluserlabel-icons flex-center"
                style={{gap: '10px'}}
            >
                {
                    props.showChannelStatus ?
                        showChannelStatus()
                        :
                        functionalities()
                }
            </div>
        </div>
    )
}

