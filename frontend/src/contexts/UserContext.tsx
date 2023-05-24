import React, { useReducer, createContext, useState } from "react";
import { getUser } from "../utils/User";
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


export const UserContext: React.Context<any> = createContext(0);

export function UserProvider({ children, ...props }: any) {
    const [user, setUser]: any = useState(props.user);
    const [image, setImage] : any = useState(props.image)

    React.useEffect(() => {
        login(user)
            .then(d => setUser(d.data))
        return () => {
            logout(user)
            .then(d => setUser(d.data))
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
                setUser,
                image,
                setImage
            }}>
            {children}
        </UserContext.Provider>
    )
}