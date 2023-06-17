
import React, { useCallback, useEffect, useState } from "react";
import { UserLabelSearch } from "../../../../components/users/UserLabel";

import { useFriendsContext } from "../../../../hooks/Hooks";

import useFetchUsers from "../../../../hooks/useFetchUsers";
import { useFriendRequest } from "../../../../hooks/Chat/Friends/useFriendRequest";
import './FriendRequests.css'
import { CollectionElement } from "../../../../components/collections/CollectionElement";

export function FriendRequests() {

    const { fetchUsers } = useFetchUsers();
    const { friendInvitations } = useFriendsContext();
    const { acceptFriend, refuseFriend } = useFriendRequest();

    const [userInvitations, setUserInvitations]: [any, any] = useState([]);
    const [invitations, setInvitations]: [any, any] = useState([]);

    const loadInvitations = useCallback(async () => {
        const users = await fetchUsers(friendInvitations.map((r: any) => r.sendBy));
        if (users && users.length)
            setUserInvitations(users);
    }, [friendInvitations])


    React.useEffect(() => {
        if (friendInvitations && friendInvitations.length) {
            loadInvitations();
        }
        else {
            setInvitations([]);
            setUserInvitations([]);
        }
    }, [friendInvitations])


    React.useEffect(() => {
        if (userInvitations && userInvitations.length) {
            setInvitations(userInvitations.map((u: any) =>
                <UserLabelSearch
                    key={u.id}
                    id={u.id}
                    username={u.username}
                    profilePictureURL={u.avatar}
                    userStatus={u.userStatus}
                    invitation={true}
                    accept={() => acceptFriend(u)}
                    refuse={() => refuseFriend(u)}
                />
            ))
        }
        else
            setInvitations([]);
    }, [userInvitations])


    return (
        <>
            {
                userInvitations.length ?
                    <CollectionElement
                        title="Invitations"
                        collection={invitations}
                    />
                    :
                    null
            }
        </>
    )
}