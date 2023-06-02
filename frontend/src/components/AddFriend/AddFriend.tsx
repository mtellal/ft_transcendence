import React from "react";
import { useSelector } from "react-redux";
import { BackApi } from "../../api/back";
import { RootState } from "../../store";
import s from './style.module.css'

export function AddFriend( { addFriend }: { addFriend: () => Promise<void> } ) {

	const selector = useSelector((store: RootState) => store.user.user);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const users = (await BackApi.getAllUsers()).data;

        for (let user of users) {
            if (user.username === e.currentTarget.friend.value) {
                const response = await BackApi.sendFriendRequest(user.id, selector.token);
				addFriend();
                if (response.status === 201) {
                    break ;
                }
            }
        }
    }

    return (
        <div className={s.container}>
            <form className={s.form} onSubmit={handleSubmit}>
                <input className={s.input} type="text" placeholder="Username" name="friend"/>
                <button className={s.button} type="submit">Add Friend</button>
            </form>
        </div>
    );
}