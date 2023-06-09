import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import './Profile.css'
import { useChannelsContext, useFriends, useCurrentUser, useChatSocket } from "../../../hooks/Hooks"
import UserLabel, { UserLabelSearch } from "../../../components/users/UserLabel";
import { CollectionElement } from "../components/Menu/MenuElement";
import InfoInput from "../../../components/Input/InfoInput";
import PickMenu from "../../../components/PickMenu";
import { TUserInfos, UserInfos } from "../../../components/users/UserInfos";
import Icon from "../../../components/Icon";
import useKickUser from "../../../hooks/Chat/usekickUser";
import useBanUser from "../../../hooks/Chat/useBanUser";
import useAdinistrators from "../../../hooks/Chat/useAdministrators";
import useUserAccess from "../../../hooks/Chat/useUserAccess";
import useFetchUsers from "../../../hooks/useFetchUsers";
import useMembers from "../../../hooks/Chat/useMembers";
import useChannelInfos from "../../../hooks/Chat/useChannelInfos";

export const PofileChannelContext = createContext({});


function ChannelUserLabel(props: any) {

    const { user } = useCurrentUser();
    const { makeAdmin, removeAdmin, isUserAdministrators } = useAdinistrators();
    const { kickUser } = useKickUser();
    const { banUser, unbanUser } = useBanUser();
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserAccess();
    const { isUserMember, isUserOwner, isUserBanned, addMember } = useMembers();

    const { currentChannel } = useChannelsContext();

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
    const { channels } = useChannelsContext();

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

    const { user } = useCurrentUser();
    const { channels, getOwner } = useChannelsContext();
    const { getAdministrators } = useAdinistrators();

    const [admins, setAdmins] = useState([]);
    const [banned, setBanned] = useState([])

    const [owner, setOwner] = useState(false);

    const [confirmView, setConfirmView] = useState(false);
    const [confirmViewTypeProtected, setConfirmViewTypeProted] = useState(false);


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
        setUserOperation(null)
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
            <div>
                <div className="profilepage">
                    <ChannelName channel={props.channel} />
                    <ChannelPassword channel={props.channel} />
                    <PickMenuAccess channel={props.channel} protectedAccess={() => setConfirmViewTypeProted(true)} />
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
                {
                    confirmViewTypeProtected &&
                    <ConfirmViewTypeProteced
                        channel={props.channel}
                        display={(d: boolean) => setConfirmViewTypeProted(d)}
                        cancel={() => setConfirmViewTypeProted(false)}
                    />
                }

            </div>
        </PofileChannelContext.Provider>
    )
}


function ChannelName({ channel }: any) {
    const { isCurrentUserAdmin } = useUserAccess();
    const [name, setName]: any = useState(channel.name)

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { updateChannelName } = useChannelInfos();

    const prevName: any = useRef(channel.name);

    function submitName() {
        let newName = name && name.trim();
        if (newName) {
            if (newName.length > 15)
                return (setError("Maximum length of 15 letters"));
            if (newName === prevName.current)
                return;
            prevName.current = newName;
            setSuccess("Name updated")
            updateChannelName(channel.id, newName)
        }
    }

    function onChange() {
        setError("");
        setSuccess("");
    }

    return (
        <>
            <h2>Name</h2>
            {
                isCurrentUserAdmin ?
                    <>
                        {error && <p className="red-c" >{error}</p>}
                        {success && <p className="green-c" >{success}</p>}
                        <InfoInput
                            id="name"
                            label="Channel name "
                            value={name}
                            setValue={setName}
                            onChange={onChange}
                            submit={() => submitName()}
                        />
                    </>
                    :

                    <p>{name}</p>
            }
        </>
    )
}



function ChannelPassword({ channel }: any) {
    const { isCurrentUserAdmin } = useUserAccess();
    const [password, setPassword]: any = useState("")

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { updateChannelPassword } = useChannelInfos();

    function submitName() {
        let newPassword: string = password && password.trim();
        if (newPassword) {
            if (newPassword.length > 15)
                return (setError("Maximum length of 15 letters"));
            setSuccess("Password updated")
            updateChannelPassword(channel.id, newPassword, channel.type)
        }
    }

    function onChange(e: any) {
        setError("");
        setSuccess("");
    }

    function passwordInformation() {
        if (channel.type === "PROTECTED")
            return (<p>This channel is protected by a password</p>)
        else if (channel.type === "PRIVATE")
            return (<p>This channel is private, no password required</p>)
        else
            return (<p>No password required</p>)
    }

    return (
        <>
            <h2>Password</h2>
            {
                channel.type === "PROTECTED" && isCurrentUserAdmin ?
                    <>
                        {error && <p className="red-c" >{error}</p>}
                        {success && <p className="green-c" >{success}</p>}

                        <InfoInput
                            id="password"
                            label="Set new password "
                            value={password}
                            setValue={setPassword}
                            onChange={onChange}
                            submit={() => submitName()}
                        />
                    </>
                    :
                    passwordInformation()
            }
        </>
    )
}

function PickMenuAccess({ channel, protectedAccess }: any) {
    const { isCurrentUserAdmin } = useUserAccess();
    const { updateChannelType } = useChannelInfos();

    const [success, setSuccess] = useState("");    
    const [type, setType] = useState(channel.type.toLowerCase())
    const prevType = useRef(channel.type.toLowerCase());

    function select(element: any) {
        setSuccess("Access updated")
        setType(element);
        if (prevType !== type) {
            prevType.current = element;
            if (element === "protected")
                protectedAccess()
            else
                updateChannelType(channel.id, element.toUpperCase());
        }
    }

    return (
        <>
            <h2>Access</h2>
            {success && <p className="green-c">{success}</p>}
            {
                isCurrentUserAdmin ?
                    <PickMenu
                        title="Access"
                        collection={["public", "protected", "private"]}
                        selected={type}
                        setSelected={select}
                        picking={() => { setSuccess("") }}
                    />
                    :
                    <p>{type}</p>
            }
        </>
    )
}



export function ConfirmViewTypeProteced(props: any) {

    const [password, setPassword]: any = useState("")

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const { updateChannelType } = useChannelInfos();

    function submit() {
        let newPassword: string = password && password.trim();
        if (newPassword) {
            if (newPassword.length > 15)
                return (setError("Password too long (15 letters max)"));
            updateChannelType(props.channel.id, props.channel.type, newPassword)
            props.display(false);
        }
    }

    function onChange(e: any) {
        setError("");
    }

    return (
        <div className="reset absolute flex-column-center confirmview-container">
            <div className="flex-column remove-friend-div">
                <h3>To protect a channel you need to set a password</h3>
                <InfoInput
                    id="init-password"
                    label="Set a password"
                    value={password}
                    setValue={setPassword}
                    submit={() => submit()}
                    onChange={onChange}
                />
                {error && <p className="red-c reset">{error}</p>}
                <div className="remove-friend-buttons">

                    <button
                        className="button red white-color remove-friend-button"
                        onClick={() => submit()}
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
    const { currentChannel } = useChannelsContext();

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
