import React, { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { initializeSocket, getSocket } from '../../utils/socket';
import s from './style.module.css';

interface ChannelUserListProps {
	user: any;
	dataChannel: any;
}

export function ChannelUserList({ user, dataChannel }: ChannelUserListProps) {

	const [userInfo, setUserInfo] = useState(null);
	const [userAvatar, setUserAvatar] = useState<any>();
    const [showActionUser, setShowActionUser] = useState(false);
	const [socket, setSocket] = useState<any>(null);
	const selector = useSelector((store: RootState) => store.user.user);



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

	function eventSocket(event: string) {
		socket.emit(event, {
			channelId: dataChannel.id,
			userId: user
		})
	}

	function muteUser() {
		socket.emit('muteUser', {
			channelId: dataChannel.id,
			userId: user,
			duration: 10
		})
	}

	useEffect(() => {
		getUserInfos();
		setSocket(getSocket());
	}, [])

	// console.log('data', dataChannel);

	/* A ajouter:
	 leaveChannel
	 unmuteUser
	 updateChannel (pour le nom du chan) 
	 
	 Pouvoir modifier le temps du mute */

	return (
		<div className={s.container} onMouseEnter={actionFriend} onMouseLeave={actionFriend}>
			{userAvatar &&
				<img
					className={s.image}
					src={userAvatar}
					alt="ProfilePicture"
					style={{ opacity: showActionUser && menuAdmin() ? '0.3' : '1' }}
				/>
			}
			{userInfo && userInfo.username}
			{ showActionUser && menuAdmin() && (
				<ul className={s.menu}>
					{!userIsBan() && <li onClick={() => eventSocket('banUser')}>Ban user</li>}
					{userIsBan() && <li onClick={() => eventSocket('unbanUser')}>Unban user</li>}
					<li onClick={() => eventSocket('kickUser')}>Kick user</li>
					{!userIsAdmin() && <li onClick={() => eventSocket('makeAdmin')}>Set admin</li>}
					{userIsAdmin() && <li onClick={() => eventSocket('removeAdmin')}>Remove admin</li>}
					{<li onClick={muteUser}>Mute user</li>}
				</ul>
			)}
		</div>
	);
}