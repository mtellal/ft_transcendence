import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

import './Profile.css'
import { useChannels, useFriends, useCurrentUser, useChatSocket } from "../../../hooks/Hooks"
import UserLabel from "../../../components/users/UserLabel";
import { CollectionElement } from "../components/Menu/MenuElement";
import InfoInput from "../../../components/Input/InfoInput";
import PickMenu from "../../../components/PickMenu";
import { TUserInfos, UserInfos } from "../../../components/users/UserInfos";
import Icon from "../../../components/Icon";
import useKickUser from "../../../hooks/usekickUser";

export const PofileChannelContext = createContext({});



function ChannelUserLabel(props: any) {

    const { user } = useCurrentUser();
    const { kickUser } = useKickUser();

    const {
        setUserOperation,
        setConfirmView,
        adminUser,
        muteUser,
        banUser,
        isAdmin,
        isOwner
    }: any = useContext(PofileChannelContext)

    return (
        <div className="friend-element">
            <UserInfos
                username={props.user.username}
                profilePictureURL={props.user.url}
                userStatus={props.user.userStatus}
            />
            {
                isAdmin && props.user.username !== (user && user.username) &&
                <div className="flex-center fill">

                    {
                        isOwner &&
                        <Icon
                            icon="shield_person"
                            description="Admin"
                            onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: adminUser, type: "make admin" }) }}
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
            }
        </div>
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
    const { channels, getAdministrators, getOwner } = useChannels();

    const [name, setName]: any = useState(props.channel && props.channel.name);
    const [password, setPassword] = useState("");
    const [access, setAccess] = useState(props.channel && props.channel.type.toLowerCase());
    const [admins, setAdmins] = useState([]);
    const [banned, setBanned] = useState([])

    const [isAdmin, setIsAdmin] = useState(false);
    const [owner, setOwner] = useState(false);

    const [confirmView, setConfirmView] = useState(false);

    const [userOperation, setUserOperation] = useState(null)


    useEffect(() => {
        if (props.members && props.members.length) {
            const administrators = getAdministrators(props.channel);
            if (administrators && administrators.length) {
                setAdmins(administrators)
            }
            const owner = getOwner(props.channel);
            setOwner(owner)
        }
    }, [props.members, channels])


    useEffect(() => {
        if (admins && admins.length) {
            if (admins.find((u: any) => u.id === user.id)) {
                setIsAdmin(true)
            }
        }
    }, [admins])

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
                isAdmin,
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
                    <CollectionUsers
                        title="Owner"
                        users={[owner]}
                        currentUser={user}
                    />
                    <CollectionUsers
                        title="Administrators"
                        users={admins}
                        currentUser={user}
                    />
                    <CollectionUsers
                        title="Members"
                        users={props.members}
                        isAdmin={isAdmin}
                        currentUser={user}
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


function FriendProfile(props : any)
{
    return (
        <div className="reset flex-column profilepage">
            <h2>Historic</h2>
            <h2>Stats</h2>
        </div>
    )
}


export default function Profile() {
    const { currentFriend } = useFriends();
    const { currentChannel} = useChannels();

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
