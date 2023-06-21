import { useEffect } from "react";
import { useChannelsContext, useChatSocket, useCurrentUser, useFriendsContext } from "../../../hooks/Hooks";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";
import { useFriendRequest } from "../../../hooks/Chat/Friends/useFriendRequest";
import { useChannels } from "../../../hooks/Chat/useChannels";

export default function FriendEvents({ children }: any) {
    const { socket } = useChatSocket();
    const { userSocket } = useCurrentUser();


    const { friends, currentFriend } = useFriendsContext();
    const { removeFriend, isUserFriend, updateFriend } = useFriends();
    const { addFriendRequest } = useFriendRequest();

    const { channels } = useChannelsContext();
    const { getChannelFromFriendName, leaveChannel } = useChannels();

    useEffect(() => {
        if (socket && userSocket) {

            socket.on('receivedRequest', (request: any) => {
                console.log("REQUEST FRIEND EVENT => ", request)
                addFriendRequest(request)
            })

            socket.on('addedFriend', (friend: any) => {
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

            socket.on('removedFriend', (friend: any) => {
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
            if (socket) {
                socket.off('receivedRequest');
                socket.off('addedFriend');
                socket.off('removedFriend');
            }
        }
    }, [socket, friends, currentFriend, channels, userSocket])

    return (children)
}