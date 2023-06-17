import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import useFetchUsers from "../../../../../hooks/useFetchUsers";
import { createChannel, getChannelByName, getWhisperChannel } from "../../../../../requests/chat";
import { useChannels } from "../../../../../hooks/Chat/useChannels";
import { ChatInterfaceContext } from "../../../Chat/Chat";
import { useChannelsContext, useCurrentUser } from "../../../../../hooks/Hooks";
import { ConfirmView } from "../../../Profile/ChannelProfile/ConfirmAction";
import { ChannelSearchLabel } from "../../ChannelSearchLabel/ChannelSearchLabel";
import { useFriends } from "../../../../../hooks/Chat/Friends/useFriends";
import { useBlock } from "../../../../../hooks/Chat/useBlock";
import { useFriendRequest } from "../../../../../hooks/Chat/Friends/useFriendRequest";
import { useNavigate } from "react-router-dom";
import { getBlockList } from "../../../../../requests/block";
import { getUserProfilePictrue } from "../../../../../requests/user";
import Icon from "../../../../../components/Icon";
import ProfilePicture from "../../../../../components/users/ProfilePicture";
import { UserInfos } from "../../../../../components/users/UserInfos";

export const SearchedChannelLabelContext: React.Context<any> = createContext(null);

type TSearchedUserIconChat = {
    user: any
}

function SearchedUserIconChat(props: TSearchedUserIconChat) {

    const navigate = useNavigate();

    const { user, token } = useCurrentUser();
    const { channels } = useChannelsContext();
    const { addChannel } = useChannels();

    async function selectChannel() {
        let channel;
        if (channels && channels.length) {
            console.log("channels not empty", channels)
            channel = channels.find((c: any) =>
                c.type === "WHISPER" && c.members.find((id: number) => props.user.id === id))
        }
        if (!channel) {
            await getWhisperChannel(user.id, props.user.id)
                .then(res => {
                    if (res.data) {
                        channel = res.data
                    }
                })
        }
        return (channel);
    }

    return (
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
    )
}


function SearchedUserIconFriend(props: any) {

    const { user, token } = useCurrentUser();
    const { setAction } = useContext(ChatInterfaceContext);

    const { sendRequest } = useFriendRequest();
    const { isUserFriend, removeFriend } = useFriends();

    const [currentUserBlocked, setCurrentUserBlocked] = useState(false);

    async function loadBlockList() {
        const blockList = await getBlockList(props.user && props.user.id, token).then(res => res.data);
        if (blockList && blockList.length && blockList.find((o: any) => o.userId === user.id))
            setCurrentUserBlocked(true);
    }


    useEffect(() => {
        if (props.user && props.user.id) {
            loadBlockList();
        }
    }, [props.user])

    return (
        <>
            {
                isUserFriend(props.user) ?
                    <Icon
                        icon="person_remove"
                        onClick={() => {
                            setAction(
                                <ConfirmView
                                    type="remove"
                                    username={props.user.username}
                                    valid={() => { removeFriend(props.user); setAction(null) }}
                                    cancel={() => setAction(null)}
                                />
                            )
                        }}
                        description="remove"
                    /> :
                    <>
                        {
                            !currentUserBlocked &&
                            <Icon
                                icon="person_add"
                                onClick={() => {
                                    setAction(
                                        <ConfirmView
                                            type="add"
                                            username={props.user.username}
                                            valid={() => { sendRequest(props.user); setAction(null) }}
                                            cancel={() => setAction(null)}
                                        />
                                    )
                                }}
                                description="add"
                            />
                        }
                    </>

            }
        </>
    )
}

type TSearchedUser = {
    user: any
}

