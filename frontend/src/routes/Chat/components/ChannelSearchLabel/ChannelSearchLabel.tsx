import React, { useCallback, useContext, useEffect, useState } from "react";
import { useCurrentUser } from "../../../../hooks/Hooks";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import useBanUser from "../../../../hooks/Chat/useBanUser";
import useMembers from "../../../../hooks/Chat/useMembers";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import ResizeContainer from "../../../../components/ResizeContainer";
import ProfilePicture from "../../../../components/users/ProfilePicture";
import Icon, { RawIcon } from "../../../../components/Icon";

import { getChannelProtected } from "../../../../requests/chat";
import InfoInput from "../../../../components/Input/InfoInput";
import { ChatInterfaceContext } from "../../Chat/Chat";
import { ConfirmViewButtons } from "../../Profile/ChannelProfile/ConfirmAction";
import { SearchedChannelLabelContext } from "../../Menu/SearchElement";

import './ChannelSearchLabel.css'
import { Channel } from "../../../../types";

type TProtectedChannelPassword = {
    reset: any, 
    channel: Channel
}

function ProtectedChannelPassword(props: TProtectedChannelPassword) {

    const { token } = useCurrentUser();
    const [passwordValue, setPasswordValue]: any = useState("");
    const { addChannelProtected } = useChannels();
    const [error, setError] = useState("")

    const { setAction } = useContext(ChatInterfaceContext)


    async function submitPassword() {

        if (passwordValue.trim()) {
            await getChannelProtected(props.channel.id, passwordValue.trim(), token)
                .then(res => {
                    if (res.data) {
                        addChannelProtected(props.channel, passwordValue, true);
                        setError("");
                        setAction(null);
                        props.reset();
                    }
                    else
                        setError("Wrong password")
                })
        }
    }

    return (
        <div className="join-protectedchannel flex-column red">
            <h3 className="reset">Channel protected</h3>
            <p>This channel require a password</p>
            {error && <p className="red-c">{error}</p>}
            <InfoInput
                id="joinchannel-confirmview"
                label="Password"
                value={passwordValue}
                setValue={setPasswordValue}
                submit={() => submitPassword()}
            />
            <ConfirmViewButtons
                valid={() => submitPassword()}
                cancel={() => setAction(null)}
            />
        </div>
    )
}


type TChannelSearch = {
    channel: Channel,
    join: () => {} | any,
    leaveChannel: () => {} | any
}

export function ChannelSearchLabel({ channel, ...props }: TChannelSearch) {

    const { user } = useCurrentUser();
    const { isChannelPrivate, isChannelProtected } = useChannels();
    const { isUserBanned } = useBanUser()

    const { setAction } = useContext(ChatInterfaceContext);
    const { reset } = useContext(SearchedChannelLabelContext)


    const { fetchUserProfilePicture } = useFetchUsers();
    const [members, setMembers] = useState([]);

    const { isUserMemberFromChannel } = useMembers();


    const loadUsersProfilePicture = useCallback(async () => {
        const pps = await Promise.all(channel.members.map(async (id: any) =>
            await fetchUserProfilePicture(id)
        ))
        setMembers(pps.map((url: any) =>
            <div key={url} className="channelsearch-pp-container flex-center">
                <ResizeContainer height="40px" width="40px">
                    <ProfilePicture image={url} />
                </ResizeContainer>
            </div>
        ))
    }, [channel.members]);

    useEffect(() => {
        if (channel.members)
            loadUsersProfilePicture();
    }, [channel.members])


    const renderIcon = useCallback(() => {
        if (isUserBanned(user, channel)) {
            return (
                <div style={{ marginLeft: 'auto' }}>
                    <p className="red-c">Banned</p>
                </div>
            )
        }
        else if (user && isUserMemberFromChannel(user, channel)) {
            return (
                <div style={{ marginLeft: 'auto' }}>
                    <Icon icon="logout" description="leave" onClick={() => props.leaveChannel()} />
                </div>
            )
        }
        else if (channel.type !== "PRIVATE") {
            return (
                <div style={{ marginLeft: 'auto' }}>
                    <Icon
                        icon="login"
                        description="Join"
                        onClick={() => {
                            if (channel.type === "PROTECTED") {
                                setAction(
                                    <ProtectedChannelPassword
                                        reset={reset}
                                        channel={channel}
                                    />
                                )
                            }
                            else
                                props.join();
                        }}
                    />
                </div>
            )
        }
    }, [channel.members, user]);

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