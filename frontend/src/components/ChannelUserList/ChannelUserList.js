import React, { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import { useSelector } from "react-redux";
import { getSocket } from '../../utils/socket';
import s from './style.module.css';
export function ChannelUserList({ user, dataChannel }) {
    const [userInfo, setUserInfo] = useState(null);
    const [userAvatar, setUserAvatar] = useState();
    const [showActionUser, setShowActionUser] = useState(false);
    const [socket, setSocket] = useState(null);
    const selector = useSelector((store) => store.user.user);
    async function getUserInfos() {
        const rep = await BackApi.getUserInfoById(user);
        setUserInfo(rep.data);
        const response = await BackApi.getProfilePictureById(user);
        setUserAvatar(URL.createObjectURL(new Blob([response.data])));
    }
    function menuAdmin() {
        if (user === selector.id) {
            return false;
        }
        return dataChannel.administrators.includes(selector.id);
    }
    function userIsAdmin() {
        return dataChannel.administrators.includes(user);
    }
    function userIsBan() {
        return dataChannel.banList.includes(user);
    }
    function actionFriend() {
        setShowActionUser(!showActionUser);
    }
    function eventSocket(event) {
        socket.emit(event, {
            channelId: dataChannel.id,
            userId: user
        });
    }
    function muteUser() {
        socket.emit('muteUser', {
            channelId: dataChannel.id,
            userId: user,
            duration: 10
        });
    }
    useEffect(() => {
        getUserInfos();
        setSocket(getSocket());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    /* A ajouter:
     leaveChannel
     unmuteUser
     updateChannel (pour le nom du chan)
     
     Pouvoir modifier le temps du mute */
    return (React.createElement("div", { className: s.container, onMouseEnter: actionFriend, onMouseLeave: actionFriend },
        userAvatar &&
            React.createElement("img", { className: s.image, src: userAvatar, alt: "ProfilePicture", style: { opacity: showActionUser && menuAdmin() ? '0.3' : '1' } }),
        userInfo && userInfo.username,
        showActionUser && menuAdmin() && (React.createElement("ul", { className: s.menu },
            !userIsBan() && React.createElement("li", { onClick: () => eventSocket('banUser') }, "Ban user"),
            userIsBan() && React.createElement("li", { onClick: () => eventSocket('unbanUser') }, "Unban user"),
            React.createElement("li", { onClick: () => eventSocket('kickUser') }, "Kick user"),
            !userIsAdmin() && React.createElement("li", { onClick: () => eventSocket('makeAdmin') }, "Set admin"),
            userIsAdmin() && React.createElement("li", { onClick: () => eventSocket('removeAdmin') }, "Remove admin"),
            React.createElement("li", { onClick: muteUser }, "Mute user")))));
}
