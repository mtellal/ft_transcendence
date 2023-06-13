import React, { useEffect, useState } from "react";
import { FriendsList } from "../FriendsList/FriendsList";
import s from './style.module.css'
import { getSocket } from "../../utils/socket";
import { BackApi } from "../../api/back";

interface FriendsProps {
	// friends: any;
	// delFriend: any;
    id: any;
	setIdFriendSelected: any;
}

export function Friends( {id, setIdFriendSelected }: FriendsProps) {

	const [socket, setSocket] = useState(null);
	const [friends, setFriends] = useState([]);

    function delFriend(delFriendId: number) {
		const updatedFriends = friends.filter((friend) => friend.id !== delFriendId);
		setFriends(updatedFriends);
	}

    async function getFriends() {
		const response = await BackApi.getFriendsById(id);
		if (response.status === 200) {
			if (response.data.length > 0 && friends !== response.data) {
				setFriends(response.data);
			}
		}
	}

    function removedFriend(e: any) {
        getFriends();
    }

    function updatedUser(e: any) {
        getFriends();
    }

    useEffect(() => {
        setSocket(getSocket());
        getFriends();
    }, [])

    useEffect(() => {
        if (socket) {
			socket.on('removedFriend', removedFriend);
			socket.on('updatedUser', updatedUser);
        }
    }, [socket])

	if (friends.length === 0){
		return (
			<div>
				Pas d'amis a afficher
			</div>
		);
	}

    return (
        <div>
            <div className={s.list}>
                {friends.map((friend: any) => {
                    return (
                        <span key={friend.id}>
                            <FriendsList friend={friend} delFriend={delFriend} setIdFriendSelected={setIdFriendSelected}/>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}