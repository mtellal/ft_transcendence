import { useEffect } from "react";
import { useChatSocket, useFriendsContext } from "../../../hooks/Hooks";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";
import { useFriendRequest } from "../../../hooks/Chat/Friends/useFriendRequest";

export default function FriendEvents({ children }: any) {
    const { socket } = useChatSocket();

    const { friends, currentFriend } = useFriendsContext();
    const { updateFriend, removeFriend } = useFriends();
    const { addFriendRequest } = useFriendRequest();

    useEffect(() => {
        if (socket) {

            socket.on('receivedRequest', (request: any) => {
                // console.log("REQUEST FRIEND EVENT => ", request)
                addFriendRequest(request)
            })

            socket.on('updatedUser', async (friend: any) => {
                // console.log("UPDATE FRIEND EVENT => ", friend)
                updateFriend(friend)
            })

            socket.on('removedFriend', (friend: any) => {
                // console.log("REMOVE FRIEND EVENT")
                removeFriend(friend);
            })
        }
        return () => {
            if (socket) {
                socket.off('receivedRequest');
                socket.off('updatedUser');
                socket.off('removedFriend');
            }
        }
    }, [socket, friends, currentFriend])

    return (children)
}