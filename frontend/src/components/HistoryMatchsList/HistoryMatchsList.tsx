import React, { useEffect, useState } from "react";
import { getUser, getUserProfilePictrue } from "../../requests/user";
import s from './style.module.css'
import { useCurrentUser } from "../../hooks/Hooks";

interface HistoryMatchsListProps {
	match: any;
	id: number;
}

export function HistoryMatchsList({ match, id }: HistoryMatchsListProps) {

	const { token } = useCurrentUser();
	const [userA, setUserA] = useState<any>();
	const [avatarA, setAvatarA] = useState<any>();
	const [userB, setUserB] = useState<any>();
	const [avatarB, setAvatarB] = useState<any>();

	async function getInfoUsers() {
		const dataUserA = await getUser(match.player1Id, token);
		setUserA(dataUserA.data);
		const dataUserB = await getUser(match.player2Id, token);
		setUserB(dataUserB.data);
		const ppA = await getUserProfilePictrue(match.player1Id, token);
		setAvatarA(window.URL.createObjectURL(new Blob([ppA.data])));
		const ppB = await getUserProfilePictrue(match.player2Id, token);
		setAvatarB(window.URL.createObjectURL(new Blob([ppB.data])));
	}

	useEffect(() => {
		getInfoUsers();
	}, [])

	if (!userA || !userB || !avatarA || !avatarB) {
		return ;
	}

	return (
		<div className={s.container}
		style={{
			backgroundColor: match.wonBy === id ? '#DCFFD4' : '#FFD4D4'
		}}
		>
			<img className={s.image} src={avatarA}/>
			<p>{userA.username} {match.player1Score} - {userB.username} {match.player2Score}</p>
			<img className={s.image} src={avatarB}/>
		</div>
	);
}