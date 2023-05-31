import React, { useEffect, useState } from "react"

import './Profile.css'
import { useChannels, useChannelsUsers, useFriends, useUser } from "../../Hooks"
import FriendElement from "../../Components/FriendElement";
import { CollectionElement } from "../MenuElement";
import InfoInput from "../../Components/InfoInput";
import PickMenu from "../../Components/PickMenu";

function CollectionUsers(props: any) {
    const [renderUsers, setRenderUsers] = useState();

    useEffect(() => {
        if (props.users && props.users)
            setRenderUsers(props.users.map((user: any) =>
                <FriendElement
                    key={user.id}
                    id={user.id}
                    username={user.username}
                    profilePictureURL={user.url}
                    avatar={user.avatar}
                    userStatus={user.userStatus}
                />
            ))
    }, [props.users])

    return (
        <CollectionElement
            title={props.title}
            collection={renderUsers}
        />
    )
}

function ChannelName(props: any) {
    const [name, setName] = useState(props.name || "");

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

    const { user } = useUser();
    const { getAdmins } = useChannelsUsers();

    const [access, setAccess] = useState(props.channel && props.channel.type.toLowerCase());
    const [admins, setAdmins] = useState([]);
    const [banned, setBanned] = useState([])

    useEffect(() => {
        if (props.members && props.members.length) {
            const administrators = getAdmins(props.channel);
            if (administrators && administrators.length)
                setAdmins(administrators)
        }
    }, [props.members])

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
                admins && <CollectionUsers
                    title="Administrators"
                    users={admins}
                />
            }
            {
                props.members && <CollectionUsers
                    title="Members"
                    users={props.members}
                />
            }
        </div>
    )
}


export default function Profile() {
    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();
    const { channelsUsers, getMembers }: any = useChannelsUsers();

    const [friend, setFriend]: any = useState();
    const [channel, setChannel]: any = useState();
    const [members, setMembers]: any = useState();

    useEffect(() => {
        if (currentChannel) {
            setChannel(currentChannel)
            if (channelsUsers && channelsUsers.length)
                setMembers(getMembers(currentChannel.id))
        }
    }, [currentChannel, channelsUsers])


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
