import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

import './Profile.css'
import { useChannels, useFriends, useCurrentUser, useChatSocket } from "../../../hooks/Hooks"
import UserLabel, { UserLabelSearch } from "../../../components/users/UserLabel";
import { CollectionElement } from "../components/Menu/MenuElement";
import InfoInput from "../../../components/Input/InfoInput";
import PickMenu from "../../../components/PickMenu";
import { TUserInfos, UserInfos } from "../../../components/users/UserInfos";
import Icon from "../../../components/Icon";
import useKickUser from "../../../hooks/usekickUser";
import useBanUser from "../../../hooks/useBanUser";
import useAdinistrators from "../../../hooks/useAdministrators";
import useUserAccess from "../../../hooks/useUserAccess";
import useFetchUsers from "../../../hooks/useFetchUsers";
import useMembers from "../../../hooks/useMembers";

export const PofileChannelContext = createContext({});


function ChannelUserLabel(props: any) {

    const { user } = useCurrentUser();
    const { makeAdmin, removeAdmin, isUserAdministrators } = useAdinistrators();
    const { kickUser } = useKickUser();
    const { banUser, unbanUser } = useBanUser();
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserAccess();
    const { isUserMember, isUserOwner, isUserBanned, addMember } = useMembers();

    const { currentChannel } = useChannels();

    const {
        setUserOperation,
        setConfirmView,
        muteUser,
    }: any = useContext(PofileChannelContext)

    function functionalities() {
        if (props.user && isCurrentUserAdmin && props.user.username !== (user && user.username) && 
            currentChannel.ownerId !== props.user.id && (!isUserAdministrators(props.user) || isCurrentUserOwner)) {
            if (isUserBanned(props.user)) {
                return (
                    <Icon
                        icon="lock_open"
                        description="Unban"
                        onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: unbanUser, type: "unban" }) }}
                    />
                )
            }
            else if (!isUserMember(props.user)) {
                return (
                    <Icon
                        icon="add"
                        description="Add"
                        onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: addMember, type: "add" }) }}
                    />
                )
            }
            else {
                return (
                    <div className="flex-center fill">
                        {
                            (isCurrentUserOwner || isCurrentUserAdmin) && !isUserAdministrators(props.user) &&
                            <Icon
                                icon="add_moderator"
                                description="make admin"
                                onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: makeAdmin, type: "make admin" }) }}
                            />
                        }
                        {
                            (isCurrentUserOwner || isCurrentUserAdmin) && isUserAdministrators(props.user) &&
                            <Icon
                                icon="remove_moderator"
                                description="remove admin"
                                onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: removeAdmin, type: "make admin" }) }}
                            />
                        }
                        <Icon
                            icon="logout"
                            description="Kick"
                            onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: kickUser, type: "kick" }) }}
                        />
                        <Icon
                            icon="schedule_send"
                            description="Mute"
                            onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: muteUser, type: "mute" }) }}
                        />
                        <Icon
                            icon="person_off"
                            description="Ban"
                            onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: banUser, type: "ban" }) }}
                        />
                    </div>
                )
            }
        }
    }


    function showChannelStatus() {
        if (props.showChannelStatus) {
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
                username={props.user.username}
                profilePictureURL={props.user.url}
                userStatus={props.user.userStatus}
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

type TSearchChannelUser = {
    title: string
    inputTitle: string,
    members: any[],
    bannedUsers?: any[]
}

function SearchChannelUser(props: TSearchChannelUser) {

    const [searchUserValue, setSearchUserValue]: any = useState("");
    const [searchUser, setSearchUser]: any = useState();
    const [error, setError] = useState("");
    const { isUserMember } = useMembers();

    const { fetchUserByUsername } = useFetchUsers();
    const { isCurrentUserAdmin, getUserAccess } = useUserAccess();

    async function search() {
        let user;
        if (props.members && props.members.length) {
            user = props.members.find((u: any) => u.username === searchUserValue.trim());
        }
        if (!user)
            user = await fetchUserByUsername(searchUserValue);
        if (user && (isUserMember(user) || isCurrentUserAdmin)) {
            setSearchUser(user);
            setError("");
        }
        else {
            setError("User not found")
            setSearchUser(null);
        }
    }

    return (
        <>
            <hr />
            <h2>{props.title}</h2>
            <InfoInput
                id={props.inputTitle}
                label={props.inputTitle}
                value={searchUserValue}
                setValue={setSearchUserValue}
                submit={() => search()}
            />
            {error && <p className="red-c">{error}</p>}
            {
                searchUser &&
                <ChannelUserLabel
                    user={searchUser}
                    bannedUsers={props.bannedUsers}
                    showChannelStatus={!isCurrentUserAdmin && getUserAccess(searchUser)}
                />
            }
        </>
    )
}

function CollectionUsers(props: any) {
    const [renderUsers, setRenderUsers] = useState([]);
    const { channels } = useChannels();

    useEffect(() => {
        setRenderUsers([]);
        if (props.users)
            setRenderUsers(props.users.map((user: any) =>
                <ChannelUserLabel
                    key={`${props.title}-${user.id}`}
                    user={user}
                    bannedUsers={props.bannedUsers}
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

export function ConfirmView(props: any) {
    return (
        <div className="reset absolute flex-column-center confirmview-container">
            <div className="flex-column-center remove-friend-div">
                <p>{`Are you sure to ${props.type} `}
                    <span className="remove-friend-username">
                        {props.username}
                    </span> ?
                </p>
                {
                    props.type === "mute" &&
                    < div className="red">
                        <p>mute</p>
                    </div>
                }
                <div className="remove-friend-buttons">
                    <button
                        className="button red white-color remove-friend-button"
                        onClick={props.valid}
                    >
                        Valid
                    </button>
                    <button
                        className="button white remove-friend-button"
                        onClick={props.cancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div >
    )
}

function ChannelProfile(props: any) {

    const { socket } = useChatSocket();
    const { user } = useCurrentUser();
    const { channels, getOwner } = useChannels();
    const { getAdministrators } = useAdinistrators();

    const [name, setName]: any = useState(props.channel && props.channel.name);
    const [password, setPassword] = useState("");
    const [access, setAccess] = useState(props.channel && props.channel.type.toLowerCase());
    const [admins, setAdmins] = useState([]);
    const [banned, setBanned] = useState([])

    const [owner, setOwner] = useState(false);

    const [confirmView, setConfirmView] = useState(false);

    const [userOperation, setUserOperation] = useState(null)

    const { getUsersBanned } = useBanUser();

    const init = useCallback(async () => {

        if (props.members && props.members.length) {
            const administrators = getAdministrators(props.channel);
            if (administrators && administrators.length) {
                setAdmins(administrators)
            }

            const owner = getOwner(props.channel);
            setOwner(owner)

            const bans = await getUsersBanned(props.channel);
            setBanned(bans)
        }
    }, [channels, props.members])

    useEffect(() => {
        init();
    }, [props.members, channels])


    function cancelOperation() {
        setConfirmView(p => !p);

    }

    function validOperation() {
        setConfirmView(p => !p);
        userOperation.function(userOperation.user, props.channel);
    }

    return (
        <PofileChannelContext.Provider
            value={{
                setUserOperation,
                setConfirmView,
            }}
        >
            <div className="">
                <div className="profilepage">
                    <h2>Name</h2>
                    <InfoInput
                        id="name"
                        label="Name"
                        value={name}
                        setValue={setName}
                        submit={null}
                    />
                    <hr />
                    <PickMenu
                        title="Access"
                        collection={["public", "protected", "private"]}
                        selected={access}
                        setSelected={setAccess}
                    />
                    {
                        props.channel.type !== "PUBLIC" &&
                        <>
                            <h2>Password</h2>
                            <InfoInput
                                id="name"
                                label="Name"
                                value={name}
                                setValue={setName}
                                submit={null}
                            />
                        </>
                    }
                    <SearchChannelUser
                        title="Search"
                        inputTitle="Search user"
                        members={props.members}
                    />
                    <h2>Owner</h2>
                    <ChannelUserLabel
                        user={owner}
                    />
                    <CollectionUsers
                        title="Administrators"
                        users={admins}
                        currentUser={user}
                    />
                    <CollectionUsers
                        title="Members"
                        users={props.members}
                        currentUser={user}
                    />
                    <CollectionUsers
                        title="Banned"
                        users={banned}
                        currentUser={user}
                        bannedUsers={true}
                    />
                </div>
                {
                    confirmView && userOperation &&
                    <ConfirmView
                        type={userOperation.type}
                        username="friend1"
                        cancel={() => cancelOperation()}
                        valid={() => validOperation()}
                    />
                }
            </div>
        </PofileChannelContext.Provider>
    )
}


function FriendProfile(props: any) {
    return (
        <div className="reset flex-column profilepage">
            <h2>Historic</h2>
            <h2>Stats</h2>
        </div>
    )
}


export default function Profile() {
    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();

    return (
        <div className="scroll">
            {
                currentChannel && currentChannel.users && currentChannel.type !== "WHISPER" &&
                <ChannelProfile
                    name={currentChannel && currentChannel.name}
                    members={currentChannel && currentChannel.users}
                    channel={currentChannel}
                />
            }
            {
                currentChannel && currentChannel.users && currentChannel.type === "WHISPER" &&
                <FriendProfile
                    currentFriend={currentFriend}
                />
            }
        </div>
    )
}
