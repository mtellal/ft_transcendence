import React, { createContext, useEffect, useReducer, useState } from "react";
import { isEqual } from "../../utils";
import { useCurrentUser } from "../../Hooks";
import { getFriendList, getUserProfilePictrue } from "../../utils/User";

export const FriendsContext: React.Context<any> = createContext([]);

function newFriend(friend: any) {
    return (
        {
            ...friend,
            notifs: 0,
        }
    )
}

function reducer(friends: any, action: any) {
    switch (action.type) {
        case ('setFriendList'): {
            if (action.friendList && action.friendList.length) {
                const nfriends = action.friendList.map((f: any) => newFriend(f))
                return (isEqual(friends, nfriends) ? friends : nfriends)
            }
            else return (friends);
        }
        case ('updateFriend'): {
            const friend = action.friend;
            if (friends.length && friend &&
                friends.find((u: any) => u.id === friend.id)) {
                return (
                    friends.map((u: any) => {
                        if (u.id === friend.id) {
                            return (friend)
                        }
                        return (u);
                    })
                )
            }
            else
                return ([...friends, newFriend(friend)]);
        }
        case ('removeFriend'): {
            if (friends.length)
                return (friends.filter((u: any) => u.id !== action.friend.id))
            return (friends);
        }
        case ('addNotif'): {
            if (friends.length)
                return (
                    friends.map((f: any) => {
                        if (f.id === action.friendId) {
                            if (!f.notifs)
                                f.notifs = 1;
                            else
                                f.notifs += 1;
                        }
                        return (f)
                    })
                )
            else
                return (friends);
        }
        case ('removeNotif'): {
            friends.map((f: any) => {
                if (action.friend.id === f.id && f.notifs)
                    f.notifs = 0;
                return (f);
            });
        }
        default: return (friends);
    }
}


export function FriendsProvider({ children }: any) {
    const { user }: any = useCurrentUser();
    const [friends, friendsDispatch]: any = useReducer(reducer, []);
    const [currentFriend, setCurrentFriendLocal] = useState();

    async function loadFriendList() {
        let friendList: any = await getFriendList(user.id)
            .then(res =>
                res.data.sort((a: any, b: any) => a.username > b.username ? 1 : -1)
            )

        friendList = await Promise.all(friendList.map(async (u: any) => {
            const url = await getUserProfilePictrue(u.id)
                .then(res => window.URL.createObjectURL(new Blob([res.data])))
            return ({ ...u, url })
        }
        ))

        friendsDispatch({ type: 'setFriendList', friendList })
    }

    useEffect(() => {
        if (user) {
            loadFriendList();
        }
    }, [user])

    function setCurrentFriend(friend: any) {
        const f = friends.find((f: any) => friend.id === f.id);
        setCurrentFriendLocal(f);
    }

    useEffect(() => {
        if (friends && friends.length) {
            if (currentFriend)
                setCurrentFriend(currentFriend)
        }
    }, [friends])


    async function updateFriend(friend : any)
    {
        if (friend)
        {
            let url;
            await getUserProfilePictrue(friend.id)
                .then(res => {
                    if (res.status === 200 && res.statusText)
                        url = window.URL.createObjectURL(new Blob([res.data]))
                } )
            friendsDispatch({type: 'updateFriend', friend: {...friend, url}})
        }
    }


    return (
        <FriendsContext.Provider value={{
            friends,
            friendsDispatch,
            updateFriend,
            currentFriend,
            setCurrentFriend
        }}>
            {children}
        </FriendsContext.Provider>
    )
}