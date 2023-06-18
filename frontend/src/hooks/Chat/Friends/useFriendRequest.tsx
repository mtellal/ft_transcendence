import React, { useCallback } from "react";
import { useCurrentUser, useFriendsContext } from "../../Hooks";
import { useFriends } from "./useFriends";
import { refuseFriendRequest, sendFriendRequest, validFriendRequest } from "../../../requests/friendsRequest";
import { useChannels } from "../useChannels";


export function useFriendRequest() {
    const { user, token } = useCurrentUser();
    const { friends, friendInvitations, setFriendInvitations } = useFriendsContext();
    const { updateFriend } = useFriends();

    const addFriendRequest = useCallback((request: any) => {
        if (setFriendInvitations && request)
            setFriendInvitations((p: any[]) => [...p, request])
    }, [setFriendInvitations])

    const removeFriendRequest = useCallback((request: any) => {
        if (setFriendInvitations && friendInvitations && friendInvitations.length && request) {
            setFriendInvitations((requests: any[]) =>
                requests.filter((r: any) => r.id !== request.id))
        }
    }, [setFriendInvitations, friendInvitations])

    const validFriend = useCallback((friend: any) => {
        if (friends && friend)
            return (friends.every((user: any) => friend.id !== user.id) && friend.id !== user.id)
        return (false);
    }, [friends]);

    const sendRequest = useCallback(async (friend: any) => {
        if (friend && validFriend(friend)) {
            await sendFriendRequest(friend.id, token);
        }
    }, [token]);

    const acceptFriend = useCallback(async (user: any) => {
        if (friendInvitations && friendInvitations.length && user) {
            const request = friendInvitations.find((r: any) => r.sendBy === user.id);
            if (request) {
                const validRes = await validFriendRequest(request.id, token);
                if (validRes.status === 201 && validRes.statusText === "Created") {
                    removeFriendRequest(request);
                    updateFriend(user)
                }
            }
        }
    }, [friendInvitations]);

    const refuseFriend = useCallback(async (user: any) => {
        if (friendInvitations && friendInvitations.length) {
            const request = friendInvitations.find((r: any) => r.sendBy === user.id);
            if (request) {
                const refuseRes = await refuseFriendRequest(request.id, token);
                if (refuseRes.status === 200 && refuseRes.statusText === "OK") {
                    removeFriendRequest(request);
                }
            }
        }
    }, [friendInvitations]);

    return (
        {
            addFriendRequest,
            removeFriendRequest,
            acceptFriend,
            refuseFriend,
            sendRequest,
            validFriend
        }
    )

}