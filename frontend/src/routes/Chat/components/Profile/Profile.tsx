import React, { createContext, useCallback, useContext, useEffect, useState } from "react"

import './Profile.css'
import { useChannels, useFriends, useCurrentUser, useChatSocket } from "../../../../hooks/Hooks"
import UserLabel from "../../../../components/users/UserLabel";
import { CollectionElement } from "../Menu/MenuElement";
import InfoInput from "../../../../components/Input/InfoInput";
import PickMenu from "../../../../components/PickMenu";
import { TUserInfos, UserInfos } from "../../../../components/users/UserInfos";
import Icon from "../../../../components/Icon";

export const PofileChannelContext = createContext({});



function ChannelUserLabel(props: any) {

    const {
        setUserOperation,
        setConfirmView,
        adminUser,
        kickUser,
        muteUser,
        banUser
    }: any = useContext(PofileChannelContext)

    return (
        <div className="friend-element">
            <UserInfos
                username={props.username}
                profilePictureURL={props.profilePictureURL}
                userStatus={props.userStatus}
            />
            {
                props.isAdmin && props.username !== (props.currentUser && props.currentUser.username) &&
                <div className="flex-center">

                    {/* <Icon
                        icon="shield_person"
                        description="Admin"
                        onClick={() => { setConfirmView(true); setUserOperation({ user: props.user, function: adminUser, type: "make admin" }) }}
                    /> */}
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

    useEffect(() => {
        if (props.users && props.users)
            setRenderUsers(props.users.map((user: any) =>
                <ChannelUserLabel
                    key={user.id}
                    id={user.id}
                    user={user}
                    currentUser={props.currentUser}
                    username={user.username}
                    profilePictureURL={user.url}
                    userStatus={user.userStatus}
                    isAdmin={props.isAdmin}
                />
            ))
    }, [props.users, props.isAdmin, props.currentUser])

    return (
        <CollectionElement
            title={props.title}
            collection={renderUsers}
        />
    )
}

function ChannelName(props: any) {
    const [name, setName]: [string, any] = useState(props.name || "");

    return (
        <>
            <h2>{props.title}</h2>
            {
                props.administrators &&
                    props.administrators.find((id: number) => id === props.user.id) ?
                    <InfoInput
                        id={props.user.id}
                        label={props.title}
                        value={name}
                        setValue={setName}
                        submit={null}
                    />
                    :
                    <h3 className="reset">{props.name}</h3>
            }
        </>
    )
}

function ChannelAccess(props: any) {
    const [access, setAccess] = useState(props.channel && props.channel.type.toLowerCase());

    return (
        <>
            {
                props.administrators &&
                    props.administrators.find((id: number) => id === props.user.id) ?
                    <PickMenu
                        title="Access"
                        collection={["public", "protected", "private"]}
                        selected={access}
                        setSelected={setAccess}
                    />
                    :
                    <>
                        <h2>{props.title}</h2>
                        <h3 className="reset">{access}</h3>
                    </>
            }
        </>
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
    const { getAdministrators } = useChannels();

    const [access, setAccess] = useState(props.channel && props.channel.type.toLowerCase());
    const [admins, setAdmins] = useState([]);
    const [banned, setBanned] = useState([])

    const [isAdmin, setIsAdmin] = useState(false);

    const [confirmView, setConfirmView] = useState(false);

    const [userOperation, setUserOperation] = useState(null)


    useEffect(() => {
        if (props.members && props.members.length) {
            const administrators = getAdministrators(props.channel);
            if (administrators && administrators.length) {
                setAdmins(administrators)
            }
        }
    }, [props.members])


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

    const kickUser = useCallback((user: any) => {
        console.log("kick user ", user);
        if (socket && props.channel && user) {
            socket.emit('kickUser', {
                channelId: props.channel.id,
                userId: user.id
            })
        }
    }, [socket, props.channel])

    function muteUser(user: any) {
        console.log("mute user ", user);
    }

    function banUser(user: any) {
        console.log("ban user ", user);
    }

    return (
        <PofileChannelContext.Provider
            value={{
                adminUser,
                kickUser,
                muteUser,
                banUser,
                setConfirmView,
                setUserOperation
            }}
        >
            <div className="reset ">
                <div className="channelprofile">
                    <ChannelName
                        user={user}
                        title="Name"
                        channel={props.channel}
                        name={props.channel && props.channel.name}
                        administrators={props.channel && props.channel.administrators}
                    />
                    <hr />
                    <ChannelAccess
                        user={user}
                        title="Access"
                        channel={props.channel}
                        name={props.channel && props.channel.name}
                        administrators={props.channel && props.channel.administrators}
                    />
                    {
                        admins &&
                        <CollectionUsers
                            title="Administrators"
                            users={admins}
                            currentUser={user}
                        />
                    }
                    {
                        props.members &&
                        <CollectionUsers
                            title="Members"
                            users={props.members}
                            isAdmin={isAdmin}
                            currentUser={user}
                        />
                    }
                </div>
                {
                    confirmView && userOperation &&
                    <ConfirmView
                        type={userOperation.type}
                        username="friend1"
                        cancel={() => { setConfirmView(p => !p); console.log("cancel") }}
                        valid={() => { setConfirmView(p => !p); userOperation.function(userOperation.user) }}
                    />
                }
            </div>
        </PofileChannelContext.Provider>
    )
}


export default function Profile() {
    const { currentFriend } = useFriends();
    const { currentChannel, getMembers } = useChannels();

    const [friend, setFriend]: any = useState();
    const [channel, setChannel]: any = useState();
    const [members, setMembers]: any = useState();

    useEffect(() => {
        if (currentChannel) {
            console.log("current channel updated ", currentChannel)
            setChannel(currentChannel)
            setMembers(getMembers(currentChannel.id))
        }
    }, [currentChannel])


    useEffect(() => {
        if (currentFriend)
            setFriend(currentFriend)
    }, [currentFriend])

    return (
        <div className="fill scroll">
            {
                channel && members &&
                <ChannelProfile
                    name={channel.name}
                    members={members}
                    channel={channel}
                />
            }
        </div>
    )
}
