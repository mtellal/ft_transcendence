import React, { useReducer, createContext, useState, useCallback, useEffect } from "react";
import { getBlockList } from "../requests/block";
import { login, logout } from "../requests/user";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { Block, User } from "../types";


function reducer(user: User, action: any) {
    switch (action.type) {
        case ('login'): {
            return ({ ...user, userStatus: "ONLINE" })
        }
        case ('logout'): {
            return ({ ...user, userStatus: "OFFLINE" })
        }
        case ('updateUser'): {
            if (user && action.user) {
                return ({ ...user, ...action.user })
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
                (!user.blockList.length || !user.blockList.find((o: Block) => o.userId === action.block.userId))) {
                user.blockList.push(action.block);
            }
            return (user);
        }
        case ('removeBlockList'): {
            if (user && user.blockList && user.blockList.length && action.userId) {
                user.blockList = user.blockList.filter((obj: Block) => obj.userId !== action.userId)
            }
            return (user)
        }
        default: return (user);
    }
}

export const CurrentUserContext: React.Context<any> = createContext(0);

export function CurrentUserProvider({ children, ...props }: any) {
    const [user, userDispatch]: any = useReducer(reducer, props.user);
    const [socket, setSocket]: any = useState();
    const navigate = useNavigate();

    React.useEffect(() => {

        const s = io(`${process.env.REACT_APP_BACK}/users`, {
            transports: ['websocket'],
            upgrade: false,
            extraHeaders: {
                'Authorization': `Bearer ${props.token}`
            }
        });

        setSocket(s);


        s.on('acceptedInvite', (res: any) => {
            if (res) {
                navigate("/game", { state: { gameId: res.id } })
            }
        })

        userDispatch({ type: 'login' })
        login(user, props.token);

        getBlockList(user.id, props.token)
            .then(res => {
                userDispatch({ type: 'initblockList', blockList: res.data })
            })

        return () => {
            s.disconnect();
            logout(user, props.token);
            userDispatch({ type: 'logout' })
        }
    }, [])

    const updateCurrentProfilePicture = useCallback((url: string) => {
        userDispatch({ type: 'updateProfilePicture', url })
    }, [user])

    const updateCurrentUser = useCallback((user: User) => {
        userDispatch({ type: 'updateUser', user })
    }, [user])

    return (
        <CurrentUserContext.Provider
            value={{
                token: props.token,
                userSocket: socket,
                user,
                userDispatch,
                updateCurrentUser,
                updateCurrentProfilePicture
            }}>
            {children}
        </CurrentUserContext.Provider>
    )
}