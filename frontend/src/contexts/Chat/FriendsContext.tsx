import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { isEqual } from "../../utils";
import { useCurrentUser } from "../../hooks/Hooks";
import { getUserInvitations } from "../../requests/friendsRequest";
import useFetchUsers from "../../hooks/useFetchUsers";

export const FriendsContext: React.Context<any> = createContext([]);



function reducer(friends: any, action: any) {
    switch (action.type) {
        case ('setFriendList'): {
            if (action.friendList && action.friendList.length) {
                return (isEqual(friends, action.friendList) ? friends : action.friendList)
            }
            else return (friends);
        }
        case ('updateFriend'): {
            if (friends.length && action.friend &&
                friends.find((u: any) => u.id === action.friend.id)) {
                return (friends.map((f: any) => f.id === action.friend.id ? action.friend : f))
            }
            else
                return ([...friends, action.friend]);
        }
        case ('removeFriend'): {
            if (friends.length)
                return (friends.filter((u: any) => u.id !== action.friend.id))
            return (friends);
        }
        default: return (friends);
    }
}

type TFriendRequest = {
    id: number,
    sendBy: number,
    status: boolean,
    userId: number,
    createdAt: string
}

export function FriendsProvider({ children }: any) {

    const { user }: any = useCurrentUser();
    const { fetchUsers } = useFetchUsers();

    const [friends, friendsDispatch]: any = useReducer(reducer, []);
    const [currentFriend, setCurrentFriendLocal]: any = useState();
    const [friendInvitations, setFriendInvitations]: [TFriendRequest[], any] = useState([]);

    const [friendsLoading, setFriendsLoading] = useState(false);

    async function loadFriendList() {
        setFriendsLoading(true);
        let friendList = await fetchUsers(user.friendList);
        if (friendList && friendList.length) {
            friendList = friendList.sort((a: any, b: any) => a.username > b.username ? 1 : -1);
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

    const setCurrentFriend = useCallback((friend: any) => {
        let pickFriend;
        if (!friends.length)
            pickFriend = friend;
        else if (friend) {
            pickFriend = friends.find((c: any) => c.id === friend.id)
            if (!pickFriend)
                pickFriend = friend
        }
        setCurrentFriendLocal(pickFriend);
    }, [friends])


    useEffect(() => {
        if (friends) {
            if (friends.length)
                setCurrentFriendLocal((p: any) => p ? friends.find((c: any) => c.id == p.id) : null)
            else
            setCurrentFriendLocal(null)
        }
    }, [friends])

    /////////////////////////////////////////////////////////////////////////
    //                         I N V I T A T I O N S                       //
    /////////////////////////////////////////////////////////////////////////

    const loadInvitations = useCallback(async () => {
        getUserInvitations(user.id)
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