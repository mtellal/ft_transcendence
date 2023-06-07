
import React, { useCallback, useEffect, useState } from "react";
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
import { useWindow } from "../../../hooks/useWindow";
import ArrowBackMenu from "../components/ArrowBackMenu";
import useBanUser from "../../../hooks/useBanUser";
import ResizeContainer from "../../../components/ResizeContainer";

type TChannelSearch = {
    name: string,
    members: any[],
    isJoin: boolean,
    isBanned: boolean | any,
    join: () => {} | any
}

function ChannelSearch(props: TChannelSearch) {

    const [members, setMembers] = useState([]);

    async function loadUsersProfilePicture() {
        const rawProfilePictures = await Promise.all(props.members.map(async (id: any, i: number) =>
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
        if (props.members)
            loadUsersProfilePicture();
    }, [props.members])

    return (
        <div className="flex-ai channelsearch-container">
            <h3 className="no-wrap">{props.name} - </h3>
            <p className="channelsearch-members gray-c flex-center no-wrap">{props.members.length} members</p>
            <div className="channelsearch-pps flex-center">
                {members}
            </div>
            {
                props.isJoin && !props.isBanned &&
                <div style={{ marginLeft: 'auto' }}>
                    <Icon icon="login" description="Join" onClick={props.join} />
                </div>
            }
            {
                props.isBanned &&
                <div style={{ marginLeft: 'auto' }}>
                    <p className="red-c">Banned</p>
                </div>
            }

        </div>
    )
}

export default function JoinChannel() {

    const { user } = useCurrentUser();
    const [prevValue, setPrevValue] = React.useState("");
    const [value, setValue] = React.useState("");
    const [error, setError] = React.useState(false);

    const [matchChannels, setMatchChannels] = useState([]);
    const [renderChannels, setRenderChannels] = useState([]);
    const { isUserBanned } = useBanUser();

    const { isMobileDisplay } = useWindow();

    const {
        channels,
        channelAlreadyExists,
        addChannel,
    } = useChannels();

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


    console.log("rerender")

    const renderChannelsSelected = useCallback(async () => {
        if (matchChannels && matchChannels.length) {

            const updatedChannels = await updateChannelsDisplayed();

            if (updatedChannels) {
                setRenderChannels(
                    updatedChannels.map((c: any) =>
                        <ChannelSearch
                            key={c.id}
                            name={c.name}
                            members={c.members}
                            isJoin={!channelAlreadyExists(c)}
                            join={() => addChannel(c, true)}
                            isBanned={isUserBanned(user, c)}
                        />)
                )
            }
        }
    }, [channels, matchChannels])

    useEffect(() => {
        renderChannelsSelected();
    }, [matchChannels, channels])

    return (
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
    )
}