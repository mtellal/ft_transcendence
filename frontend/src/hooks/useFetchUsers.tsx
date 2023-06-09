import { useCallback } from "react";
import { getUser, getUserByUsername, getUserProfilePictrue } from "../requests/user";
import { useCurrentUser } from "./Hooks";

import defaultPP from '../assets/user.png'

export default function useFetchUsers() {
    const { user, token } = useCurrentUser();

    const fetchUserProfilePicture = useCallback(async (userId: number) => {
        let path;
        if (userId) {
            path = await getUserProfilePictrue(userId, token)
                .then(res => {
                    if (res.status === 200 && res.statusText === "OK")
                        return (window.URL.createObjectURL(new Blob([res.data])))
                })
        }
        if (!path)
            path = defaultPP;
        return (path);
    }, [])

    const fetchUser = useCallback(async (userId: number) => {
        if (userId) {
            return (
                await getUser(userId, token)
                    .then(async (res: any) => {
                        if (res.status === 200 && res.statusText === "OK") {
                            let user = res.data;
                            let url = await fetchUserProfilePicture(userId);
                            return ({ ...user, url })
                        }
                    })
            )
        }
    }, [])

    const fetchUserByUsername = useCallback(async (username: string) => {
        if (username) {
            return (
                await getUserByUsername(username, token)
                    .then(async (res: any) => {
                        if (res.status === 200 && res.statusText === "OK") {
                            let user = res.data;
                            let url = await fetchUserProfilePicture(user.id);
                            return ({ ...user, url })
                        }
                    })
            )
        }
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
        return ([]);
    }, [user])

    return (
        {
            fetchUser,
            fetchUserByUsername,
            fetchUsers,
            fetchUserProfilePicture
        }
    )
}
