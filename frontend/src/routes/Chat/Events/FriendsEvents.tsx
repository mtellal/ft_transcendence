import { useEffect } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser, useFriendsContext } from "../../../hooks/Hooks";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";
import { useFriendRequest } from "../../../hooks/Chat/Friends/useFriendRequest";
import { useChannels } from "../../../hooks/Chat/useChannels";

export default function FriendEvents({ children }: any) {
    const { userSocket } = useCurrentUser();

    const { friends, currentFriend } = useFriendsContext();
    const { removeFriend, isUserFriend, updateFriend } = useFriends();
    const { addFriendRequest } = useFriendRequest();

    useEffect(() => {
        if (userSocket) {

            userSocket.on('receivedRequest', (request: any) => {
                console.log("REQUEST FRIEND EVENT => ", request)
                addFriendRequest(request)
            })

            userSocket.on('addedFriend', (friend: any) => {
                console.log("ADDED FRIEND EVENT => ")
                if (friend && !isUserFriend(friend))
                {
                    updateFriend(friend);
                }
            })

            userSocket.on('updatedFriend', (friend: any) => {
                console.log("UPDATED FRIEND EVENT => ")
                if (friend)
                    updateFriend(friend);
            })

            userSocket.on('removedFriend', (friend: any) => {
                console.log("REMOVE FRIEND EVENT")
                if (friend)
                {
                    removeFriend(friend);
                }
            })
        }

        return () => {
            if (userSocket)
            {
                userSocket.off('updatedFriend')
            }
            if (userSocket) {
                userSocket.off('receivedRequest');
                userSocket.off('addedFriend');
                userSocket.off('removedFriend');
            }
        }
    }, [userSocket, friends, currentFriend, userSocket])

    return (children)
}