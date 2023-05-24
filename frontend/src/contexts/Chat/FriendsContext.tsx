import React, { createContext, useReducer } from "react";
import { isEqual } from "../../utils";


export const FriendsContext: React.Context<any> = createContext([]);

function reducer(friends: any, action: any) {
    console.log("FRIENDS REDUCER CALLED ", action.type)
    switch (action.type) {
        case ('set'): {
            return (isEqual(friends, action.newFriends) ? friends : action.newFriends)
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
        case ('remomeFriend'): {
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

    return (
        <FriendsContext.Provider value={[friends, dispatch]}>
            {children}
        </FriendsContext.Provider>
    )
}