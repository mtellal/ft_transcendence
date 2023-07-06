import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import useFetchUsers from "../../../hooks/useFetchUsers";
import { createChannel, getChannelByName, getWhisperChannel } from "../../../requests/chat";
import { useChannels } from "../../../hooks/Chat/useChannels";
import { ChatInterfaceContext } from "../Chat/Chat";
import { useChannelsContext, useCurrentUser } from "../../../hooks/Hooks";
import { ConfirmView } from "../Profile/ChannelProfile/ConfirmAction";
import { ChannelSearchLabel } from "../components/ChannelSearchLabel/ChannelSearchLabel";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";
import { useBlock } from "../../../hooks/Chat/useBlock";
import { useFriendRequest } from "../../../hooks/Chat/Friends/useFriendRequest";
import { useNavigate } from "react-router-dom";
import { getBlockList } from "../../../requests/block";
import { getUserProfilePictrue } from "../../../requests/user";
import Icon, { CheckedIcon } from "../../../components/Icon";
import ProfilePicture from "../../../components/users/ProfilePicture";
import { UserInfos } from "../../../components/users/UserInfos";
import { Block, Channel, User } from "../../../types";

import search from '../../../assets/search.svg'
import useradd from '../../../assets/User_Add.svg'
import moreVertical from '../../../assets/moreVertical.svg'

import './SearchElement.css'
import useOutsideClick from "../../../hooks/useOutsideClick";

export const SearchedChannelLabelContext: React.Context<any> = createContext(null);

type TUserProps = {
    user: User, 
    resetInput?: () => void
}

function SearchedUserIconProfile(props: TUserProps) {

    const navigate = useNavigate();

    return (
        <div style={{ padding: '0 5px' }}>
            <Icon
                icon="person"
                onClick={async () => props.user && navigate(`/user/${props.user.id}`)}
                description="profile"
            />
        </div>
    )
}

function SearchedUserIconChat(props: TUserProps) {

    const navigate = useNavigate();

    const { user, token } = useCurrentUser();
    const { channels } = useChannelsContext();
    const { addChannel } = useChannels();

    async function selectChannel() {
        let channel;
        if (channels && channels.length) {
            channel = channels.find((c: Channel) =>
                c.type === "WHISPER" && c.members.find((id: number) => props.user.id === id))
        }
        if (!channel) {
            await getWhisperChannel(user.id, props.user.id, token)
                .then(res => {
                    if (res.data) {
                        channel = res.data
                    }
                })
        }
        return (channel);
    }

    return (
        <div style={{ padding: '0 5px' }}>
            <Icon
                icon="chat"
                onClick={async () => {
                    let channel = await selectChannel();
                    if (!channel) {
                        await createChannel({
                            name: "privateMessage",
                            type: "WHISPER",
                            members: [
                                props.user.id
                            ],
                        }, token)
                            .then(res => { channel = res.data })
                    }
                    await addChannel(channel, false);
                    navigate(`/chat/user/${props.user.id}`)
                }}
                description="chat"
            />
        </div>
    )
}


function SearchedUserIconFriend(props: TUserProps) {

    const { user, token } = useCurrentUser();
    const { setAction } = useContext(ChatInterfaceContext);

    const { sendRequest } = useFriendRequest();
    const { isUserFriend, removeFriend } = useFriends();

    const [currentUserBlocked, setCurrentUserBlocked] = useState(false);

    async function loadBlockList() {
        const blockList = await getBlockList(props.user && props.user.id, token).then(res => res.data);
        if (blockList && blockList.length && blockList.find((o: Block) => o.userId === user.id))
            setCurrentUserBlocked(true);
    }


    useEffect(() => {
        if (props.user && props.user.id) {
            loadBlockList();
        }
    }, [props.user])

    return (
        <div style={{ padding: '0 5px' }}>
            {
                isUserFriend(props.user) ?
                    <CheckedIcon
                        icon={useradd}
                        onClick={() => {
                            setAction(
                                <ConfirmView
                                    type="remove"
                                    username={props.user.username}
                                    valid={() => { removeFriend(props.user, true); setAction(null) }}
                                    cancel={() => setAction(null)}
                                />
                            )
                        }}
                        description="remove"
                    /> :
                    <>
                        {
                            !currentUserBlocked &&
                            <CheckedIcon
                                icon={useradd}
                                onClick={() => sendRequest(props.user)}
                            />
                        }
                    </>

            }
        </div>
    )
}

