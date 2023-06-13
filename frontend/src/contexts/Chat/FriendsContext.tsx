import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { isEqual } from "../../utils";
import { useChatSocket, useCurrentUser } from "../../hooks/Hooks";
import { getFriendList, removeUserFriend } from "../../requests/friends";
import { getUserProfilePictrue } from '../../requests/user'
import { useNavigate } from "react-router-dom";
import { getUserInvitations } from "../../requests/friendsRequest";
import useFetchUsers from "../../hooks/useFetchUsers";

export const FriendsContext: React.Context<any> = createContext([]);

function fromatFriend(friend: any) {
    return (
        {
            ...friend,
            notifs: 0,
        }
    )
}

function reducer(friends: any, action: any) {
    switch (action.type) {
        case ('setFriendList'): {
            if (action.friendList && action.friendList.length) {
                const nfriends = action.friendList.map((f: any) => fromatFriend(f))
                return (isEqual(friends, nfriends) ? friends : nfriends)
            }
            else return (friends);
        }
        case ('updateFriend'): {
            if (friends.length && action.friend &&
                friends.find((u: any) => u.id === action.friend.id)) {
                return (friends.map((f: any) => f.id === action.friend.id ? action.friend : f))
            }
            else
                return ([...friends, fromatFriend(action.friend)]);
        }
        case ('removeFriend'): {
            if (friends.length)
                return (friends.filter((u: any) => u.id !== action.friend.id))
            return (friends);
        }
        case ('addNotif'): {
            if (friends.length)
                return (
                    friends.map((f: any) => {
                        if (f.id === action.friendId) {
                            if (!f.notifs)
                                f.notifs = 1;
                            else
                                f.notifs += 1;
                        }
                        return (f)
                    })
                )
            else
                return (friends);
        }
        case ('removeNotif'): {
            friends.map((f: any) => {
                if (action.friend.id === f.id && f.notifs)
                    f.notifs = 0;
                return (f);
            });
        }
        default: return (friends);
    }
}


type TFriendRequest = {
    id: number,
    sendBy: number,
    status: boolean,
    userId: number,
    createdAt: string
}


export function FriendsProvider({ children }: any) {

    const navigate = useNavigate();

    const { user, token }: any = useCurrentUser();
    const { socket } = useChatSocket();
    const { fetchUsers, fetchUserProfilePicture } = useFetchUsers();

    const [friends, friendsDispatch]: any = useReducer(reducer, []);
    const [currentFriend, setCurrentFriendLocal]: any = useState();
    const [friendInvitations, setFriendInvitations]: [TFriendRequest[], any] = useState([]);

    async function loadFriendList() {
        if (user.friendList) {
            let friendList = await fetchUsers(user.friendList);
            if (friendList && friendList.length) {
                friendList = friendList.sort((a: any, b: any) => a.username > b.username ? 1 : -1);
                friendsDispatch({ type: 'setFriendList', friendList })
            }
        }
    }

    useEffect(() => {
        if (user) {
            loadFriendList();
            loadInvitations();
        }
    }, [user])


    /////////////////////////////////////////////////////////////////////////
    //                U P D A T E      C U R R E N T  F R I E N D          //
    /////////////////////////////////////////////////////////////////////////

    function setCurrentFriend(friend: any) {
        const f = friends.find((f: any) => friend.id === f.id);
        if (f)
            setCurrentFriendLocal(f);
    }

    useEffect(() => {
        if (friends && friends.length) {
            if (currentFriend)
                setCurrentFriend(currentFriend)
        }
    }, [friends])


    /////////////////////////////////////////////////////////////////////////
    //                              S O C K E T                            //
    /////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        if (socket) {

            socket.on('receivedRequest', (request: any) => {
                console.log("EVENT RECIEVED REQUEST => ", request)
                if (request) {
                    setFriendInvitations((p: TFriendRequest[]) => [...p, request])
                }
            })

            socket.on('updatedUser', async (friend: any) => {
                console.log("UPDATE FRIEND EVENT => ", friend)
                if (friend) {
                    const url = await fetchUserProfilePicture(friend.id);
                    friendsDispatch({ type: 'updateFriend', friend: { ...friend, url } })
                }
            })

            socket.on('removedFriend', (friend: any) => {
                console.log("REMOVE FRIEND EVENT")
                if (friend && friend.id) {
                    removeUserFriend(friend.id, token);
                    friendsDispatch({ type: 'removeFriend', friend });
                    if (currentFriend && friend.id === currentFriend.id)
                        navigate("/chat")
                }
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


    /////////////////////////////////////////////////////////////////////////
    //                         I N V I T A T I O N S                       //
    /////////////////////////////////////////////////////////////////////////


    const loadInvitations = useCallback(async () => {
        getUserInvitations(user.id)
            .then(res => {
                if (res.status === 200 &&
                    res.statusText === "OK" && res.data.length) {
                    // setNotifInvitation(true);
                    console.log(res.data)
                    setFriendInvitations(res.data);
                }
            })

    }, [user])



    return (
        <FriendsContext.Provider value={{
            friends,
            friendsDispatch,
            currentFriend,
            setCurrentFriend,
            friendInvitations,
            setFriendInvitations,
        }}>
            {children}
        </FriendsContext.Provider>
    )
}