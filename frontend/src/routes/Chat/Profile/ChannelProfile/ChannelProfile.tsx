import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import { useChannelsContext, useFriendsContext, useCurrentUser, useChatSocket } from "../../../../hooks/Hooks"

import useBanUser from "../../../../hooks/Chat/useBanUser";
import useAdinistrators from "../../../../hooks/Chat/useAdministrators";
import { ChannelUserLabel, CollectionUsers } from "../../components/ChannelProfile/ChannelUserLabel";

import { ConfirmAction } from "./ConfirmAction";
import ChannelName from "../../components/ChannelProfile/ChannelName";
import SearchChannelUser from "../../components/ChannelProfile/SearchChannelUser";
import ChannelPassword from "../../components/ChannelProfile/ChannelPassword";
import PickMenuAccess from "../../components/ChannelProfile/PickMenuAccess";
import useMuteUser from "../../../../hooks/Chat/useMuteUser";
import useMembers from "../../../../hooks/Chat/useMembers";

export const PofileChannelContext = createContext({});

export default function ChannelProfile(props: any) {

    const { user } = useCurrentUser();
    const { channels, currentChannel } = useChannelsContext();
    const { getOwner } = useMembers();

    const { getUsersBanned } = useBanUser();
    const { getAdministrators } = useAdinistrators();
    const { getUsersMuted } = useMuteUser();

    const [owner, setOwner] = useState();
    const [admins, setAdmins] = useState([]);
    const [muted, setMuted] = useState([]);
    const [banned, setBanned] = useState([])
    const [confirmView, setConfirmView] = useState(false);
    const [userAction, setUserAction] = useState(null)


    const init = useCallback(async () => {
        if (props.members && props.members.length) {
            const administrators = getAdministrators(props.channel);
            if (administrators && administrators.length)
                setAdmins(administrators)
            const owner = getOwner(props.channel);
            if (owner)
                setOwner(owner);

            const mutedUsers = await getUsersMuted(props.channel);
            setMuted(mutedUsers);

            const bannesUsers = await getUsersBanned(props.channel);
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
                <div style={{padding: '5%'}}>
                    <ChannelName 
                        channel={props.channel} 
                    />
                    <ChannelPassword 
                        channel={props.channel} 
                    />
                    <PickMenuAccess
                        channel={props.channel}
                        protectedAccess={() => setConfirmView(true)}
                    />
                    <SearchChannelUser
                        title="Search"
                        inputTitle="Search user"
                        members={props.members}
                    />
                    <h2>Owner</h2>
                    <ChannelUserLabel
                        user={owner}
                        showChannelStatus={true}
                        isAddable={false}
                    />
                    <CollectionUsers
                        title="Administrators"
                        users={admins}
                        currentUser={user}
                    />
                    <CollectionUsers
                        title="Members"
                        users={props.members}
                        currentUser={user}
                    />
                    <CollectionUsers
                        title="Muted"
                        users={muted}
                        currentUser={user}
                    />
                    <CollectionUsers
                        title="Banned"
                        users={banned}
                        currentUser={user}
                        bannedUsers={true}
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