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
    const { makeAdmin } = useAdinistrators();
    const { kickUser } = useKickUser();
    const { banUser } = useBanUser();
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserAccess();
    const { isUserMember, isUserOwner, addMember } = useMembers();

    const { currentChannel } = useChannels();

    const {
        setUserOperation,
        setConfirmView,
        muteUser,
    }: any = useContext(PofileChannelContext)

    console.log(isCurrentUserAdmin, isCurrentUserOwner)

    function functionalities() {
        if (props.user && isCurrentUserAdmin &&
            props.user.username !== (user && user.username) && currentChannel.ownerId !== props.user.id) {
            if (props.bannedUsers) {
                return (
                    <Icon
                        icon="lock_open"
                        description="Unban"
                        onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: banUser, type: "unban" }) }}
                    />
                )
            }
            else if (!isUserMember(props.user) && !props.bannedUsers) {
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
                            isCurrentUserOwner &&
                            <Icon
                                icon="shield_person"
                                description="Admin"
                                onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: makeAdmin, type: "make admin" }) }}
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


    return (
        <div className="friend-element">
            <UserInfos
                username={props.user.username}
                profilePictureURL={props.user.url}
                userStatus={props.user.userStatus}
            />
            {
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

    const { fetchUserByUsername } = useFetchUsers();


    async function search() {
        let user;
        if (props.members && props.members.length) {
            user = props.members.find((u: any) => u.username === searchUserValue.trim());
        }
        if (!user)
            user = await fetchUserByUsername(searchUserValue);
        if (user) {
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
                />
            }
        </>
    )
}

function CollectionUsers(props: any) {
    const [renderUsers, setRenderUsers] = useState();
    const { channels } = useChannels();

    useEffect(() => {
        if (props.users && props.users)
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

    async function init() {
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
    }

    useEffect(() => {
        init();
    }, [props.members, channels])


    function adminUser(user: any) {
        console.log("admin user ", user);
    }

    /* const kickUser = useCallback((user: any) => {
        console.log("kick user ", user);
        if (socket && props.channel && user) {
            socket.emit('kickUser', {
                channelId: props.channel.id,
                userId: user.id
            })
        }
    }, [socket, props.channel]) */

    function muteUser(user: any) {
        console.log("mute user ", user);
    }

    function banUser(user: any) {
        console.log("ban user ", user);
    }


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
                adminUser,
                muteUser,
                banUser,
                setConfirmView,
                setUserOperation,
                owner
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
