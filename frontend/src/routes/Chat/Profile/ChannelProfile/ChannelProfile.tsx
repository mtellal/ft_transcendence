import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import { useChannelsContext, useFriendsContext, useCurrentUser, useChatSocket } from "../../../../hooks/Hooks"

import useBanUser from "../../../../hooks/Chat/useBanUser";
import useAdinistrators from "../../../../hooks/Chat/useAdministrators";
import { ChannelUserLabel } from "../../components/ChannelProfile/ChannelUserLabel";

import { ConfirmAction } from "./ConfirmAction";
import ChannelName from "../../components/ChannelProfile/ChannelName";
import SearchChannelUser from "../../components/ChannelProfile/SearchChannelUser";
import ChannelPassword from "../../components/ChannelProfile/ChannelPassword";
import PickMenuAccess from "../../components/ChannelProfile/PickMenuAccess";
import useMuteUser from "../../../../hooks/Chat/useMuteUser";
import useMembers from "../../../../hooks/Chat/useMembers";
import { Channel, User } from "../../../../types";
import { CollectionChannelUsers } from "../../../../components/collections/Collection";

export const PofileChannelContext = createContext({});

type TChannelProfile = {
    name: string,
    members: User[],
    administrators: number[],
    owner: number,
    channel: Channel
}

export default function ChannelProfile(props: TChannelProfile) {

    const { user } = useCurrentUser();
    const { channels } = useChannelsContext();
    const { getOwner } = useMembers(props.channel);

    const { getUsersBanned } = useBanUser(props.channel);
    const { getAdministrators } = useAdinistrators(props.channel);
    const { getUsersMuted } = useMuteUser(props.channel);

    const [owner, setOwner]: any = useState();
    const [admins, setAdmins] = useState([]);
    const [muted, setMuted] = useState([]);
    const [banned, setBanned] = useState([])
    const [confirmView, setConfirmView] = useState(false);
    const [userAction, setUserAction] = useState(null)


    const init = useCallback(async () => {
        if (props.members && props.members.length) {
            const administrators = getAdministrators();
            if (administrators && administrators.length)
                setAdmins(administrators)
            const owner = getOwner();
            if (owner)
                setOwner(owner);

            const mutedUsers = await getUsersMuted();
            setMuted(mutedUsers);

            const bannesUsers = await getUsersBanned();
            setBanned(bannesUsers)
        }
    }, [props.channel])

    useEffect(() => {
        init();
    }, [props.channel, channels])

    return (
        <PofileChannelContext.Provider
            value={{
                setUserAction,
                setConfirmView,
            }}
        >
            <div className="scroll">
                <div style={{ padding: '5%' }}>
                    <ChannelName channel={props.channel} />
                    <hr />
                    <ChannelPassword channel={props.channel} />
                    <hr />
                    <PickMenuAccess
                        channel={props.channel}
                        protectedAccess={() => setConfirmView(true)}
                    />
                    <hr />
                    <SearchChannelUser
                        title="Search"
                        channel={props.channel}
                        inputTitle="Search user"
                        members={props.members}
                    />
                    <hr />
                    <h2>Owner</h2>
                    <ChannelUserLabel
                        user={owner}
                        channel={props.channel}
                        showChannelStatus={true}
                        isAddable={false}
                    />
                    <hr />
                    <CollectionChannelUsers
                        title="Administrators"
                        users={admins}
                        channel={props.channel}
                        currentUser={user}
                        showChannelStatus={user && owner && user.id !== owner.id}
                    />
                    <hr />
                    <CollectionChannelUsers
                        title="Members"
                        users={props.members}
                        channel={props.channel}
                        currentUser={user}
                        showChannelStatus={false}
                    />
                    <hr />
                    <CollectionChannelUsers
                        title="Muted"
                        users={muted}
                        channel={props.channel}
                        currentUser={user}
                        showChannelStatus={false}
                    />
                    <hr />
                    <CollectionChannelUsers
                        title="Banned"
                        users={banned}
                        channel={props.channel}
                        currentUser={user}
                        showChannelStatus={false}
                    />
                </div>

                {
                    confirmView &&
                    <ConfirmAction
                        channel={props.channel}
                        userAction={userAction}
                        setUserAction={setUserAction}
                        setConfirmView={setConfirmView}
                    />
                }

            </div>
        </PofileChannelContext.Provider>
    )
}