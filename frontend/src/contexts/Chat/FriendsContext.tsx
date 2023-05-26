import React, { createContext, useEffect, useReducer } from "react";
import { isEqual } from "../../utils";
import { useUser } from "../../Hooks";
import { getFriendList } from "../../utils/User";

export const FriendsContext: React.Context<any> = createContext([]);

function reducer(friends: any, action: any) {
    switch (action.type) {
        case ('setFriendList'): {
            return (isEqual(friends, action.friendList) ? friends : action.friendList)
        }
        case ('updateFriend'): {
            const friend = action.friend;
            if (friends &&
                friends.find((p: any) => p.length && p.find((u: any) => u.id === friend.id))) {
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
                return ([...friends, friend]);
        }
        case ('removeFriend'): {
            return (friends.filter((u: any) => u.id !== action.friend.id))
        }
        case('addNotif'): {
            friends.map((f: any) => {
                if (f.id === action.friendId) {
                    if (!f.notifs)
                        f.notifs = 1;
                    else
                        f.notifs += 1;
                }
                return (f)
            })
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
    const [friends, dispatch] : any = useReducer(reducer, [])
    const {
        user
    } : any = useUser();

    useEffect(() => {
        if (user)
        {
            getFriendList(user.id)
            .then(friendListRes => {
                if (friendListRes.status === 200 && friendListRes.statusText === "OK") {
                    let friendList = friendListRes.data;
                    friendList = friendList.sort((a: any, b: any) => a.username > b.username ? 1 : -1)
                    dispatch({type:'setFriendList', friendList})
                }
            })
        }
    }, [user])

    return (
        <FriendsContext.Provider value={[friends, dispatch]}>
            {children}
        </FriendsContext.Provider>
    )
}