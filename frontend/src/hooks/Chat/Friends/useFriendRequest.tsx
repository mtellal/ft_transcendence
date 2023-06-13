import React, { useCallback } from "react";
import { useCurrentUser, useFriendsContext } from "../../Hooks";
import { useFriends } from "./useFriends";
import { refuseFriendRequest, sendFriendRequest, validFriendRequest } from "../../../requests/friendsRequest";


export function useFriendRequest() {
    const { user, token } = useCurrentUser();
    const { friends, friendInvitations, setFriendInvitations } = useFriendsContext();
    const { addFriend } = useFriends();


    const removeFriendRequest = useCallback((request: any) => {
        if (setFriendInvitations) {
            setFriendInvitations((requests: any[]) =>
                requests.filter((r: any) => r.id !== request.id))
        }
    }, [setFriendInvitations])

    const validFriend = useCallback((friend: any) => {
        if (friends)
            return (friends.every((user: any) => friend.id !== user.id) && friend.id !== user.id)
        return (false);
    }, [friends]);

    const sendRequest = useCallback(async (friend: any) => {
        if (validFriend(friend)) {
            await sendFriendRequest(friend.id, token);
        }
    }, [token]);

    const acceptFriend = useCallback(async (user: any) => {
        if (friendInvitations && friendInvitations.length) {
            const request = friendInvitations.find((r: any) => r.sendBy === user.id);
            if (request) {
                const validRes = await validFriendRequest(request.id, token);
                if (validRes.status === 201 && validRes.statusText === "Created") {
                    removeFriendRequest(request);
                    addFriend(user)
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
            acceptFriend,
            refuseFriend,
            sendRequest,
            validFriend
        }
    )

}