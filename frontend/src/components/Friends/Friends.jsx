import { useState } from "react";
import { BackApi } from "../../api/back";
import { FriendsList } from "../FriendsList/FriendsList";
import s from './style.module.css'

export function Friends( {friends} ) {

    // const [friends, setFriends] = useState([]);

    // async function getFriends() {
    //     const response = await BackApi.getFriendsById(id);

    //     if (response.status === 200) {
    //         console.log('Friend list OK')
    //         setFriends(response.data);
    //         console.log(friends);
    //     } else {
    //         console.log('Friend list NOT OK')
    //     }
    // }

    // getFriends();
    // console.log('OK');
    console.log('FRIENDS ',  friends);

    return (
        <div>
            <div>My friends</div>
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