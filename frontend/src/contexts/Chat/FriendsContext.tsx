import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { isEqual } from "../../utils";
import { useCurrentUser } from "../../hooks/Hooks";
import { getUserInvitations } from "../../requests/friendsRequest";
import useFetchUsers from "../../hooks/useFetchUsers";
import { FriendRequest, User } from "../../types";

export const FriendsContext: React.Context<any> = createContext([]);

function reducer(friends: User[], action: any) {
    switch (action.type) {
        case ('setFriendList'): {
            if (action.friendList && action.friendList.length) {
                return (isEqual(friends, action.friendList) ? friends : action.friendList)
            }
            else return (friends);
        }
        case ('updateFriend'): {
            if (friends.length && action.friend &&
                friends.find((u: User) => u.id === action.friend.id)) {
                return (friends.map((f: User) => f.id === action.friend.id ? action.friend : f))
            }
            else
                return ([...friends, action.friend]);
        }
        case ('removeFriend'): {
            if (friends.length)
                return (friends.filter((u: User) => u.id !== action.friend.id))
            return (friends);
        }
        default: return (friends);
    }
}

export function FriendsProvider({ children }: any) {

    const { user, token }: any = useCurrentUser();
    const { fetchUsers } = useFetchUsers();

    const [friends, friendsDispatch]: any = useReducer(reducer, []);
    const [currentFriend, setCurrentFriendLocal]: any = useState();
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
            loadInvitations();
        }
    }, [user])


    /////////////////////////////////////////////////////////////////////////
    //                U P D A T E      C U R R E N T  F R I E N D          //
    /////////////////////////////////////////////////////////////////////////

    const setCurrentFriend = useCallback((friend: User) => {
        let pickFriend;
        if (!friends.length)
            pickFriend = friend;
        else if (friend) {
            pickFriend = friends.find((c: User) => c.id === friend.id)
            if (!pickFriend)
                pickFriend = friend
        }
        setCurrentFriendLocal(pickFriend);
    }, [friends])


    useEffect(() => {
        if (friends) {
            if (friends.length)
                setCurrentFriendLocal((p: any) => p ? friends.find((c: User) => c.id == p.id) : null)
            else
            setCurrentFriendLocal(null)
        }
    }, [friends])

    /////////////////////////////////////////////////////////////////////////
    //                         I N V I T A T I O N S                       //
    /////////////////////////////////////////////////////////////////////////

    const loadInvitations = useCallback(async () => {
        getUserInvitations(user.id, token)
            .then(res => {
                if (res.data)
                    setFriendInvitations(res.data);
            })

    }, [user])

    return (
        <FriendsContext.Provider value={{
            friends,
            friendsDispatch,
            currentFriend,
            setCurrentFriend,
            friendInvitations,
            setFriendInvitations,
        }}>
            {children}
        </FriendsContext.Provider>
    )
}