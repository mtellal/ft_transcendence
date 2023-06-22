import React, { useCallback } from "react";
import { useCurrentUser, useFriendsContext } from "../../Hooks";
import { useFriends } from "./useFriends";
import { refuseFriendRequest, sendFriendRequest, validFriendRequest } from "../../../requests/friendsRequest";
import { FriendRequest, User } from "../../../types";


export function useFriendRequest() {
    const { user, token } = useCurrentUser();
    const { friends, friendInvitations, setFriendInvitations } = useFriendsContext();
    const { updateFriend } = useFriends();

    const addFriendRequest = useCallback((request: FriendRequest) => {
        if (setFriendInvitations && request)
            setFriendInvitations((p: any[]) => [...p, request])
    }, [setFriendInvitations])

    const removeFriendRequest = useCallback((request: FriendRequest) => {
        if (setFriendInvitations && friendInvitations && friendInvitations.length && request) {
            setFriendInvitations((requests: FriendRequest[]) =>
                requests.filter((r: FriendRequest) => r.id !== request.id))
        }
    }, [setFriendInvitations, friendInvitations])

    const validFriend = useCallback((friend: User) => {
        if (friends && friend)
            return (friends.every((user: any) => friend.id !== user.id) && friend.id !== user.id)
        return (false);
    }, [friends]);

    const sendRequest = useCallback(async (friend: User) => {
        if (friend && validFriend(friend)) {
            await sendFriendRequest(friend.id, token);
        }
    }, [token]);

    const acceptFriend = useCallback(async (user: User) => {
        if (friendInvitations && friendInvitations.length && user) {
            const request = friendInvitations.find((r: FriendRequest) => r.sendBy === user.id);
            if (request) {
                const validRes = await validFriendRequest(request.id, token);
                if (validRes.status === 201 && validRes.statusText === "Created") {
                    removeFriendRequest(request);
                    updateFriend(user)
                }
            }
        }
    }, [friendInvitations]);

    const refuseFriend = useCallback(async (user: User) => {
        if (friendInvitations && friendInvitations.length) {
            const request = friendInvitations.find((r: FriendRequest) => r.sendBy === user.id);
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