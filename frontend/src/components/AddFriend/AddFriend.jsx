import { BackApi } from "../../api/back";
import s from './style.module.css'

export function AddFriend( { id, addFriend } ) {

    async function handleSubmit(e) {
        e.preventDefault();
        const users = (await BackApi.getAllUsers()).data;

        for (let user of users) {
            if (user.username === e.target.friend.value) {
                const response = await BackApi.addFriend(id, user.id);
				addFriend(user.id);
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