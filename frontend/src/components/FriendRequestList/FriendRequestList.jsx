import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import cross from '../../assets/cross.png'
import check from '../../assets/check.png'
import s from './style.module.css'
import { useSelector } from "react-redux";

export function FriendRequestList({ friendId, requestId }) {

	const [infoUser, setInfoUser] = useState();
	const [avatar, setAvatar] = useState();
	const [isLoading, setIsLoading] = useState(true);
	const selector = useSelector(store => store.USER.user);

	async function getInfosUser() {
		const response = await BackApi.getUserInfoById(friendId);
		setInfoUser(response.data);
	}

	async function getAvatar() {
		const response = await BackApi.getProfilePictureById(friendId);
		setAvatar(URL.createObjectURL(new Blob([response.data])));
	}

	async function acceptFriendRequest() {
		const response = await BackApi.acceptFriendRequest(requestId, selector.token)
	}

	async function removeFriendRequest() {
		const response = await BackApi.removeFriendRequest(requestId, selector.token)
	}

	useEffect(() => {
		async function fetchData() {
			await Promise.all([getInfosUser(), getAvatar()]);
			setIsLoading(false);
		}
		fetchData();
	}, [])

	console.log('Component FriendRequest LIST');

	if (isLoading || !infoUser || !avatar) {
		return (
			<div></div>
		);
	}

	return (
		<div className={s.container}>
			<img
				className={s.image}
				src={avatar}
				alt="profilePicture"
			/>
				<img
					src={check}
					alt="cross"
					className={s.check}
					onClick={acceptFriendRequest}
				/>
			<img
				src={cross}
				alt="cross"
				className={s.cross}
				onClick={removeFriendRequest}
			/>
			{infoUser && infoUser.username}
		</div>
	);
}