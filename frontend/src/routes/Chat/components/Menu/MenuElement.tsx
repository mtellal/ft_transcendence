
import React, { useCallback, useContext, useEffect, useState, createContext} from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import UserLabel from "../../../../components/users/UserLabel";
import { useChannelsContext, useFriendsContext, useCurrentUser } from "../../../../hooks/Hooks";
import { createChannel, getChannel, getChannelByName, getChannels, getWhisperChannel } from "../../../../requests/chat";
import { useWindow } from "../../../../hooks/useWindow";

import './MenuElement.css'
import Icon, { RawIcon } from "../../../../components/Icon";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import InfoInput from "../../../../components/Input/InfoInput";
import { getBlockList } from "../../../../requests/block";
import { getUserProfilePictrue } from "../../../../requests/user";
import { UserInfos } from "../../../../components/users/UserInfos";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import ProfilePicture from "../../../../components/users/ProfilePicture";
import { useFriends } from "../../../../hooks/Chat/Friends/useFriends";
import { useBlock } from "../../../../hooks/Chat/useBlock";
import { ChatInterfaceContext } from "../../Chat/Chat";
import { useFriendRequest } from "../../../../hooks/Chat/Friends/useFriendRequest";
import { FriendRequests } from "../../AddFriend/AddFriend";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import useBanUser from "../../../../hooks/Chat/useBanUser";
import { ChannelSearchLabel } from "../ChannelSearchLabel/ChannelSearchLabel";
import { ConfirmView } from "../../Profile/ChannelProfile/ConfirmAction";

/*
    tittle
    add => {
        removeNotif
        notification
    }
    collection
*/




export function CollectionElement(props: any) {

    return (
        <div className="collection">
            <div className="collection-label" >
                <h2 className="collection-title">{props.title}</h2>
                {
                    props.add ?
                        <Link
                            to="/chat/channel/create"
                            onClick={props.removeNotif}
                            style={{ textDecoration: 'none', color: 'black', justifySelf: 'flex-end' }}
                        >
                            <Icon icon="add" description="add" />
                        </Link>
                        : null
                }
            </div>
            <div className="flex-column">
                {props.collection}
            </div>
        </div>
    )
}


/*
    2 setCurrentxxxxx in parent and child === bad approach
    1 setXXX in parent and called in child (parent will be updated as child)
*/

export default function MenuElement() {

    const location = useLocation();

    const { user, token } = useCurrentUser();
    const { friends, friendsDispatch, setCurrentFriend } = useFriendsContext();
    const {
        channels,
    } = useChannelsContext();

    const { addChannel } = useChannels();

    const [friendsList, setFriendsList] = React.useState([]);
    const [channelsList, setChannelsList] = useState([]);

    const { isMobileDisplay } = useWindow();
    const [hideMenu, setHideMenu] = useState(true);

    const [whispersList, setWhispersList] = useState([]);

    const navigate = useNavigate();

    const { fetchUser } = useFetchUsers();

    useEffect(() => {
        if (location && location.pathname === "/chat" && isMobileDisplay)
            setHideMenu(false)
        else
            setHideMenu(true)
    },)

    const setWhispers = useCallback(async () => {
        if (channels && channels.length) {
            const whispers = await Promise.all(
                channels.map(async (channel: any) => {
                    if (channel.type === "WHISPER" && channel.members.length === 2) {
                        let _user = channel.members.find((id: number) => id !== user.id);
                        console.log(_user)
                        _user = await fetchUser(_user);
                        return (
                            <UserLabel
                                key={_user.id}
                                id={_user.id}
                                username={_user.username}
                                profilePictureURL={_user.url}
                                userStatus={_user.userStatus}
                                onClick={() => { }}
                                notifs={_user.notifs}
                            />
                        )
                    }
                })
            )
            setWhispersList(whispers)
        }
    }, [channels]);

    async function setFriendsLabel() {
        setFriendsList(
            friends.map((user: any) => (
                <UserLabel
                    key={user.id}
                    id={user.id}
                    username={user.username}
                    profilePictureURL={user.url}
                    userStatus={user.userStatus}
                    onClick={() => { }}
                    notifs={user.notifs}
                />
            ))
        )
    }

    React.useEffect(() => {
        setChannelsList([]);
        setFriendsList([]);

        if (channels && channels.length) {
            setWhispers();

            setChannelsList(
                channels.map((channel: any) =>
                    channel.type !== "WHISPER" && (
                        <div
                            key={channel.id}
                            className="pointer"
                            style={{ borderTop: '1px solid black' }}
                            onClick={() => navigate(`/chat/channel/${channel.id}`)}
                        >
                            <ChannelInfos
                                key={channel.id}
                                channel={channel}
                            />
                        </div>
                    ))
            )
        }

        if (friends && friends.length) {
            setFriendsLabel();
        }

    }, [friends, channels])

    return (
        <div
            className={hideMenu ? "menu-container hidden" : "menu-container visible"}
        >

            <SearchUser
            />
            <FriendRequests />
            <CollectionElement
                title="Channels"
                collection={channelsList}
                add={true}
            />
            <CollectionElement
                title="Whispers"
                collection={whispersList}
            />
            <CollectionElement
                title="Friends"
                collection={friendsList}
                friend={true}
            />
        </div>
    )
}



