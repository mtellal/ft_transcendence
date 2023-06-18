import React, { useEffect, useState } from "react";
import { getUser } from "../../requests/user";
import s from './style.module.css'

interface HistoryMatchsListProps {
	match: any;
	id: number;
}

export function HistoryMatchsList({ match, id }: HistoryMatchsListProps) {

	const [userA, setUserA] = useState<any>();
	const [userB, setUserB] = useState<any>();

	async function getInfoUsers() {
		const dataUserA = await getUser(match.player1Id);
		setUserA(dataUserA.data);
		const dataUserB = await getUser(match.player2Id);
		setUserB(dataUserB.data);
		// Ici, charger les avatar de chacun des 2 users
	}

	useEffect(() => {
		getInfoUsers();
	}, [])

	if (!userA || !userB) {
		return ;
	}

	return (
		<div className={s.container}
		style={{
			backgroundColor: match.wonBy === id ? '#DCFFD4' : '#FFD4D4'
		}}
		>
			<p>{userA.username} {match.player1Score} - {userB.username} {match.player2Score}</p>
		</div>
	);
}