import { useEffect } from "react";
import { useCurrentUser, useFriendsContext } from "../../../hooks/Hooks";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";
import { useFriendRequest } from "../../../hooks/Chat/Friends/useFriendRequest";

export default function FriendEvents({ children }: any) {
    const { userSocket } = useCurrentUser();

    const { friends } = useFriendsContext();
    const { removeFriend, isUserFriend, updateFriend } = useFriends();
    const { addFriendRequest } = useFriendRequest();

    useEffect(() => {
        if (userSocket) {

            userSocket.on('receivedRequest', (request: any) => {
                addFriendRequest(request)
            })

            userSocket.on('addedFriend', (friend: any) => {
                if (friend && !isUserFriend(friend))
                {
                    updateFriend(friend);
                }
            })

            userSocket.on('updatedFriend', (friend: any) => {
                if (friend)
                    updateFriend(friend);
            })

            userSocket.on('removedFriend', (friend: any) => {
                if (friend)
                {
                    removeFriend(friend, false);
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
    }, [userSocket, friends, userSocket])

    return (children)
}