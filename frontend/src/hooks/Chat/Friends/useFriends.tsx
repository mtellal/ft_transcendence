import React, { useCallback } from "react";
import { useChannelsContext, useCurrentUser, useFriendsContext } from "../../Hooks";
import useFetchUsers from "../../useFetchUsers";
import { removeUserFriend } from "../../../requests/friends";
import { useNavigate } from "react-router-dom";
import { useChannels } from "../useChannels";

export function useFriends() {
    const navigate = useNavigate();
    const { token } = useCurrentUser();
    const { fetchUserProfilePicture } = useFetchUsers();
    const { friends, friendsDispatch, currentFriend } = useFriendsContext();

    const isUserFriend = useCallback((user: any) => {
        if (friends && friends.length && user) {
            return (friends.find((u: any) => u.id === user.id))
        }
        return (false);
    }, [friends])

    const isUserFriendByUsername = useCallback((user: any) => {
        if (friends && friends.length && user) {
            return (friends.find((u: any) => u.username === user.username))
        }
        return (false);
    }, [friends])


    const updateFriend = useCallback(async (friend: any) => {
        if (friends && friend) {
            if (!friend.url) {
                const url = await fetchUserProfilePicture(friend.id);
                friend.url = url;
            }
            friendsDispatch({ type: 'updateFriend', friend })
        }
    }, [friends])


    const removeFriend = useCallback((friend: any) => {
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