export function SearchedUser(props: TSearchedUser) {

    const { setAction } = useContext(ChatInterfaceContext);

    const { user, token } = useCurrentUser();

    const { sendRequest } = useFriendRequest();
    const { isUserFriend, removeFriend } = useFriends();
    const { isUserBlocked, blockUser, unblockUser } = useBlock();

    const [currentUserBlocked, setCurrentUserBlocked] = useState(false);

    async function loadBlockList() {
        const blockList = await getBlockList(props.user && props.user.id, token).then(res => res.data);
        if (blockList && blockList.length && blockList.find((o: any) => o.userId === user.id))
            setCurrentUserBlocked(true);
    }


    useEffect(() => {
        if (props.user && props.user.id) {
            loadBlockList();
        }
    }, [props.user])


    return (
        <div className='flex-ai UserLabelSearch-container'>
            <UserInfos
                username={props.user && props.user.username}
                profilePictureURL={props.user && props.user.url}
                userStatus={props.user && props.user.userStatus}
            />

            <div
                className="flex"
                style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-start' }}
            >

                <SearchedUserIconChat
                    user={props.user}
                />

                <SearchedUserIconFriend
                    user={props.user}
                />
                {
                    isUserBlocked(props.user) ?
                        <Icon
                            icon="block"
                            onClick={() => {
                                setAction(
                                    <ConfirmView
                                        type="unblock"
                                        username={props.user.username}
                                        valid={() => { unblockUser(props.user); setAction(null) }}
                                        cancel={() => setAction(null)}
                                    />
                                )
                            }}
                            description="unblock"
                        /> :
                        <Icon
                            icon="block"
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
                            description="block"
                        />
                }
                {/* {
                    !currentUserBlocked && props.add && !invitation &&
                    <Icon
                        icon="add"
                        onClick={() => { props.onClick(); setInvitation(true) }}
                    />
                } */}
            </div>
        </div>
    )
}




function SearchedChannel(props: any) {

    const [renderChannels, setRenderChannels] = useState([]);
    const { fetchUsers } = useFetchUsers();
    const { setAction } = useContext(ChatInterfaceContext)
    const { addChannel, leaveChannel } = useChannels();
    const { channels } = useChannelsContext();


    function joinChannel(channel: any) {
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

    const load = useCallback(async () => {
        if (props.channels && props.channels.length) {
            setRenderChannels(
                await Promise.all(
                    props.channels.map(async (c: any) => {
                        const users = await fetchUsers(c.members);
                        c.users = users;
                        return (
                            <ChannelSearchLabel
                                key={c.id}
                                channel={c}
                                join={() => joinChannel(c)}
                                leaveChannel={() =>
                                    setAction(
                                        <ConfirmView
                                            type="leave"
                                            username={c.name}
                                            valid={() => { leaveChannel(c); setAction(null); props.reset() }}
                                            cancel={() => setAction(null)}
                                        />
                                    )
                                }
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


type TMenuInput = {
    id: number | any,
    blur?: boolean,
    value: string,
    setValue: (s: string) => {},
    submit?: () => {} | any,
    onChange?: any
}

function MenuInput(props: TMenuInput) {
    const inputRef: any = React.useRef();

    function onChange(e: any) {
        props.setValue(e.target.value);
        if (props.onChange)
            props.onChange(e)
    }

    function handleKeyDown(e: any) {
        if (e.key === 'Enter' && props.value) {
            props.submit()
            if (props.blur)
                inputRef.current.blur();
        }
    }

    return (
        <div className="flex-column fill" style={{ paddingBottom: '15px' }}>
            <input
                ref={inputRef}
                id={props.id}
                className="menuinput-input"
                placeholder="Search ..."
                value={props.value}
                onChange={onChange}
                onKeyDown={handleKeyDown}
            />
        </div>
    )
}



export default function SearchElement() {
    const [value, setValue]: any = useState("");
    const [error, setError] = useState("");
    const [user, setUser] = useState();
    const [channelList, setChannelList] = useState([]);

    const { fetchUserByUsername } = useFetchUsers();

    async function searchUser() {
        if (!value || !value.trim())
            return;
        let user;
        let channelArray;
        setError("");
        setUser(null);
        setChannelList([]);
        user = await fetchUserByUsername(value.trim());
        if (user) {
            setUser(user);
        }
        else {
            await getChannelByName(value.trim())
                .then(res => {
                    if (res.data) {
                        channelArray = res.data;
                    }
                })
            if (channelArray) {
                setChannelList(channelArray);
            }
            else {
                setError("User/Channel not found");
            }
        }
    }

    function reset() {
        setChannelList(null);
        setUser(null);
        setValue("")
    }

    return (
        <div className="">
            <MenuInput
                id="searchUser"
                value={value}
                setValue={setValue}
                submit={() => searchUser()}
            />
            {error && <p className="reset red-c">{error}</p>}
            {
                user && <SearchedUser user={user} />
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