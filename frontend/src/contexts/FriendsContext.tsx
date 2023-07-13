import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { useCurrentUser } from "../hooks/Hooks";
import { getUserInvitations } from "../requests/friendsRequest";
import useFetchUsers from "../hooks/useFetchUsers";
import { FriendRequest, User } from "../types";

export const FriendsContext: React.Context<any> = createContext([]);

function reducer(friends: User[], action: any) {
    switch (action.type) {
        case ('setFriendList'): {
            if (action.friendList && action.friendList.length) {
                return (action.friendList);
            }
        }
        case ('updateFriend'): {
            if (action.friend) {
                if (friends.length && friends.find((u: User) => u.id === action.friend.id))
                    return (friends.map((f: User) => f.id === action.friend.id ? action.friend : f))
                else
                    return ([...friends, action.friend]);
            }
        }
        case ('removeFriend'): {
            if (friends.length)
                return (friends.filter((u: User) => u.id !== action.friend.id))
        }
        default: return (friends);
    }
}

export function FriendsProvider({ children }: any) {

    const { user, token }: any = useCurrentUser();
    const { fetchUsers } = useFetchUsers();

    const [friends, friendsDispatch]: any = useReducer(reducer, []);
    const [friendInvitations, setFriendInvitations]: [FriendRequest[], any] = useState([]);

    const [friendsLoading, setFriendsLoading] = useState(false);

    async function loadFriendList() {
        setFriendsLoading(true);
        let friendList = await fetchUsers(user.friendList);
        if (friendList && friendList.length) {
            friendList = friendList.sort((a: User, b: User) => a.username > b.username ? 1 : -1);
            friendsDispatch({ type: 'setFriendList', friendList })
        }
        setFriendsLoading(false);
    }

    useEffect(() => {
        if (user && user.friendList && !friendsLoading) {
            loadFriendList();
            getUserInvitations(user.id, token)
                .then(res => {
                    if (res && res.data)
                        setFriendInvitations(res.data);
                })
        }
    }, [user, friendsLoading, token])


    return (
        <FriendsContext.Provider value={{
            friends,
            friendsDispatch,
            friendInvitations,
            setFriendInvitations,
        }}>
            {children}
        </FriendsContext.Provider>
    )
}