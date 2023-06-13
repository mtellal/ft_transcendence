import React, { useCallback } from "react";
import { useCurrentUser, useFriendsContext } from "../../Hooks";
import useFetchUsers from "../../useFetchUsers";
import { removeUserFriend } from "../../../requests/friends";
import { useNavigate } from "react-router-dom";

export function useFriends() {
    const navigate = useNavigate();
    const { token } = useCurrentUser();
    const { fetchUserProfilePicture } = useFetchUsers();
    const { friends, friendsDispatch, currentFriend } = useFriendsContext();

    /*
        add a friend if he doesn't exists, 
        or update his informations (name, status, profile picture ...)
    */
    const updateFriend = useCallback(async (friend: any) => {
        if (friends && friend) {
            if (!friend.url) {
                const url = await fetchUserProfilePicture(friend.id);
                friendsDispatch({ type: 'updateFriend', friend: { ...friend, url } })
            }
            else
                friendsDispatch({ type: 'updateFriend', friend })
        }
    }, [friends])


    const removeFriend = useCallback((friend: any) => {
        if (friends && friends.length && friend) {
            removeUserFriend(friend.id, token);
            friendsDispatch({ type: 'removeFriend', friend })
            if (currentFriend && currentFriend.id === friend.id)
                navigate("/chat");
        }
    }, [friends, currentFriend])

    return (
        {
            updateFriend,
            removeFriend
        }
    )
}