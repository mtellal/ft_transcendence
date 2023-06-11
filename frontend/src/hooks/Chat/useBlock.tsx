import React, { useCallback } from "react";
import { useCurrentUser } from "../Hooks";
import useFetchUsers from "../useFetchUsers";
import { blockUserRequest, unblockUserRequest } from "../../requests/block";


export function useBlock()
{

    const { user, userDispatch, token } = useCurrentUser();
    const { fetchUsers } = useFetchUsers();

    const isUserBlocked = useCallback((mUser: any) => {
        if (user && user.blockList && user.blockList.length && mUser)
        {
            if (user.blockList.find((o: any) => o.userId === mUser.id))
                return (true)
        }
        return (false);
    }, [user && user.blockList])


    const isUserBlockedById = useCallback((UserId: any) => {
        if (user && user.blockList && user.blockList.length && UserId)
        {
            if (user.blockList.find((o: any) => o.userId === UserId))
                return (true)
        }
        return (false);
    }, [user && user.blockList])



    const getblockedUsers = useCallback(async () => {
        if (user && user.blockList && user.blockList.length)
        {
            return ( await fetchUsers(user.blockList))
        }
    }, [user, user.blockList])

    const blockUser = useCallback(async (mUser: any) => {
        if (user && user.blockList && mUser)
        {
            console.log("blockUser called", user.blockList, mUser.id)
            const blockObject = await blockUserRequest(mUser.id, token).then(res => res.data);
            if (blockObject)
                userDispatch({type: 'addBlockList', block: blockObject })
        }

    }, [user, user.blockList])

    const unblockUser = useCallback(async (mUser: any) => {
        if (user && user.blockList && user.blockList.length && mUser)
        {
            console.log("unblockUser called", user.blockList, mUser.id)
            unblockUserRequest(mUser.id, token);
            userDispatch({type: 'removeBlockList', userId: mUser.id })
        }

    }, [user, user.blockList])

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