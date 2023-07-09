import React, { createContext, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import useFetchUsers from "../../../hooks/useFetchUsers";
import { createChannel, getChannelByName, getWhisperChannel } from "../../../requests/chat";
import { useChannels } from "../../../hooks/Chat/useChannels";
import { ChatInterfaceContext } from "../Chat/Chat";
import { useChannelsContext, useCurrentUser } from "../../../hooks/Hooks";
import { ConfirmView } from "../Profile/ChannelProfile/ConfirmAction";
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
import ChannelInfos from "../../../components/channels/ChannelInfos";
import useMembers from "../../../hooks/Chat/useMembers";

export const SearchedChannelLabelContext: React.Context<any> = createContext(null);

type TUserProps = {
    user: User,
    resetInput?: () => void
}

export function SearchedUser(props: TUserProps) {

    const navigate = useNavigate();
    const { setAction } = useContext(ChatInterfaceContext);
    const { isUserBlocked, blockUser, unblockUser } = useBlock();

    const [showActions, setShowActions] = useState(false);
    const ref = useOutsideClick(() => setShowActions(false))


    const { user, token } = useCurrentUser();
    const { channels } = useChannelsContext();
    const { addChannel, selectWhisperChannel } = useChannels();
    const { sendRequest } = useFriendRequest();


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
                    <p
                        className="menu-searcheduser-acton"
                        onClick={() => sendRequest(props.user)}
                    >
                        add
                    </p>


                    <p
                        className="menu-searcheduser-acton"
                        onClick={async () => {
                            let channel = await selectWhisperChannel(props.user);
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
                    <p
                        className="menu-searcheduser-acton"
                        onClick={() => {
                            setAction(
                                <ConfirmView
                                    type="block"
                                    username={props.user.username}
                                    valid={() => { blockUser(props.user); setAction(null) }}
                                    cancel={() => setAction(null)}
                                />
                            )
                        }}

                    >block</p>
                </div>
            </div>
        </div >
    )
}

type TChannelSearchLabel = {
    channel: Channel,
    notifs?: number,
    onClick?: () => {} | any
    disable?: boolean,
    resetInput: () => void
}

export function ChannelSearchLabel(props: TChannelSearchLabel) {

    const settingsRef: any = useRef();

    const navigate = useNavigate();

    const { user } = useCurrentUser();
    const { isUserMember } = useMembers();

    const { setAction } = useContext(ChatInterfaceContext);

    const [showActions, setShowActions] = useState(false);
    const ref = useOutsideClick(() => setShowActions(false))

    const { addChannel, leaveChannel } = useChannels();


    return (
        <div className="flex-ai menu-searcheduser white"
            style={{ margin: '5px auto 0 auto', }}
            onClick={props.onClick && props.onClick}
        >
            <ChannelInfos {...props} />
            <div
                ref={ref}
                className="flex"
                style={{ justifyContent: 'flex-end', alignItems: 'flex-start' }}
            >
                <div ref={settingsRef} style={{ height: '30px', marginLeft: '5px' }}>
                    <Icon icon={moreVertical} onClick={() => setShowActions((p: boolean) => !p)} />
                </div>
                <div
                    className="absolute menu-searcheduser-actons-channel"
                    style={showActions ? { visibility: 'visible', zIndex: '5', bottom: `${settingsRef.current.offsetBottom}px` } : { visibility: 'hidden' }}
                    onClick={() => setShowActions((p: boolean) => !p)}
                >
                    {
                        isUserMember(user, props.channel) ?
                            <>
                                <p className="menu-searcheduser-acton"
                                    onClick={() => {
                                        setAction(
                                            <ConfirmView
                                                type="leave"
                                                username={props.channel.name}
                                                valid={() => { leaveChannel(props.channel); setAction(null) }}
                                                cancel={() => setAction(null)}
                                            />
                                        );
                                        props.resetInput();
                                    }}
                                >
                                    Leave
                                </p>
                                <p
                                    className="menu-searcheduser-acton"
                                    onClick={() => {
                                        navigate(`/chat/channel/${props.channel.id}`);
                                        props.resetInput();
                                    }}
                                >Message</p>
                            </>
                            :
                            <p className="menu-searcheduser-acton"
                                onClick={() => {
                                    addChannel(props.channel, true)
                                    props.resetInput();
                                }}
                            >
                                Join
                            </p>
                    }
                </div>
            </div>
        </div>
    )
}

type TSearchedChannel = {
    channels: Channel[],
    reset: any
}

export function SearchedChannel(props: TSearchedChannel) {

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
                                resetInput={props.reset}
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
            <div className="absolute"
                style={{ zIndex: '3', width: '100%', bottom: `-${renderChannels.length * 60}px`, alignItems: 'center' }}>
                {
                    renderChannels
                }
            </div>
        </SearchedChannelLabelContext.Provider>
    )
}


type TSearchInput = {
    blur?: boolean,
    value: string,
    setValue: (s: string) => {},
    submit?: () => {} | any,
    onChange?: any,
}

export function SearchInput(props: TSearchInput) {
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
                value={value}
                setValue={setValue}
                submit={() => searchUser()}
                onChange={() => { setSearchedUser(null); setChannelList([]); setError("") }}
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