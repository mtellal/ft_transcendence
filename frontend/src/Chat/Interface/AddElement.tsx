
import React, { useEffect, useState } from "react";
import {
    getUserByUsername,
    addUserFriend,
    getUser,
    sendFriendRequest,
    validFriendRequest,
    refuseFriendRequest,
    getChannelByName,
    getUserProfilePictrue
} from '../../utils/User'

import FriendElement, { FriendSearch } from "../../Components/FriendElement";

import IconInput from "../../Components/IconInput";
import { useOutletContext, Link } from "react-router-dom";
import { CollectionElement } from "../MenuElement";

import './AddElement.css'
import { useChannels, useChatSocket, useFriends, useUser } from "../../Hooks";
import { match } from "assert";
import ProfilePicture from "../../Components/ProfilePicture";
import Icon from "../../Components/Icon";
import InfoInput from "../../Components/InfoInput";

export default function AddElement(props: any) {
    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [friend, setFriend]: [any, any] = React.useState(null);
    const [error, setError] = React.useState(false);

    const [userInvitations, setUserInvitations]: [any, any] = React.useState([]);
    const [invitations, setInvitations]: [any, any] = React.useState([]);

    const {
        token,
        user,
        setUser
    }: any = useUser();

    const [friends, friendsDispatch]: any = useFriends();

    const {
        friendInvitations,
        removeFriendRequest
    }: any = useOutletContext();

    function validFriend() {
        return (friends.every((user: any) => friend.id !== user.id) && friend.id !== user.id)
    }

    function handleResponse(res: any) {
        if (res.status === 200 && res.statusText === "OK") {
            setFriend(res.data);
            setError(false)
        }
        else {
            setFriend(null);
            setError(true)
        }
    }

    async function searchUser() {
        if (prevValue === value)
            return;
        const res = await getUserByUsername(value);
        handleResponse(res);
        setPrevValue(value);
    }

    async function updateFriend() {
        if (friend) {
            const res = await getUser(friend.id);
            handleResponse(res)
        }
    }

    async function addFriend() {
        if (validFriend()) {
            await sendFriendRequest(friend.id, token);
        }
    }


    async function loadUser(id: number | string) {
        const userRes = await getUser(id);
        if (userRes.status === 200 && userRes.statusText === "OK") {
            return (userRes.data);
        }
        return (null)
    }

    async function acceptFriendRequest(u: any) {
        const invitation = friendInvitations.find((i: any) => i.sendBy === u.id);
        if (invitation) {
            const validRes = await validFriendRequest(invitation.id, token);
            if (validRes.status === 201 && validRes.statusText === "Created") {
                removeFriendRequest(invitation.id);
                setUserInvitations((p: any) => p.filter((user: any) => user.id !== u.id))
                friendsDispatch({ type: 'updateFriend', friend: u })
            }
        }
    }

    async function refuseRequest(u: any) {
        const invitation = friendInvitations.find((i: any) => i.sendBy === u.id);
        if (invitation) {
            const refuseRes = await refuseFriendRequest(invitation.id, token);
            if (refuseRes.status === 200 && refuseRes.statusText === "OK") {
                removeFriendRequest(invitation.id);
                setUserInvitations((p: any) => p.filter((user: any) => user.id !== u.id))
            }
        }
    }


    async function loadFriends() {
        const users = await Promise.all(friendInvitations.map(async (u: any) =>
            await loadUser(u.sendBy)
        ))
        setUserInvitations(users);
    }

    React.useEffect(() => {

        if (friendInvitations && friendInvitations.length) {
            loadFriends();
        }
        else {
            setInvitations([]);
            setUserInvitations([]);
        }
    }, [friendInvitations])


    React.useEffect(() => {
        if (userInvitations && userInvitations.length) {
            setInvitations(userInvitations.map((u: any) =>
                <FriendSearch
                    key={u.id}
                    id={u.id}
                    username={u.username}
                    avatar={u.avatar}
                    userStatus={u.userStatus}
                    invitation={true}
                    accept={() => acceptFriendRequest(u)}
                    refuse={() => refuseRequest(u)}
                />
            ))
        }
        else
            setInvitations([]);
    }, [userInvitations])


    return (
        <div className="add-container">
            <div className="flex-column-center add-div">
                <h2 className="add-title">Add a {props.title}</h2>
                <IconInput
                    icon="search"
                    placeholder="Username"
                    getValue={(v: string) => setValue(v.trim())}
                    submit={() => value && searchUser()}
                />
                {
                    friend ?
                        <div className="user-found">
                            <FriendSearch
                                key={friend.id}
                                id={friend.id}
                                username={friend.username}
                                avatar={friend.avatar}
                                userStatus={friend.userStatus}
                                onCLick={() => addFriend()}
                                add={validFriend()}
                            />
                        </div>
                        : null
                }
                {
                    error ? <p>User not found</p> : null
                }
                <button
                    className="add-button button"
                    onClick={searchUser}
                >
                    Search
                </button>
                {
                    userInvitations.length ?
                        <div className="add-element-invitations">
                            <CollectionElement
                                title="Invitations"
                                collection={invitations}
                                addClick={props.addGroup}
                            />
                        </div>
                        :
                        null
                }
            </div>
        </div>
    )
}


