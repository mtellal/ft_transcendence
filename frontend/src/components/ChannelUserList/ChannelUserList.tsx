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
	const [muteInput, setMuteInput] = useState(false);
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

	function userIsOwner() {
		return user === dataChannel.ownerId;
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

	function muteUser(e: any) {

		e.preventDefault();
		socket.emit('muteUser', {
			channelId: dataChannel.id,
			userId: user,
			duration: Number(e.currentTarget.mute.value)
		})
	}

	useEffect(() => {
		getUserInfos();
		setSocket(getSocket());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	/* A ajouter:
	 unmuteUser
	 updateChannel (pour le nom du chan)
	*/

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
					{!userIsOwner() && !userIsBan() && <li onClick={() => eventSocket('banUser')}>Ban user</li>}
					{userIsBan() && <li onClick={() => eventSocket('unbanUser')}>Unban user</li>}
					{!userIsOwner() && <li onClick={() => eventSocket('kickUser')}>Kick user</li>}
					{!userIsAdmin() && <li onClick={() => eventSocket('makeAdmin')}>Set admin</li>}
					{!userIsOwner() && userIsAdmin() && <li onClick={() => eventSocket('removeAdmin')}>Remove admin</li>}
					{!userIsOwner() && <li onClick={() => setMuteInput(!muteInput)}>Mute user</li>}
					{muteInput &&
					<form onSubmit={muteUser}>
						<input placeholder="Time mute" type="number" name="mute"></input>
						<button type="submit">Mute</button>
					</form>}
				</ul>
			)}
		</div>
	);
}