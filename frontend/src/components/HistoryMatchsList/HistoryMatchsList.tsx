import React, { useEffect, useState } from "react";
import { getUser } from "../../requests/user";
import s from './style.module.css'

interface HistoryMatchsListProps {
	match: any;
}

export function HistoryMatchsList({ match }: HistoryMatchsListProps) {

	const [userA, setUserA] = useState<any>();
	const [userB, setUserB] = useState<any>();

	async function getInfoUsers() {
		console.log(match.player1Id, match.player2Id);
		const dataUserA = await getUser(match.player1Id);
		setUserA(dataUserA.data);
		const dataUserB = await getUser(match.player2Id);
		setUserB(dataUserB.data);
		// Ici, charger les avatar de chacun des 2 users
	}

	useEffect(() => {
		getInfoUsers();
	}, [])

	// createdAt: "2023-06-16T11:13:11.538Z",
	// gametype: "SPEEDUP",
	// id: 22,
	// player1Id: 2,
	// player1Score: 7,
	// player2Id: 1,
	// player2Score: 1,
	// status: "FINISHED",
	// wonBy: 2

	if (!userA || !userB) {
		return ;
	}

	return (
		<div className={s.container}
		style={{
			backgroundColor: match.wonBy === match.player1Id ? '#DCFFD4' : '#FFD4D4'
		}}
		>
			<p
			>{userA.username} {match.player1Score} - {userB.username} {match.player2Score}</p>
		</div>
	);
}