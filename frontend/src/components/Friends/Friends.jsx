import { useState } from "react";
import { BackApi } from "../../api/back";
import { FriendsList } from "../FriendsList/FriendsList";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import s from './style.module.css'

export function Friends( {friends} ) {
    console.log('FRIENDS');

    const navigate = useNavigate();
    const selector = useSelector(store => store.USER.user);

    return (
        <div>
            <div>Friends of {selector.username}</div>
            <button onClick={() => navigate('/profile')}>Profile</button>
            <div className={s.list}>
                {friends.map((friend) => {
                    return (
                        <span key={friend.id}>
                            <FriendsList friend={friend} />
                        </span>
                    );
                })}
            </div>
        </div>
    );
}