function SearchUser() {
    const [value, setValue]: any = useState("");
    const [user, setUser] = useState();
    const [channelList, setChannelList] = useState([]);
    const [error, setError] = useState("");

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
                    if (res.data)
                    {
                        console.log(res.data)
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

    function reset()
    {
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
                user &&
                <SearchedUser
                    user={user}
                />
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

export const SearchedChannelLabelContext : React.Context<any> = createContext(null);

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
                                            valid={() => { leaveChannel(c); setAction(null); props.reset()}}
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
        <SearchedChannelLabelContext.Provider value={{reset: props.reset}}>
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



/* 

     username: string,
    profilePictureURL: string,
    userStatus: string,
    onClick?: () => {} | any
*/

type TType = {
    user: any,
    add?: boolean,
    onClick?: () => {} | any
}

export function SearchedUser(props: TType) {
    const [invitation, setInvitation]: [any, any] = React.useState(false);
    const { user, token } = useCurrentUser();

    const { setAction } = useContext(ChatInterfaceContext)

    const [url, setUrl]: any = useState();
    const { isUserFriend, removeFriend } = useFriends();
    const { isUserBlocked, blockUser, unblockUser } = useBlock();

    const { sendRequest } = useFriendRequest();

    const [currentUserBlocked, setCurrentUserBlocked] = useState(false);

    const navigate = useNavigate();

    const { channels } = useChannelsContext();

    const { addChannel } = useChannels();

    async function loadBlockList() {
        const blockList = await getBlockList(props.user && props.user.id, token).then(res => res.data);
        if (blockList && blockList.length && blockList.find((o: any) => o.userId === user.id))
            setCurrentUserBlocked(true);
    }

    async function loadURL() {
        await getUserProfilePictrue(props.user && props.user.id)
            .then(res => {
                if (res.status == 200 && res.statusText == "OK")
                    setUrl(window.URL.createObjectURL(new Blob([res.data])))
            })
    }

    useEffect(() => {
        if (props.user && props.user.id) {
            loadURL();
            loadBlockList();
        }
    }, [props.user])


    return (
        <div className='flex-ai UserLabelSearch-container'>
            <UserInformations user={props.user} />

            <div className="flex" style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-start' }}>

                <Icon
                    icon="chat"
                    onClick={async () => {
                        let channel;
                        // console.log(props.user, props.user.id)
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
                        console.log("channel whit getWHISPER", channel)
                        if (!channel) {
                            console.log("create channel")
                            await createChannel({
                                name: "privateMessage",
                                type: "WHISPER",
                                members: [
                                    props.user.id
                                ],
                            }, token)
                                .then(res => { channel = res.data })
                                .catch(err => { })
                        }
                        await addChannel(channel, false);
                        navigate(`/chat/user/${props.user.id}`)
                    }}
                    description="chat"
                />

                {
                    isUserFriend(props.user)?
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
                {
                    !currentUserBlocked && props.add && !invitation &&
                    <Icon
                        icon="add"
                        onClick={() => { props.onClick(); setInvitation(true) }}
                    />
                }
            </div>
        </div>
    )
}



export type TT = {
    user: any,
    onClick?: () => {} | any
}

export function UserInformations(props: TT) {

    function selectStatusDiv() {
        if (props.user && props.user.userStatus === "ONLINE")
            return ({ backgroundColor: "#14CA00" })
        else if (props.user && props.user.userStatus === "OFFLINE")
            return ({ backgroundColor: "#FF0000" })
        else if (props.user && props.user.userStatus === "INGAME")
            return ({ backgroundColor: '#FFC600' })
    }

    function selectStatusText() {
        if (props.user && props.user.userStatus === "ONLINE")
            return ("On line")
        else if (props.user && props.user.userStatus === "OFFLINE")
            return ("Disconnected")
        else if (props.user && props.user.userStatus === "INGAME")
            return ("In game")
    }

    return (
        <div className="userinfos-container" onClick={props.onClick} >
            <div className='userinfos-pp-container'>
                <ProfilePicture
                    image={props.user && props.user.url}
                />
            </div>
            <div
                className="userinfos-icon-status"
                style={selectStatusDiv()}
            />
            <div className="flex-column user-infos">
                <p className="userinfos-username" >{props.user && props.user.username}</p>
                <p className="userinfos-status">
                    {selectStatusText()}
                </p>
            </div>
        </div>
    )
}