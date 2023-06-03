import React, { useEffect, useState } from "react"

import './Profile.css'
import { useChannels, useFriends, useCurrentUser } from "../../../../hooks/Hooks"
import UserLabel from "../../../../components/users/UserLabel";
import { CollectionElement } from "../Menu/MenuElement";
import InfoInput from "../../../../components/Input/InfoInput";
import PickMenu from "../../../../components/PickMenu";
import { TUserInfos, UserInfos } from "../../../../components/users/UserInfos";
import Icon from "../../../../components/Icon";

type TChannelUserLabel = TUserInfos & {
    id?: number,
    key?: any,
    username: string,
    profilePictureURL: string,
    userStatus: string,
    onClick?: () => {} | any,
    isAdmin?: boolean, 
    currentUser?: any
}

function ChannelUserLabel(props: TChannelUserLabel) {
    console.log(props.username, props.currentUser)
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

                    <Icon
                        icon="shield_person"
                        description="Admin"
                    />
                    <Icon
                        icon="logout"
                        description="Kick"
                    />
                    <Icon
                        icon="schedule_send"
                        description="Mute"
                    />
                    <Icon
                        icon="person_off"
                        description="Ban"
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

function ChannelProfile(props: any) {

    const { user } = useCurrentUser();
    const { getAdministrators } = useChannels();

    const [access, setAccess] = useState(props.channel && props.channel.type.toLowerCase());
    const [admins, setAdmins] = useState([]);
    const [banned, setBanned] = useState([])

    const [isAdmin, setIsAdmin] = useState(false);


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

    return (
        <div className="reset channelprofile">
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
