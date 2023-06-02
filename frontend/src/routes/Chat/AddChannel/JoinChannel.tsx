
import React, { useEffect, useState } from "react";
import {
    validFriendRequest,
    refuseFriendRequest,
} from '../../../requests/friendsRequest'

import { getChannelByName } from '../../../requests/chat'

import {
    getUser,
    getUserProfilePictrue,

} from '../../../requests/user'

import { UserLabelSearch } from "../../../components/users/UserLabel";

import IconInput from "../../../components/Input/IconInput";
import { useOutletContext } from "react-router-dom";
import { CollectionElement } from "../components/Menu/MenuElement";

import { useChannels, useChatSocket, useFriends, useCurrentUser } from "../../../hooks/Hooks";
import ProfilePicture from "../../../components/users/ProfilePicture";
import Icon from "../../../components/Icon";

import defaultUserPP from '../../../assets/user.png'

import './JoinChannel.css'

type TChannelSearch = {
    name: string,
    members: any[],
    isJoin: boolean,
    join: () => {} | any
}

function ChannelSearch(props: TChannelSearch) {

    const [members, setMembers] = useState([]);

    async function loadUsersProfilePicter() {
        const rawProfilePictures = await Promise.all(props.members.map(async (id: any, i: number) =>
            i < 5 ? await getUserProfilePictrue(id).then(res => res.data) : null
        ))
        const images = rawProfilePictures.map((i: any) =>
            i ? window.URL.createObjectURL(new Blob([i])) : defaultUserPP
        )
        setMembers(images.map((url: any) =>
            <div key={url} className="channelsearch-pp-container">
                <ProfilePicture key={url} image={url} />
            </div>
        ))
    }

    useEffect(() => {
        if (props.members)
            loadUsersProfilePicter();
    }, [props.members])

    return (
        <div className="flex-ai channelsearch-container">
            <h3 className="no-wrap">{props.name} - </h3>
            <p className="channelsearch-members gray-c flex-center no-wrap">{props.members.length} members</p>
            <div className="channelsearch-pps flex-center hidden">
                {members}
            </div>
            {
                props.isJoin &&
                <div style={{ marginLeft: 'auto' }}>
                    <Icon icon="login" description="Join" onClick={props.join} />
                </div>
            }
        </div>
    )
}

export default function JoinChannel() {

    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(false);
    const { socket } = useChatSocket();

    const [matchChannels, setMatchChannels] = useState([]);
    const [renderChannels, setRenderChannels] = useState([]);

    const [userInvitations, setUserInvitations]: [any, any] = React.useState([]);
    const [invitations, setInvitations]: [any, any] = React.useState([]);
    const {
        channels,
        channelsDispatch,
        channelAlreadyExists,
        addChannel
    } = useChannels();

    const {
        token,
        user,
        setUser
    }: any = useCurrentUser();

    const { friends, friendsDispatch }: any = useFriends();

    const {
        friendInvitations,
        removeFriendRequest
    }: any = useOutletContext();


    function fetchError() {
        setError(true);
        setMatchChannels(null);
    }

    async function searchChannel() {
        if (prevValue === value)
            return;
        await getChannelByName(value)
            .then(res => {
                if (res.status === 200 && res.statusText === "OK") {
                    let channels: any[];
                    setError(false)
                    if (res.data.length)
                        channels = res.data.filter((c: any) => c.type !== "WHISPER");
                    if (channels.length)
                        setMatchChannels(channels)
                    else
                        fetchError();
                }
                else
                    fetchError();
            })
            .catch(err => fetchError())
        setPrevValue(value);
    }

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


    /* function joinChannel(channel: any) {
        channelsDispatch({ type: 'addChannel', channel })
        socket.emit('joinChannel', {
            channelId: channel.id
        })
        setRenderChannels([]);
    } */

    React.useEffect(() => {
        if (userInvitations && userInvitations.length) {
            setInvitations(userInvitations.map((u: any) =>
                <UserLabelSearch
                    key={u.id}
                    id={u.id}
                    username={u.username}
                    profilePictureURL={u.avatar}
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
                        name={c.name}
                        members={c.members}
                        isJoin={!channelAlreadyExists(c)}
                        join={() => addChannel(c)}
                    />)
            )
        }
    }, [matchChannels])

    return (
        <div className="joinchannel-container">
            <h2>Join a Channel</h2>
            <div className="flex-column-center">
                <IconInput
                    id="search"
                    icon="search"
                    placeholder="Channel"
                    value={value}
                    setValue={setValue}
                    submit={() => value && searchChannel()}
                />
                <button
                    className="button joinchannel-button"
                    onClick={searchChannel}
                >
                    Search
                </button>
                {renderChannels}
                {
                    error ? <p>Channel not found</p> : null
                }
                {
                    userInvitations.length ?
                        <div className="joinchannel-invitations">
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