import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import s from './style.module.css'
import { useSelector } from "react-redux";

export function FriendsList( { friend, delFriend, setIdFriendSelected } ) {

    const [ProfilePicture, setProfilePicture] = useState();
    const [showActionFriend, setShowActionFriend] = useState(false);
    const selector = useSelector(store => store.USER.user);

    async function getAvatar() {
        let rep = await BackApi.getProfilePictureById(friend.id);
        setProfilePicture(URL.createObjectURL(new Blob([rep.data])));
    }

    function actionFriend() {
        setShowActionFriend(!showActionFriend);
    }

	async function removeFriend() {

        const users = (await BackApi.getAllUsers()).data;

        for (let user of users) {
            if (user.username === friend.username) {
                const response = await BackApi.removeFriend(selector.id, user.id);
				delFriend(user.id);
                if (response.status === 201) {
                    break ;
                }
            }
        }
	}

    useEffect(() => {
		if (friend.id) {
			getAvatar();
		}
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
            <div className={s.container} onMouseEnter={actionFriend} onMouseLeave={actionFriend}>
                {ProfilePicture &&
                    <img
                        className={s.image}
                        src={ProfilePicture}
                        alt="ProfilePicture"
                        style={{opacity: showActionFriend ? '0.3' : '1'}}
                    />}
            {friend.username}
            {showActionFriend && (
                    <ul className={s.menu}>
                        <li onClick={removeFriend}>Remove friend</li>
                        <li>Play game</li>
                        <li onClick={() => setIdFriendSelected(friend.id)}>Chat</li>
                    </ul>
            )}
        </div>
    );
}