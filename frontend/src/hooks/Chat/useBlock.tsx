import React, { useCallback } from "react";
import { useCurrentUser } from "../Hooks";
import useFetchUsers from "../useFetchUsers";
import { blockUserRequest, unblockUserRequest } from "../../requests/block";
import { Mute, User } from "../../types";


export function useBlock()
{
    const { user, userDispatch, token } = useCurrentUser();
    const { fetchUsers } = useFetchUsers();

    const isUserBlocked = useCallback((mUser: User) => {
        if (user && user.blockList && user.blockList.length && mUser)
        {
            return (user.blockList.find((o: Mute) => o.userId === mUser.id));
        }
        return (false);
    }, [user])

    const isUserBlockedById = useCallback((UserId: number) => {
        if (user && user.blockList && user.blockList.length && UserId)
        {
            return (user.blockList.find((o: Mute) => o.userId === UserId));
        }
        return (false);
    }, [user])

    const getblockedUsers = useCallback(async () => {
        if (user && user.blockList && user.blockList.length)
        {
            const blockIds = user.blockList.map((o: Mute) => o.userId)
            return ( await fetchUsers(blockIds))
        }
    }, [user])

    const blockUser = useCallback(async (mUser: User) => {
        if (user && user.blockList && mUser)
        {
            await blockUserRequest(mUser.id, token)
                .then(res => {
                    if (res.data)
                    {
                        userDispatch({type: 'addBlockList', block: res.data })
                    }
                });
        }

    }, [user])

    const unblockUser = useCallback(async (mUser: User) => {
        if (user && user.blockList && user.blockList.length && mUser)
        {
            unblockUserRequest(mUser.id, token);
            userDispatch({type: 'removeBlockList', userId: mUser.id })
        }

    }, [user])

    return (
        {
            isUserBlocked,
            isUserBlockedById,
            getblockedUsers,
            blockUser,
            unblockUser
        }
    )
}