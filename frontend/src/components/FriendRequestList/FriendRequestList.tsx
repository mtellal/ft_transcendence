import React from "react";
import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import cross from '../../assets/cross.png'
import check from '../../assets/check.png'
import s from './style.module.css'
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface FriendRequestListProps {
	friendId: number;
	requestId: number;
	listFriendRequest: any;
	setFriendRequest: any;
}

export function FriendRequestList({ friendId, requestId, listFriendRequest, setFriendRequest }: FriendRequestListProps) {

	const [infoUser, setInfoUser] = useState<any>();
	const [avatar, setAvatar] = useState<string>();
	const [isLoading, setIsLoading] = useState(true);
	const [onAvatar, setOnAvatar] = useState(false);
	const selector = useSelector((store: RootState) => store.user.user);

	function showActionsFriendRequest() {
		setOnAvatar(!onAvatar)
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

	function removeListFriendRequestById(requestId: number) {
		let ret = listFriendRequest.filter((objet: any) => objet['id'] !== requestId);
		setFriendRequest(ret);
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
				style={{opacity: onAvatar ? '0.3' : '1'}}
			/>
			{ onAvatar && (
				<div>
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
				</div>
			)}
			{infoUser && infoUser.username}
		</div>
	);
}