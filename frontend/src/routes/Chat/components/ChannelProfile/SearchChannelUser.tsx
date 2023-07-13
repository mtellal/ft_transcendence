import React, {  useState } from "react"

import { ChannelUserLabel } from "./ChannelUserLabel";
import useUserAccess from "../../../../hooks/Chat/useUserAccess";
import InfoInput from "../../../../components/Input/InfoInput";
import useMembers from "../../../../hooks/Chat/useMembers";
import useFetchUsers from "../../../../hooks/useFetchUsers";
import { getBlockList } from "../../../../requests/block";
import { useChannelsContext, useCurrentUser } from "../../../../hooks/Hooks";
import { Block, Channel, User } from "../../../../types";
import { useChannels } from "../../../../hooks/Chat/useChannels";


type TSearchChannelUser = {
    title: string,
    channel: Channel,
    inputTitle: string,
    members: User[],
}

export default function SearchChannelUser(props: TSearchChannelUser) {

    const { user, token } = useCurrentUser();
    const [searchUserValue, setSearchUserValue]: any = useState("");
    const [searchUser, setSearchUser]: any = useState();
    const [error, setError] = useState("");
    const { isUserMember } = useMembers(props.channel);

    const { fetchUserByUsername } = useFetchUsers();
    const { isCurrentUserAdmin, getUserAccess } = useUserAccess(props.channel);

    const [blockedUser, setBlockedUser] = useState(false);

    async function search() {
        let searchedUser;
        if (props.members && props.members.length) {
            searchedUser = props.members.find((u: User) => u.username === searchUserValue.trim());
        }
        if (!searchedUser)
            searchedUser = await fetchUserByUsername(searchUserValue);
        if (searchedUser && (isUserMember(searchedUser) || isCurrentUserAdmin)) {
            setSearchUser(searchedUser);
            const userBlockList = await getBlockList(searchedUser.id, token).then(res => res.data);
            if (userBlockList && userBlockList.length && userBlockList.find((o: Block) => o.userId === user.id))
                setBlockedUser(true);
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
                maxLength={20}
            />
            {error && <p className="red-c">{error}</p>}
            {
                searchUser &&
                <ChannelUserLabel
                    user={searchUser}
                    channel={props.channel}
                    showChannelStatus={!isCurrentUserAdmin && getUserAccess(searchUser)}
                    isAddable={!blockedUser}
                />
            }
        </>
    )
}