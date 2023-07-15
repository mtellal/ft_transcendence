import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useChannelsContext, useCurrentUser } from "../../../../hooks/Hooks";
import { useChannels } from "../../../../hooks/Chat/useChannels";

import { Channel } from "../../../../types";
import useOutsideClick from "../../../../hooks/useOutsideClick";
import Icon from "../../../../components/Icon";


import moreVertical from '../../../../assets/moreVertical.svg'
import useMembers from "../../../../hooks/Chat/useMembers";
import { ChatInterfaceContext } from "../../Chat/Chat";
import ChannelInfos from "../../../../components/channels/ChannelInfos";
import { JoinProtectedChannel } from "../../Profile/ChannelProfile/ConfirmAction";
import useFetchUsers from "../../../../hooks/useFetchUsers";

import './SearchedChannel.css'


type TChannelSearchLabel = {
    channel: Channel,
    resetInput: () => void,
}


function ChannelSearchJoin(props: any) {
    const { addChannel, isChannelProtected, isChannelPrivate } = useChannels();
    const { setAction } = useContext(ChatInterfaceContext);

    return (
        <>
            {
                !isChannelPrivate(props.channel) &&
                <>
                    <p className="searchedchannel-action"
                        onClick={() => {
                            if (isChannelProtected(props.channel)) {
                                setAction(
                                    <JoinProtectedChannel 
                                        channel={props.channel}
                                        valid={() =>  setAction(false)}
                                        cancel={() => {setAction(false)}}
                                    /> 
                                )
                            }
                            else {
                                addChannel(props.channel, true)
                            }
                            props.resetInput();
                        }}
                    >
                        Join
                    </p>
                </>
            }
        </>
    )
}


function ChannelSearchMemberActions(props: any) {

    const navigate = useNavigate();
    const { leaveChannel } = useChannels();

    return (
        <>
            <p className="searchedchannel-action"
                onClick={() => {
                    leaveChannel(props.channel)
                    props.resetInput();
                }}
            >
                Leave
            </p>
            <p
                className="searchedchannel-action"
                onClick={() => {
                    navigate(`/chat/channel/${props.channel.id}`);
                    props.resetInput();
                }}
            >Message</p>
        </>
    )
}


export function ChannelSearchLabel(props: TChannelSearchLabel) {

    const { user } = useCurrentUser();
    const { isUserMember } = useMembers(props.channel);

    const [showActions, setShowActions] = useState(false);
    const settingsRef: any = useRef();

    const ref = useOutsideClick(() => setShowActions(false))

    return (
        <div className="flex-ai searchedchannel" >
            <ChannelInfos {...props} />
            <div ref={ref} className="searchedchannel-icon" >
                <div ref={settingsRef} style={{ height: '30px', marginLeft: '5px' }}>
                    <Icon icon={moreVertical} onClick={() => setShowActions((p: boolean) => !p)} />
                </div>
                <div
                    className="absolute searchedchannel-actions-channel"
                    style={showActions ? { visibility: 'visible', zIndex: '5', bottom: `${settingsRef.current.offsetBottom}px` } : { visibility: 'hidden' }}
                    onClick={() => setShowActions((p: boolean) => !p)}
                >
                    {
                        isUserMember(user) ?
                            <ChannelSearchMemberActions {...props} />
                            :
                            <ChannelSearchJoin {...props} />
                    }
                </div>
            </div>
        </div>
    )
}

type TSearchedChannel = {
    channels: Channel[],
    reset: () => void,
    inputRef?: any
}

export function SearchedChannel(props: TSearchedChannel) {

    const { fetchUsers } = useFetchUsers();
    const { channels } = useChannelsContext();
    const [renderChannels, setRenderChannels] = useState([]);

    const loadChannels = useCallback(async () => {
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
        loadChannels();
    }, [props.channels, channels])

    return (
        <>
            {renderChannels}
        </>
    )
}