function SearchUserIconBlock(props: TUserProps) {

    const { setAction } = useContext(ChatInterfaceContext);
    const { isUserBlocked, blockUser, unblockUser } = useBlock();

    const [userBlocked, setUserBlocked] = useState(isUserBlocked(props.user));

    const block = useCallback(() => {
        if (userBlocked) {
            setUserBlocked(false);
            setAction(
                <ConfirmView
                    type="unblock"
                    username={props.user.username}
                    valid={() => { unblockUser(props.user); setAction(null) }}
                    cancel={() => setAction(null)}
                />
            )
        }
        else {
            setUserBlocked(true);
            setAction(
                <ConfirmView
                    type="block"
                    username={props.user.username}
                    valid={() => { blockUser(props.user); setAction(null) }}
                    cancel={() => setAction(null)}
                />
            )
        }
    }, [userBlocked])


    return (
        <div style={{ padding: '0 5px' }}>
            {
                userBlocked ?
                    <Icon
                        icon="block"
                        onClick={() => block()}
                        description="unblock"
                    /> :
                    <Icon
                        icon="block"
                        onClick={() => block()}
                        description="block"
                    />
            }
        </div>
    )
}

export function SearchedUser(props: TUserProps) {
    const [showActions, setShowActions] = useState(false);
    const ref = useOutsideClick(() => setShowActions(false))

    const navigate = useNavigate();

    const { user, token } = useCurrentUser();
    const { channels } = useChannelsContext();
    const { addChannel } = useChannels();

    async function selectChannel() {
        let channel;
        if (channels && channels.length) {
            channel = channels.find((c: Channel) =>
                c.type === "WHISPER" && c.members.find((id: number) => props.user.id === id))
        }
        if (!channel) {
            await getWhisperChannel(user.id, props.user.id, token)
                .then(res => {
                    if (res.data) {
                        channel = res.data
                    }
                })
        }
        return (channel);
    }

    return (
        <div
            className='flex-ai menu-searcheduser absolute white'
            style={{ bottom: '-50px' }}
        >
            <div style={{ minWidth: 'auto' }}>
                <UserInfos user={props.user} />
            </div>
            <div
                ref={ref}
                className="flex relative"
                style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}
            >
                {
                    props.user && props.user.id && user && props.user.id !== user.id &&
                    <Icon icon={moreVertical} onClick={() => setShowActions((p: boolean) => !p)} />
                }
                <div
                    className="absolute menu-searcheduser-actons"
                    style={showActions ? { visibility: 'visible' } : { visibility: 'hidden' }}
                    onClick={() => setShowActions((p: boolean) => !p)}
                >
                    <p className="menu-searcheduser-acton">add</p>
                    <p 
                        className="menu-searcheduser-acton"
                        onClick={async () => {
                            let channel = await selectChannel();
                            if (!channel) {
                                await createChannel({
                                    name: "privateMessage",
                                    type: "WHISPER",
                                    members: [
                                        props.user.id
                                    ],
                                }, token)
                                    .then(res => { channel = res.data })
                            }
                            await addChannel(channel, false);
                            navigate(`/chat/user/${props.user.id}`);
                            props.resetInput();
                        }}
                    >message</p>
                    <p className="menu-searcheduser-acton">block</p>
                </div>
            </div>
        </div>
    )
}


type TSearchedChannel = {
    channels: Channel[],
    reset: any
}

