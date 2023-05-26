import React, { useReducer, createContext, useState } from "react";
import { getBlockedList, getFriendList, getUser } from "../utils/User";
import { updateUser } from "../utils/User";

async function login(user: any) {
    return (
        updateUser(
            { userStatus: "ONLINE" },
            user.id
        )
    )
}

async function logout(user: any) {
    return (
        updateUser(
            { userStatus: "OFFLINE" },
            user.id
        )
    )
}

function reducer(user: any, action: any) {
    switch (action.type) {
        case ('login'): {
            return ({ ...user, userStatus: "ONLINE" })
        }
        case ('logout'): {
            return ({ ...user, userStatus: "OFFLINE" })
        }
        case ('setblockedList'): {
            return ({ ...user, blockedList: action.blockedList });
        }
        case ('blockUser'): {
            return ({ ...user, blockedList: [...user.blockedList, action.friendId] })
        }
        case ('unblockUser'): {
            return ({ ...user, blockedList: user.blockedList.filter((id: any) => id !== action.friendId) })
        }
        default: return (user);
    }
}

export const UserContext: React.Context<any> = createContext(0);

export function UserProvider({ children, ...props }: any) {
    const [user, userDispatch]: any = useReducer(reducer, props.user);
    const [image, setImage]: any = useState(props.image)

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

    React.useEffect(() => {
        if (!image)
            setImage("./assets/user.png")
    }, [image])


    return (
        <UserContext.Provider
            value={{
                token: props.token,
                user,
                userDispatch,
                image,
                setImage
            }}>
            {children}
        </UserContext.Provider>
    )
}