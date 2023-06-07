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

	// console.log('TEST', user)

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

	function userIsAdmin() {
		if (user === selector.id) {
			return false;
		}
		return dataChannel.administrators.includes(selector.id);
	}

	function actionFriend() {
		setShowActionUser(!showActionUser);
	}

	function kickUser() {
		console.log('kick User');
		// console.log('idChannelSelected', idChannelSelected);
		console.log('userId', user);
		console.log('dataChannel.id', dataChannel.id);
		socket.emit('kickUser', {
			channelId: dataChannel.id,
			userId: user
		})
	}

	// useEffect(() => {
	// 	if (selector.id && socket) {
	// 		socket.on('message', messageListener);
	// 		return () => {
	// 			socket.off('message', messageListener)
	// 		}
	// 	}
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [selector.id, socket])

	useEffect(() => {
		getUserInfos();
		setSocket(getSocket());
	}, [])

	// console.log('data', dataChannel);

	return (
		<div className={s.container} onMouseEnter={actionFriend} onMouseLeave={actionFriend}>
			{userAvatar &&
				<img
					className={s.image}
					src={userAvatar}
					alt="ProfilePicture"
					style={{ opacity: showActionUser && userIsAdmin() ? '0.3' : '1' }}
				/>
			}
			{userInfo && userInfo.username}
			{ showActionUser && userIsAdmin() && (
				<ul className={s.menu}>
					<li onClick={kickUser}>Kick user</li>
					<li>Set admin</li>
				</ul>
			)}
		</div>
	);
}