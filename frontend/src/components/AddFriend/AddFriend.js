import React from "react";
import { useSelector } from "react-redux";
import { BackApi } from "../../api/back";
import s from './style.module.css';
export function AddFriend({ addFriend }) {
    const selector = useSelector((store) => store.user.user);
    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const friendUsername = formData.get('friend');
        const users = (await BackApi.getAllUsers()).data;
        for (let user of users) {
            if (user.username === friendUsername) {
                const response = await BackApi.sendFriendRequest(user.id, selector.token);
                addFriend();
                if (response.status === 201) {
                    break;
                }
            }
        }
    }
    return (React.createElement("div", { className: s.container },
        React.createElement("form", { className: s.form, onSubmit: handleSubmit },
            React.createElement("input", { className: s.input, type: "text", placeholder: "Username", name: "friend" }),
            React.createElement("button", { className: s.button, type: "submit" }, "Add Friend"))));
}
