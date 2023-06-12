import React, { useCallback } from "react";
import { useCurrentUser, useFriendsContext } from "../../Hooks";
import { useFriends } from "./useFriends";
import { refuseFriendRequest, sendFriendRequest, validFriendRequest } from "../../../requests/friendsRequest";


export function useFriendRequest() {
    const { user, token } = useCurrentUser();
    const { friends, friendInvitations, setFriendInvitations } = useFriendsContext();
    const { addFriend } = useFriends();


    const removeFriendRequest = useCallback((request: any) => {
        setFriendInvitations((requests: any[]) =>
            requests.filter((r: any) => r.id !== request.id))
    }, [friendInvitations])


    function validFriend(friend: any) {
        return (friends.every((user: any) => friend.id !== user.id) && friend.id !== user.id)
    }

    async function sendRequest(friend: any) {
        if (validFriend(friend)) {
            await sendFriendRequest(friend.id, token);
        }
    }

    async function acceptFriend(user: any) {
        const request = friendInvitations.find((r: any) => r.sendBy === user.id);
        if (request) {
            const validRes = await validFriendRequest(request.id, token);
            if (validRes.status === 201 && validRes.statusText === "Created") {
                removeFriendRequest(request);
                addFriend(user)
            }
        }
    }

    async function refuseFriend(user: any) {
        const request = friendInvitations.find((r: any) => r.sendBy === user.id);
        if (request) {
            const refuseRes = await refuseFriendRequest(request.id, token);
            if (refuseRes.status === 200 && refuseRes.statusText === "OK") {
                removeFriendRequest(request);
            }
        }
    }

    return (
        {
            acceptFriend,
            refuseFriend,
            sendRequest,
            validFriend
        }
    )

}