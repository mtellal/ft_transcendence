import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import s from './style.module.css'

export function FriendsList( {friend} ) {
    console.log('FRIENDS LIST', friend.id);

    const [ProfilePicture, setProfilePicture] = useState();

    async function getAvatar() {
        let rep = await BackApi.getProfilePictureById(friend.id);
        setProfilePicture(URL.createObjectURL(new Blob([rep.data])));
    }

    useEffect(() => {
        getAvatar();
    }, []);

    return (
        <div className={s.container}>
            {ProfilePicture && <img className={s.image} src={ProfilePicture} alt="ProfilePicture" />}
            {friend.username}
            {/* <img src={() => getAvatar()} /> */}
        </div>
    );
}