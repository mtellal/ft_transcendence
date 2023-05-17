import { FriendsList } from "../FriendsList/FriendsList";
import s from './style.module.css'

export function Friends( {friends} ) {
    return (
        <div>
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