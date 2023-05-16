import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import s from './style.module.css'

export function FriendsList( {friend} ) {
    // console.log('FRIENDS LIST', friend.id);

    const [ProfilePicture, setProfilePicture] = useState();
    const [showActionFriend, setShowActionFriend] = useState(false);

    async function getAvatar() {
        let rep = await BackApi.getProfilePictureById(friend.id);
        setProfilePicture(URL.createObjectURL(new Blob([rep.data])));
    }

    function actionFriend() {
        console.log('CLICK Friend ID', friend.id);
        setShowActionFriend(!showActionFriend);
    }

    useEffect(() => {
        console.log('Friend ID', friend.id);
        getAvatar();
    }, []);

    return (
        // <div className={s.container} onMouseEnter={actionFriend} onMouseLeave={actionFriend}>
        <div className={s.container} >
            {ProfilePicture && <img className={s.image} src={ProfilePicture} alt="ProfilePicture" />}
            {friend.username}
            {showActionFriend && (
                    <ul className={s.menu}>
                        <li>Remove friend</li>
                        <li>Play game</li>
                    </ul>
            )}
        </div>
    );
}