import React from "react";
import { FriendsList } from "../FriendsList/FriendsList";
import s from './style.module.css'

interface FriendsProps {
	friends: any;
	delFriend: any;
	setIdFriendSelected: any;
}

export function Friends( { friends, delFriend, setIdFriendSelected }: FriendsProps) {

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