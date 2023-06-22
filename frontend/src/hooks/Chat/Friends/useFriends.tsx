import React, { useCallback } from "react";
import { useChannelsContext, useCurrentUser, useFriendsContext } from "../../Hooks";
import useFetchUsers from "../../useFetchUsers";
import { removeUserFriend } from "../../../requests/friends";
import { User } from "../../../types";

export function useFriends() {
    const { token } = useCurrentUser();
    const { fetchUserProfilePicture } = useFetchUsers();
    const { friends, friendsDispatch, currentFriend } = useFriendsContext();

    const isUserFriend = useCallback((user: User) => {
        if (friends && friends.length && user) {
            return (friends.find((u: User) => u.id === user.id))
        }
        return (false);
    }, [friends])

    const isUserFriendByUsername = useCallback((user: User) => {
        if (friends && friends.length && user) {
            return (friends.find((u: User) => u.username === user.username))
        }
        return (false);
    }, [friends])


    const updateFriend = useCallback(async (friend: User) => {
        if (friends && friend) {
            if (!friend.url) {
                const url = await fetchUserProfilePicture(friend.id);
                friend.url = url;
            }
            friendsDispatch({ type: 'updateFriend', friend })
        }
    }, [friends])


    const removeFriend = useCallback((friend: User) => {
        if (friends && friends.length && friend) {
            removeUserFriend(friend.id, token);
            friendsDispatch({ type: 'removeFriend', friend })
        }
    }, [friends, currentFriend])

    return (
        {
            isUserFriend,
            isUserFriendByUsername,
            updateFriend,
            removeFriend
        }
    )
}