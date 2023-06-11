import React, { useCallback } from "react";
import { useCurrentUser } from "../Hooks";
import useFetchUsers from "../useFetchUsers";
import { blockUserRequest, unblockUserRequest } from "../../requests/block";


export function useBlock()
{

    const { user, token } = useCurrentUser();
    const { fetchUsers } = useFetchUsers();

    const isUserBlocked = useCallback((mUser: any) => {
        if (user && user.blockList && user.blockList.length && mUser)
        {
            if (user.blockList.find((o: any) => o.blockedId === mUser.id))
                return (true)
        }
        return (false);
    }, [user && user.blockList])


    const isUserBlockedById = useCallback((UserId: any) => {
        if (user && user.blockList && user.blockList.length && UserId)
        {
            if (user.blockList.find((o: any) => o.blockedId === UserId))
                return (true)
        }
        return (false);
    }, [user && user.blockList])

    const getblockedUsers = useCallback(async () => {
        if (user && user.blockList && user.blockList.length)
        {
            return ( await fetchUsers(user.blockList))
        }
    }, [user])

    const blockUser = useCallback(async (mUser: any) => {
        if (user && user.blockList && mUser)
        {
            console.log("blockUser called", user.blockList, mUser.id)
            const rep = await blockUserRequest(mUser.id, token);
            console.log(rep)
        }

    }, [user])

    const unblockUser = useCallback(async (mUser: any) => {
        if (user && user.blockList && user.blockList.length && mUser)
        {
            console.log("unblockUser called", user.blockList, mUser.id)
            await unblockUserRequest(mUser.id, token);
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