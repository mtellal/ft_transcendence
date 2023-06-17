import React, { useReducer, createContext, useState, useCallback } from "react";
import { getBlockList } from "../requests/block";
import { login, logout } from "../requests/user";


function reducer(user: any, action: any) {
    switch (action.type) {
        case ('login'): {
            return ({ ...user, userStatus: "ONLINE" })
        }
        case ('logout'): {
            return ({ ...user, userStatus: "OFFLINE" })
        }
        case ('updateUser'): {
            if (user && action.user)
            {
                return ({...user, ...action.user})
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
            if (user && user.blockList && action.block && 
                    (!user.blockList.length || !user.blockList.find((o: any) => o.userId !== action.block.userId) ))
            {
                user.blockList.push(action.block);
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