import React from "react";
import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import cross from '../../assets/cross.png';
import check from '../../assets/check.png';
import s from './style.module.css';
import { useSelector } from "react-redux";
export function FriendRequestList({ friendId, requestId, listFriendRequest, setFriendRequest }) {
    const [infoUser, setInfoUser] = useState();
    const [avatar, setAvatar] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [onAvatar, setOnAvatar] = useState(false);
    const selector = useSelector((store) => store.user.user);
    function showActionsFriendRequest() {
        setOnAvatar(!onAvatar);
    }
    async function getInfosUser() {
        const response = await BackApi.getUserInfoById(friendId);
        setInfoUser(response.data);
    }
    async function getAvatar() {
        const response = await BackApi.getProfilePictureById(friendId);
        setAvatar(URL.createObjectURL(new Blob([response.data])));
    }
    async function acceptFriendRequest() {
        await BackApi.acceptFriendRequest(requestId, selector.token);
        removeListFriendRequestById(requestId);
    }
    async function removeFriendRequest() {
        await BackApi.removeFriendRequest(requestId, selector.token);
        removeListFriendRequestById(requestId);
    }
    function removeListFriendRequestById(requestId) {
        let ret = listFriendRequest.filter((objet) => objet['id'] !== requestId);
        setFriendRequest(ret);
        console.log('ret', ret);
    }
    useEffect(() => {
        async function fetchData() {
            await Promise.all([getInfosUser(), getAvatar()]);
            setIsLoading(false);
        }
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    console.log('Component FriendRequest LIST');
    if (isLoading || !infoUser || !avatar) {
        return (React.createElement("div", null));
    }
    return (React.createElement("div", { className: s.container, onMouseEnter: showActionsFriendRequest, onMouseLeave: showActionsFriendRequest },
        React.createElement("img", { className: s.image, src: avatar, alt: "profilePicture", style: { opacity: onAvatar ? '0.3' : '1' } }),
        onAvatar && (React.createElement("div", null,
            React.createElement("img", { src: check, alt: "cross", className: s.check, onClick: acceptFriendRequest }),
            React.createElement("img", { src: cross, alt: "cross", className: s.cross, onClick: removeFriendRequest }))),
        infoUser && infoUser.username));
}
