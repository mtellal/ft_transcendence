import React from "react";
import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import { useSelector } from "react-redux";
import s from './style.module.css';
export function FriendsList({ friend, delFriend, setIdFriendSelected }) {
    const [ProfilePicture, setProfilePicture] = useState();
    const [showActionFriend, setShowActionFriend] = useState(false);
    const selector = useSelector((store) => store.user.user);
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
                const response = await BackApi.removeFriend(user.id, selector.token);
                delFriend(user.id);
                if (response.status === 201) {
                    break;
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
    return (React.createElement("div", { className: s.container, onMouseEnter: actionFriend, onMouseLeave: actionFriend },
        ProfilePicture &&
            React.createElement("img", { className: s.image, src: ProfilePicture, alt: "ProfilePicture", style: { opacity: showActionFriend ? '0.3' : '1' } }),
        friend.username,
        showActionFriend && (React.createElement("ul", { className: s.menu },
            React.createElement("li", { onClick: removeFriend }, "Remove friend"),
            React.createElement("li", null, "Play game"),
            React.createElement("li", { onClick: () => setIdFriendSelected(friend.id) }, "Chat")))));
}
