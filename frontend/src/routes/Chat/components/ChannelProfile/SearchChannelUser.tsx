import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"

import { useChannelsContext, useFriends, useCurrentUser, useChatSocket } from "../../../../hooks/Hooks"

import useBanUser from "../../../../hooks/Chat/useBanUser";
import useAdinistrators from "../../../../hooks/Chat/useAdministrators";
import { ChannelUserLabel, CollectionUsers } from "./ChannelUserLabel";
import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import useChannelInfos from "../../../../hooks/Chat/useChannelInfos";
import InfoInput from "../../../../components/Input/InfoInput";
import PickMenu from "../../../../components/PickMenu";
import useMembers from "../../../../hooks/Chat/useMembers";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import { ConfirmAction } from "../../Profile/ChannelProfile/ConfirmAction";


type TSearchChannelUser = {
    title: string
    inputTitle: string,
    members: any[],
    bannedUsers?: any[]
}

export default function SearchChannelUser(props: TSearchChannelUser) {

    const [searchUserValue, setSearchUserValue]: any = useState("");
    const [searchUser, setSearchUser]: any = useState();
    const [error, setError] = useState("");
    const { isUserMember } = useMembers();

    const { fetchUserByUsername } = useFetchUsers();
    const { isCurrentUserAdmin, getUserAccess } = useUserAccess();

    async function search() {
        let user;
        if (props.members && props.members.length) {
            user = props.members.find((u: any) => u.username === searchUserValue.trim());
        }
        if (!user)
            user = await fetchUserByUsername(searchUserValue);
        if (user && (isUserMember(user) || isCurrentUserAdmin)) {
            setSearchUser(user);
            setError("");
        }
        else {
            setError("User not found")
            setSearchUser(null);
        }
    }

    return (
        <>
            <hr />
            <h2>{props.title}</h2>
            <InfoInput
                id={props.inputTitle}
                label={props.inputTitle}
                value={searchUserValue}
                setValue={setSearchUserValue}
                submit={() => search()}
            />
            {error && <p className="red-c">{error}</p>}
            {
                searchUser &&
                <ChannelUserLabel
                    user={searchUser}
                    bannedUsers={props.bannedUsers}
                    showChannelStatus={!isCurrentUserAdmin && getUserAccess(searchUser)}
                />
            }
        </>
    )
}