function ChannelSearch(props: any) {

    const [members, setMembers] = useState([]);

    async function loadUsersProfilePicter() {
        const rawProfilePictures = await Promise.all(props.members.map(async (id: any, i: number) =>
            i < 5 ? await getUserProfilePictrue(id).then(res => res.data) : null
        ))
        const images = rawProfilePictures.map((i: any) =>
            window.URL.createObjectURL(new Blob([i]))
        )
        setMembers(images.map((url: any) =>
            <ProfilePicture key={url} image={url} />
        ))
    }

    useEffect(() => {
        if (props.members)
            loadUsersProfilePicter();
    }, [props.members])

    return (
        <div className="flex-ai channel-search">
            <h3>{props.name} - </h3>
            <p className="channelsearch-members gray-c flex-center">{props.members.length} members</p>
            <div className="channelsearch-pps">
                {members}
            </div>
            <div style={{ marginLeft: 'auto' }}>
                <Icon icon="login" description="Join" onClick={props.join} />
            </div>
        </div>
    )
}


export function JoinChannel() {
    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(false);

    const [matchChannels, setMatchChannels] = useState([]);
    const [renderChannels, setRenderChannels] = useState([]);

    const [userInvitations, setUserInvitations]: [any, any] = React.useState([]);
    const [invitations, setInvitations]: [any, any] = React.useState([]);
    const [channels, channelsDispatch] = useChannels();

    const {
        token,
        user,
        setUser
    }: any = useUser();

    const [friends, friendsDispatch]: any = useFriends();

    const {
        friendInvitations,
        removeFriendRequest
    }: any = useOutletContext();

    /* function validFriend() {
        return (friends.every((user: any) => element.id !== user.id) && element.id !== user.id)
    } */

    function handleResponse(res: any) {
        if (res.status === 200 && res.statusText === "OK") {
            setMatchChannels(res.data);
            setError(false)
        }
        else {
            setMatchChannels(null);
            setError(true)
        }
    }

    async function searchChannel() {
        if (prevValue === value)
            return;
        const res = await getChannelByName(value);
        handleResponse(res);
        setPrevValue(value);
    }

    /* async function addFriend() {
        if (validFriend()) {
            await sendFriendRequest(element.id, token);
        }
    } */

    async function loadElement(id: number | string) {
        const userRes = await getUser(id);
        if (userRes.status === 200 && userRes.statusText === "OK") {
            return (userRes.data);
        }
        return (null)
    }

    async function acceptFriendRequest(u: any) {
        const invitation = friendInvitations.find((i: any) => i.sendBy === u.id);
        if (invitation) {
            const validRes = await validFriendRequest(invitation.id, token);
            if (validRes.status === 201 && validRes.statusText === "Created") {
                removeFriendRequest(invitation.id);
                setUserInvitations((p: any) => p.filter((user: any) => user.id !== u.id))
                friendsDispatch({ type: 'updateFriend', friend: u })
            }
        }
    }

    async function refuseRequest(u: any) {
        const invitation = friendInvitations.find((i: any) => i.sendBy === u.id);
        if (invitation) {
            const refuseRes = await refuseFriendRequest(invitation.id, token);
            if (refuseRes.status === 200 && refuseRes.statusText === "OK") {
                removeFriendRequest(invitation.id);
                setUserInvitations((p: any) => p.filter((user: any) => user.id !== u.id))
            }
        }
    }


    async function loadElementsInvitations() {
        const users = await Promise.all(friendInvitations.map(async (u: any) =>
            await loadElement(u.sendBy)
        ))
        setUserInvitations(users);
    }

    React.useEffect(() => {

        if (friendInvitations && friendInvitations.length) {
            loadElementsInvitations();
        }
        else {
            setInvitations([]);
            setUserInvitations([]);
        }
    }, [friendInvitations])


    function joinChannel(channel: any) {
        channelsDispatch({ type: 'addChannel', channel })
    }

    React.useEffect(() => {
        if (userInvitations && userInvitations.length) {
            setInvitations(userInvitations.map((u: any) =>
                <FriendSearch
                    key={u.id}
                    id={u.id}
                    username={u.username}
                    avatar={u.avatar}
                    userStatus={u.userStatus}
                    invitation={true}
                    accept={() => acceptFriendRequest(u)}
                    refuse={() => refuseRequest(u)}
                />
            ))
        }
        else
            setInvitations([]);
    }, [userInvitations])


    useEffect(() => {
        if (matchChannels && matchChannels.length) {
            setRenderChannels(
                matchChannels.map((c: any) =>
                    <ChannelSearch
                        key={c.id}
                        id={c.id}
                        name={c.name}
                        members={c.members}
                        join={() => joinChannel(c)}
                    />)
            )
        }
    }, [matchChannels])


    return (
        <div className="add-container">
            <h2 className="add-title">Join a Channel</h2>
            <div className="flex-column-center">
                <IconInput
                    icon="search"
                    placeholder="Channel"
                    getValue={(v: string) => setValue(v.trim())}
                    submit={() => value && searchChannel()}
                />
                <button
                    className="button add-button"
                    onClick={searchChannel}
                >
                    Search
                </button>
                {renderChannels}
                {
                    error ? <p>User not found</p> : null
                }
                {
                    userInvitations.length ?
                        <div className="add-element-invitations">
                            <CollectionElement
                                title="Invitations"
                                collection={invitations}
                                addClick={() => console.log("addClick")}
                            />
                        </div>
                        :
                        null
                }
            </div>
        </div>
    )
}


