import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import s from './style.module.css'

export function FriendRequestList({ friendId }) {

	const [infoUser, setInfoUser] = useState();
	const [avatar, setAvatar] = useState();

	async function getInfosUser() {
		const response = await BackApi.getUserInfoById(friendId);
		setInfoUser(response.data);
	}

	async function getAvatar() {
		const response = await BackApi.getProfilePictureById(friendId);
		setAvatar(URL.createObjectURL(new Blob([response.data])));
	}

	useEffect(() => {
		getInfosUser();
		getAvatar();
	}, [])

	console.log('ok');

	return (
		<div className={s.container}>
			<img
				className={s.image}
				src={avatar}
				alt="profilePicture"
			/>
			{infoUser && infoUser.username}
		</div>
	);
}