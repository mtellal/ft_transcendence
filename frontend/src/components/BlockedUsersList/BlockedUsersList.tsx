import React, { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import s from './style.module.css'
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface BlockedUsersListProps {
	idUserBlocked: any;
	listBlockUsers: any;
	setListBlockUsers: any;
}

export function BlockedUsersList({idUserBlocked, listBlockUsers, setListBlockUsers}: BlockedUsersListProps) {

	const [infoUser, setInfoUser] = useState<any>();
	const [avatar, setAvatar] = useState<string>();
	const [isLoading, setIsLoading] = useState(true);
	const [onAvatar, setOnAvatar] = useState(false);
	const selector = useSelector((store: RootState) => store.user.user);

	function showActionsFriendRequest() {
		setOnAvatar(!onAvatar)
	}

	async function getInfosUser() {
		const response = await BackApi.getUserInfoById(idUserBlocked);
		setInfoUser(response.data);
	}

	async function getAvatar() {
		const response = await BackApi.getProfilePictureById(idUserBlocked);
		setAvatar(URL.createObjectURL(new Blob([response.data])));
	}

	async function unblockUser() {
		await BackApi.unblockUserById(idUserBlocked, selector.token);

		let ret = listBlockUsers.filter((objet: any) => objet['blockedId'] !== idUserBlocked);
		setListBlockUsers(ret);

		// let ret = listFriendRequest.filter((objet: any) => objet['id'] !== requestId);
		// setFriendRequest(ret);
	}

	useEffect(() => {
		async function fetchData() {
			await Promise.all([getInfosUser(), getAvatar()]);
			setIsLoading(false);
		}
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (isLoading || !infoUser || !avatar) {
		return (
			<div></div>
		);
	}

	return (
		<div className={s.container} onMouseEnter={showActionsFriendRequest} onMouseLeave={showActionsFriendRequest}>
			<img
				className={s.image}
				src={avatar}
				alt="profilePicture"
				style={{ opacity: onAvatar ? '0.3' : '1' }}
			/>
			{onAvatar && (
				<button onClick={unblockUser}>Unblock</button>
			)}
			{infoUser && infoUser.username}
		</div>
	);
}