export function CreateChannel() {

    const [name, setName] = useState();
    const [password, setPassword] = useState();
    const [searchAdminValue, setSearchAdminValue]: any = useState("");

    const [searchAdmin, setSearchAdmin]: any = useState();
    const [admins, setAdmins] = useState([])
    const [searchMember, setSearchMember] = useState();
    const [members, setMembers] = useState([])

    async function searchAdminUser() {
        console.log("search admin called")
        await getUserByUsername(searchAdminValue)
            .then(res => setSearchAdmin(res.data))
    }

    function addAdmin(user : any)
    {
        setAdmins(p => [...p, user])
        setSearchAdmin(null)
        setSearchAdminValue("")
    }

    function removeAdmins(user: any) {
        console.log("admin removed")
        setAdmins((p: any) => p.filter((u: any) => u.id !== user.id))
    }

    return (
        <div className="add-container scroll">
            <h2>Create a channel</h2>
            <InfoInput
                id="name"
                label="Name"
                value={name}
                setValue={setName}
                submit={() => { }}
            />
            <InfoInput
                id="password"
                label="Password"
                value={password}
                setValue={setPassword}
                submit={() => { }}
            />
            <p>Visibility (public / private / protected) ....</p>
            <InfoInput
                id="searchAdmin"
                label="Admins"
                value={searchAdminValue}
                setValue={setSearchAdminValue}
                submit={() => searchAdminUser()}
            />
            {
                searchAdmin &&
                <FriendSearch
                    key={searchAdmin.id}
                    id={searchAdmin.id}
                    username={searchAdmin.username}
                    avatar={searchAdmin.avatar}
                    userStatus={searchAdmin.userStatus}
                    invitation={true}
                    accept={() => addAdmin(searchAdmin)}
                    refuse={() => console.log("admin refused")}
                />
            }
            {
                admins.length ?
                    <CollectionElement
                        title="Admins"
                        collection={
                            admins.map((user: any) =>
                                <FriendSearch
                                    key={user.id}
                                    id={user.id}
                                    username={user.username}
                                    avatar={user.avatar}
                                    userStatus={user.userStatus}
                                    delete={() => removeAdmins(user)}
                                />
                            )
                        }
                    />
                    : null
            }
            <InfoInput
                id="searchMember"
                label="Members"
                value={searchMember}
                setValue={setSearchMember}
                submit={() => { }}
            />
            {
                members.length ?
                    <CollectionElement
                        title="Members"
                        collection={[]}
                    />
                    : null
            }
        </div>
    )
}


export function AddChannel() {

    const { socket } = useChatSocket();

    useEffect(() => {
        /* console.log("channel created")
        socket.emit('createChannel', {
            name: "channel2",
            type: "PUBLIC",
        }) */
    }, [])

    return (
        <div className="flex-center add-channel">
            <div className="flex-column-center addchannel-button-container">
                <Link to={"join"} className="button flex-center add-channel-button">
                    Join a Channel
                </Link>
                <Link to={"create"} className="button flex-center add-channel-button">
                    Create a Channel
                </Link>
            </div>
        </div>
    )
}
