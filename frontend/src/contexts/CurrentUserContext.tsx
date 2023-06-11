import React, { useReducer, createContext, useState, useCallback } from "react";
import { getBlockList } from "../requests/block";
import { login, logout } from "../requests/user";


function reducer(user: any, action: any) {
    switch (action.type) {
        case ('login'): {
            return ({ ...user, userStatus: "ONLINE", blockList: [] })
        }
        case ('logout'): {
            return ({ ...user, userStatus: "OFFLINE", blockList: [] })
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
        case ('initblockList'): {
            return ({ ...user, blockList: action.blockList });
        }
        case ('addBlockList'): {
            if (user && user.blockList && action.block)
            {
                user.blockList.push(action.block);
                console.log("addBlokcList", user.blockList)
            }
            return (user);
        }
        case('removeBlockList'): {
            if (user && user.blockList && user.blockList.length && action.userId)
            {
                user.blockList = user.blockList.filter((obj: any) => obj.userId !== action.userId)
            }
            return (user)
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

        getBlockList(user.id, props.token)
            .then(res => {
                userDispatch({ type: 'initblockList', blockList: res.data })
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

    console.log("user context", user && user.blockList)

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