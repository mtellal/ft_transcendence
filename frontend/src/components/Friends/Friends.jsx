import { FriendsList } from "../FriendsList/FriendsList";
import s from './style.module.css'

export function Friends( { friends, delFriend } ) {
    return (
        <div>
            <div className={s.list}>
                {friends.map((friend) => {
                    return (
                        <span key={friend.id}>
                            <FriendsList friend={friend} delFriend={delFriend}/>
                        </span>
                    );
                })}
            </div>
        </div>
    );
}