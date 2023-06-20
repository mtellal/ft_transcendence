import React, { useReducer, createContext, useState, useCallback } from "react";
import { getBlockedList } from "../requests/block";
import { login, logout, updateUser } from "../requests/user";

function reducer(user: any, action: any) {
    switch (action.type) {
        case ('login'): {
            return ({ ...user, userStatus: "ONLINE", blockedList: [] })
        }
        case ('logout'): {
            return ({ ...user, userStatus: "OFFLINE", blockedList: [] })
        }
        case ('updateUser'): {
            if (action.user)
            {
                if (user)
                    return ({...user, ...action.user})
                else
                    return (action.user)
            }
        }
        case ('updateProfilePicture'): {
            if (user && action.url)
                return ({ ...user, url: action.url })
        }
        case ('setblockedList'): {
            return ({ ...user, blockedList: action.blockedList });
        }
        case ('blockUser'): {
            return ({
                ...user,
                blockedList: [
                    ...user.blockedList,
                    {
                        blockedId: action.friendId,
                        createdAt: new Date().toISOString()
                    }
                ]
            })
        }
        case ('unblockUser'): {
            return ({
                ...user,
                blockedList: user.blockedList.filter((obj: any) =>
                    obj.blockedId !== action.friendId)
            })
        }
        default: return (user);
    }
}

export const CurrentUserContext: React.Context<any> = createContext(0);

export function CurrentUserProvider({ children, ...props }: any) {
    const [user, userDispatch]: any = useReducer(reducer, props.user);

    React.useEffect(() => {
        userDispatch({ type: 'login' })
        login(user);

        getBlockedList(user.id, props.token)
            .then(res => {
                userDispatch({ type: 'setblockedList', blockedList: res.data })
            })

        return () => {
            logout(user);
            userDispatch({ type: 'logout' })
        }
    }, [])


    const updateCurrentProfilePicture = useCallback((url: string) => {
        userDispatch({ type: 'updateProfilePicture', url })
    }, [user])

    const updateCurrentUser = useCallback((user: any) => {
        userDispatch({ type: 'updateUser', user })
    }, [user])

    return (
        <CurrentUserContext.Provider
            value={{
                token: props.token,
                user,
                userDispatch,
                updateCurrentUser,
                updateCurrentProfilePicture
            }}>
            {children}
        </CurrentUserContext.Provider>
    )
}