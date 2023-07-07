
import React, { useCallback, useState } from "react";
import { UserLabelFriendRequest, UserLabelSearch } from "../../../../components/users/UserLabel";

import { useFriendsContext } from "../../../../hooks/Hooks";

import useFetchUsers from "../../../../hooks/useFetchUsers";
import { useFriendRequest } from "../../../../hooks/Chat/Friends/useFriendRequest";
import './FriendRequests.css'
import { CollectionElement } from "../../../../components/collections/CollectionElement";
import { FriendRequest, User } from "../../../../types";
import { MenuCollectionElement } from "../../Menu/MenuElement";

export function FriendRequests() {

    const { fetchUsers } = useFetchUsers();
    const { friendInvitations } = useFriendsContext();
    const { acceptFriend, refuseFriend } = useFriendRequest();

    const [userInvitations, setUserInvitations]: [any, any] = useState([]);

    const loadInvitations = useCallback(async () => {
        const users = await fetchUsers(friendInvitations.map((r: FriendRequest) => r.sendBy));
        if (users && users.length)
            setUserInvitations(users);
    }, [friendInvitations, fetchUsers])

    React.useEffect(() => {
        if (friendInvitations && friendInvitations.length) {
            loadInvitations();
        }
        else {
            setUserInvitations([]);
        }
    }, [friendInvitations, loadInvitations])

    return (
        <>
            {
                userInvitations.length ?
                    <MenuCollectionElement
                        title="Invitations"
                        collection={
                            userInvitations.map((u: User) =>
                                <UserLabelFriendRequest
                                    key={u.id}
                                    user={u}
                                    accept={() => acceptFriend(u)}
                                    refuse={() => refuseFriend(u)}
                                />
                            )
                        }
                    />
                    :
                    null
            }
        </>
    )
}