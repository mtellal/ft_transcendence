import React from "react";
import { FriendsList } from "../FriendsList/FriendsList";
import s from './style.module.css';
export function Friends({ friends, delFriend, setIdFriendSelected }) {
    if (friends.length === 0) {
        return (React.createElement("div", null, "Pas d'amis a afficher"));
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: s.list }, friends.map((friend) => {
            return (React.createElement("span", { key: friend.id },
                React.createElement(FriendsList, { friend: friend, delFriend: delFriend, setIdFriendSelected: setIdFriendSelected })));
        }))));
}
