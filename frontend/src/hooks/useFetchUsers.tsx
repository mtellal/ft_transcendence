import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { getUser, getUserProfilePictrue } from "../requests/user";
import { useCurrentUser } from "./Hooks";


export default function useFetchUsers()
{
    const { user } = useCurrentUser();

    const fetchUserProfilePicture = useCallback(async (userId: number) => {
        return (
            await getUserProfilePictrue(userId)
                .then(res => {
                    if (res.status === 200 && res.statusText === "OK")
                        return (window.URL.createObjectURL(new Blob([res.data])))
                })
        )
    }, [])
    
    const fetchUser = useCallback(async (userId: number) => {
        return (
            await getUser(userId)
                .then(async (res: any) => {
                    if (res.status === 200 && res.statusText === "OK") {
                        let user = res.data;
                        let url = await fetchUserProfilePicture(userId);
                        return ({ ...user, url })
                    }
                })
        )
    }, [])

    const fetchUsers = useCallback(async (usersId: number[]) => {
        if (usersId && usersId.length) {
            const users = await Promise.all(
                usersId.map(async (id: number) => {
                    if (id === user.id)
                        return (user)
                    else
                        return (await fetchUser(id))
    
                })
            )
            return (users)
        }
    }, [user])

    return (
        {
            fetchUser,
            fetchUsers,
            fetchUserProfilePicture
        }
    )
}
