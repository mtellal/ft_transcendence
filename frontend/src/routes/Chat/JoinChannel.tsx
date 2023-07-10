import React, { useCallback, useEffect, useState } from "react";
import { ChannelSearchLabel, SearchInput, SearchedChannel } from "./Menu/SearchElement";
import useFetchUsers from "../../hooks/useFetchUsers";
import { useChannelsContext, useCurrentUser } from "../../hooks/Hooks";
import { getAllChannels, getChannelByName, getChannels } from "../../requests/chat";
import { ChannelLabel } from "../../components/channels/ChannelInfos";
import { Channel } from "../../types";
import ArrowBackMenu from "./components/ArrowBackMenu";
import { useWindow } from "../../hooks/useWindow";


function PublicChannels() {
    const { token } = useCurrentUser();
    const [channelList, setChannelList] = useState([]);
    const { fetchUsers } = useFetchUsers();
    const { channels } = useChannelsContext();

    const loadChannels = useCallback(async () => {
        let c: Channel[];
        if (token) {
            await getAllChannels(token)
                .then(res => {
                    if (res.data && res.data.length) {
                        c = res.data.filter((c: Channel) => c.type === "PUBLIC");
                    }
                })
            if (c && c.length) {
                const tab = await Promise.all(
                    c.map(async (c: Channel) => {
                        c.users = await fetchUsers(c.members);
                        return (
                            <ChannelSearchLabel
                                key={c.id}
                                channel={c}
                                resetInput={() => { }}
                                style={{ margin: '0 auto 3px auto' }}
                            />
                        )
                    })
                )
                setChannelList(tab);
            }

        }
    }, [token]);

    useEffect(() => {
        loadChannels();
    }, [channels])

    return (
        <div>
            <h4 className="interface-page-title" style={{ fontSize: '17px' }}>Public channels</h4>
            {
                channelList && channelList.length ?
                    channelList :
                    <div className="fill">
                        <p>No public channels</p>
                    </div>
            }
        </div>
    )
}


export default function JoinChannel() {
    const { token } = useCurrentUser();
    const [value, setValue]: any = useState("");
    const [error, setError] = useState("");
    const [channelList, setChannelList] = useState([]);

    const { setCurrentChannel } = useChannelsContext();

    const { fetchUsers } = useFetchUsers();

    const { isMobileDisplay } = useWindow();


    useEffect(() => {
        setCurrentChannel(null);
    }, [])

    function resetInput() {
        setValue("");
        setChannelList([]);
    }

    async function searchUser() {
        if (!value || !value.trim())
            return;
        let channelArray: any[];
        setError("");
        setChannelList([]);

        await getChannelByName(value.trim(), token)
            .then(res => {
                if (res.data) {
                    channelArray = res.data;
                }
            })
        if (channelArray) {
            channelArray = await Promise.all(
                channelArray.map(async (c: Channel) => {
                    c.users = await fetchUsers(c.members);
                    return (
                        <ChannelSearchLabel
                            key={c.id}
                            channel={c}
                            resetInput={() => resetInput()}
                            style={{ margin: '0 auto 3px auto' }}
                        />
                    )
                })
            )
            setChannelList(channelArray);
        }
        if (!channelArray)
            setError("Channel not found");
    }

    return (
        <div
            className="scroll"
            style={{ flex: '3', padding: '3%' }}
        >
            <div className="flex">
                {isMobileDisplay && <ArrowBackMenu />}
                <h2 className="interface-page-title">Join a channel</h2>
            </div>
            <div className="flex-column-center" style={{ marginTop: '30px' }}>
                <SearchInput
                    value={value}
                    setValue={setValue}
                    submit={() => searchUser()}
                    onChange={() => { setChannelList([]); setError("") }}
                    setInputRef={null}
                />
                {error && <p className="reset red-c" style={{ marginTop: '10px' }}>{error}</p>}
            </div>
            <div className="relative scroll" style={{ maxHeight: '400px', marginTop: '20px', width: 'auto' }}>
                {
                    channelList
                }
            </div>

            <div className="relative" style={{ marginTop: '50px' }}>
                <PublicChannels />
            </div>
        </div>
    )
}