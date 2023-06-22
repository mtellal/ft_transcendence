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
    }, [props.users, props.isAdmin, props.currentUser, channels])

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
    const { currentChannel, channels } = useChannelsContext();
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
    }, [currentChannel && currentChannel.muteList])

    function mutedIcon() {
        if (mutedUser)
            return (

                <Icon
                    icon="cancel_schedule_send"
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
                    icon="schedule_send"
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
                    <Icon
                        icon="lock_open"
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
                )
            }
            else if (props.user && !isUserMember(props.user)) {
                if (props.isAddable) {
                    return (
                        <Icon
                            icon="add"
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
                    )
                }
                else 
                    return (<p>Blocked</p>)
            }
            else if (props.user) {
                return (
                    <div
                        className="flex-center fill"
                        style={{ justifyContent: 'space-around' }}
                    >
                        {
                            isCurrentUserOwner && !isUserAdministrators(props.user) &&
                            <Icon
                                icon="add_moderator"
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
                                icon="remove_moderator"
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
                            icon="logout"
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
                            icon="person_off"
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
                    </div>
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
        <div className="friend-element">
            <UserInfos
                user={props.user}
            />

            {
                props.showChannelStatus ?
                    showChannelStatus()
                    :
                    functionalities()
            }
        </div>
    )
}