function SearchedChannel(props: TSearchedChannel) {

    const [renderChannels, setRenderChannels] = useState([]);
    const { fetchUsers } = useFetchUsers();
    const { setAction } = useContext(ChatInterfaceContext)
    const { addChannel, leaveChannel } = useChannels();
    const { channels } = useChannelsContext();


    function joinChannel(channel: Channel) {
        if (channel.type !== 'WHISPER') {
            setAction(
                <ConfirmView
                    type="join"
                    username={channel.name}
                    valid={() => { addChannel(channel, true); setAction(null); props.reset() }}
                    cancel={() => setAction(null)}
                />
            )
        }
    }

    function _leaveChannel(channel: Channel) {
        setAction(
            <ConfirmView
                type="leave"
                username={channel.name}
                valid={() => { leaveChannel(channel); setAction(null); props.reset() }}
                cancel={() => setAction(null)}
            />
        )
    }

    const load = useCallback(async () => {
        if (props.channels && props.channels.length) {
            setRenderChannels(
                await Promise.all(
                    props.channels.map(async (c: Channel) => {
                        c.users = await fetchUsers(c.members);
                        return (
                            <ChannelSearchLabel
                                key={c.id}
                                channel={c}
                                join={() => joinChannel(c)}
                                leaveChannel={() => _leaveChannel(c)}
                            />

                        )
                    })
                )
            )
        }
    }, [props.channels, channels]);

    useEffect(() => {
        load();
    }, [props.channels, channels])


    return (
        <SearchedChannelLabelContext.Provider value={{ reset: props.reset }}>
            {
                renderChannels
            }
        </SearchedChannelLabelContext.Provider>
    )
}


type TSearchInput = {
    id: number | any,
    blur?: boolean,
    value: string,
    setValue: (s: string) => {},
    submit?: () => {} | any,
    onChange?: any,
}

function SearchInput(props: TSearchInput) {
    const inputRef: any = React.useRef();

    function onChange(e: any) {
        if (e.target.value.length <= 20) {
            props.setValue(e.target.value);
            if (props.onChange)
                props.onChange(e)
        }
    }

    function handleKeyDown(e: any) {
        if (e.key === 'Enter' && props.value) {
            props.submit()
            if (props.blur)
                inputRef.current.blur();
        }
    }

    return (
        <div className="menu-searchinput" >
            <div className="" style={{ marginRight: '5px' }}>
                <img src={search} alt="search" />
            </div>
            <input

                id="menu-searchinput-input"
                ref={inputRef}
                placeholder="Search"
                value={props.value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}

export default function SearchElement() {
    const { token } = useCurrentUser();
    const [value, setValue]: any = useState("");
    const [error, setError] = useState("");
    const [searchedUser, setSearchedUser] = useState();
    const [channelList, setChannelList] = useState([]);

    const { fetchUserByUsername } = useFetchUsers();

    async function searchUser() {
        if (!value || !value.trim())
            return;
        let user;
        let channelArray;
        setError("");
        setSearchedUser(null);
        setChannelList([]);
        user = await fetchUserByUsername(value.trim());
        if (user) {
            setSearchedUser(user);
        }
        await getChannelByName(value.trim(), token)
            .then(res => {
                if (res.data) {
                    channelArray = res.data;
                }
            })
        if (channelArray) {
            setChannelList(channelArray);
        }
        if (!user && !channelArray)
            setError("User/Channel not found");
    }

    function reset() {
        setChannelList(null);
        setSearchedUser(null);
        setValue("")
    }

    return (
        <div
            className="menu-searchelement relative"

        >
            <SearchInput
                id="searchUser"
                value={value}
                setValue={setValue}
                submit={() => searchUser()}
                onChange={() => { setSearchedUser(null); setChannelList([]) }}
            />
            {error && <p className="reset red-c">{error}</p>}
            {
                searchedUser && <SearchedUser resetInput={() => reset()} user={searchedUser} />
            }
            {
                channelList && channelList.length ?
                    <SearchedChannel
                        channels={channelList}
                        reset={reset}
                    />
                    : null
            }
        </div>
    )
}