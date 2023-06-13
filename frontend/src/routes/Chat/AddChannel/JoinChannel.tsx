
import React, { useCallback, useEffect, useState } from "react";

import { getChannelByName, getChannelProtected } from '../../../requests/chat'

import {
    getUser,
    getUserProfilePictrue,

} from '../../../requests/user'


import IconInput from "../../../components/Input/IconInput";

import { useChannelsContext, useChatSocket, useFriendsContext, useCurrentUser } from "../../../hooks/Hooks";
import ProfilePicture from "../../../components/users/ProfilePicture";
import Icon, { RawIcon } from "../../../components/Icon";

import defaultUserPP from '../../../assets/user.png'

import './JoinChannel.css'
import { useWindow } from "../../../hooks/useWindow";
import ArrowBackMenu from "../components/ArrowBackMenu";
import useBanUser from "../../../hooks/Chat/useBanUser";
import ResizeContainer from "../../../components/ResizeContainer";
import useChannelAccess from "../../../hooks/Chat/useChannelAccess";
import InfoInput from "../../../components/Input/InfoInput";
import useChannelInfos from "../../../hooks/Chat/useChannelInfos";
import { useChannels } from "../../../hooks/Chat/useChannels";

type TChannelSearch = {
    channel: any,
    setJoinChannelProtectedView?: (x: {}) => {} | any,
    join: () => {} | any
}

function ChannelSearch({ channel, ...props }: TChannelSearch) {

    const { user } = useCurrentUser();
    const { channelAlreadyExists } = useChannels();
    const { isChannelProtected, isChannelPrivate } = useChannelAccess();
    const { isUserBanned } = useBanUser()

    const [members, setMembers] = useState([]);

    const [channelPasswordView, setChannelPasswordView] = useState(false);


    async function loadUsersProfilePicture() {
        const rawProfilePictures = await Promise.all(channel.members.map(async (id: any, i: number) =>
            i < 5 ? await getUserProfilePictrue(id).then(res => res.data) : null
        ))
        const images = rawProfilePictures.map((i: any) =>
            i ? window.URL.createObjectURL(new Blob([i])) : defaultUserPP
        )
        setMembers(images.map((url: any) =>
            <div key={url} className="channelsearch-pp-container flex-center">
                <ResizeContainer height="40%">
                    <ProfilePicture image={url} />
                </ResizeContainer>
            </div>
        ))
    }

    useEffect(() => {
        if (channel.members)
            loadUsersProfilePicture();
    }, [channel.members])


    function joinChannel() {
        if (isChannelProtected(channel)) {
            props.setJoinChannelProtectedView({ display: true, channel });
        }
        else
            props.join();
    }

    function renderIcon() {
        if (isUserBanned(user, channel)) {
            return (
                <div style={{ marginLeft: 'auto' }}>
                    <p className="red-c">Banned</p>
                </div>
            )
        }
        else if (!channelAlreadyExists(channel) && !isChannelPrivate(channel)) {
            return (
                <div style={{ marginLeft: 'auto' }}>
                    <Icon icon="login" description="Join" onClick={() => joinChannel()} />
                </div>
            )
        }
    }

    return (
        <div className="flex-ai channelsearch-container">
            <h3 className="no-wrap">{channel.name} - </h3>
            {
                isChannelPrivate(channel) && 
                <RawIcon icon="lock" />
            }
            {
                isChannelProtected(channel) && 
                <RawIcon icon="shield" />
            }
            <p className="channelsearch-members gray-c flex-center no-wrap">{channel.members.length} members</p>
            <div className="channelsearch-pps flex-center">
                {members}
            </div>
            {
                renderIcon()
            }

        </div>
    )
}

export default function JoinChannel() {

    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(false);

    const [matchChannels, setMatchChannels] = useState([]);
    const [renderChannels, setRenderChannels] = useState([]);

    const [joinChannelProtectedView, setJoinChannelProtectedView]: any = useState({ display: false });

    const { isMobileDisplay } = useWindow();

    const {
        channels,
    } = useChannelsContext();

    const { addChannel } = useChannels();

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
            .catch(() => fetchError())
        setPrevValue(value);
    }

    const updateChannelsDisplayed = useCallback(async () => {
        return (
            await Promise.all(
                await getChannelByName(value)
                    .then(res => {
                        if (res.status === 200 && res.statusText === "OK") {
                            let channels: any[];
                            if (res.data.length)
                                channels = res.data.filter((c: any) => c.type !== "WHISPER");
                            if (channels.length)
                                return (channels);
                        }
                    })
            )
        )
    }, [channels, matchChannels])


    const renderChannelsSelected = useCallback(async () => {
        if (matchChannels && matchChannels.length) {

            const updatedChannels = await updateChannelsDisplayed();

            if (updatedChannels) {
                setRenderChannels(
                    updatedChannels.map((c: any) =>
                        <ChannelSearch
                            channel={c}
                            key={c.id}
                            setJoinChannelProtectedView={setJoinChannelProtectedView}
                            join={() => addChannel(c, true)}
                        />)
                )
            }
        }
    }, [channels, matchChannels])

    useEffect(() => {
        renderChannelsSelected();
    }, [matchChannels, channels])


    return (
        <div className="relative fill flex-column">

            <div className="joinchannel-container flex-column">
                {
                    isMobileDisplay &&
                    <div className="flex">
                        <ArrowBackMenu
                            title="Channel"
                            path="/chat/add-group"
                        />
                    </div>
                }
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
                </div>
            </div>
            {
                joinChannelProtectedView.display &&
                <ProtectedChannelPassword
                    channel={joinChannelProtectedView.channel}
                    setJoinChannelProtectedView={setJoinChannelProtectedView}
                />

            }
        </div>
    )
}


function ProtectedChannelPassword(props: any) {

    const { token } = useCurrentUser();
    const [passwordValue, setPasswordValue]: any = useState("");
    const { addChannelProtected } = useChannels();
    const [error, setError] = useState("")

    async function submitPassword() {
        
        if (passwordValue.trim()) {
            await getChannelProtected(props.channel.id, passwordValue.trim(), token)
            .then(res => {
                if (res.data)
                {
                    props.setJoinChannelProtectedView(false);
                    addChannelProtected(props.channel, passwordValue, true );
                    setError("");
                }
                else
                    setError("Wrong password")
            })
        }
    }

    return (
        <ConfirmView>
            <div className="joinchannel-cornfirmview-container flex-column">
                <h3>Channel protected</h3>
                {error && <p className="red-c">{error}</p>}
                <InfoInput
                    id="joinchannel-confirmview"
                    label="Password"
                    value={passwordValue}
                    setValue={setPasswordValue}
                    submit={() => submitPassword()}
                />
            </div>
        </ConfirmView>
    )


}


function ConfirmView({ children }: any) {
    return (
        <div className="absolute fill confirm-background flex-center" >
            {children}
        </div>
    )
}