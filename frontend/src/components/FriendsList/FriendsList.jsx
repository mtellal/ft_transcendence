import { useState } from "react";
import { BackApi } from "../../api/back";

export function FriendsList( {friend} ) {

    const [ProfilePicture, setProfilePicture] = useState();

    async function getAvatar() {
        let rep = await BackApi.getProfilePictureById(friend.id);
        setProfilePicture(URL.createObjectURL(new Blob([rep.data])));
        // return URL.createObjectURL(new Blob([rep.data]));
    }

    getAvatar();
    // console.log(friend.avatar);
    return (
        <div>
            <img src={ProfilePicture} />
            {/* <img src={() => getAvatar()} /> */}
        </div>
    );
}