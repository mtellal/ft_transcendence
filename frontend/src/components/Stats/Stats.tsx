import React, { useEffect, useState } from "react";
import s from './style.module.css'
import { getStats } from "../../requests/user";

interface UserProfileProps {
	id: number;
}

export function Stats({ id }: UserProfileProps) {

	const [stats, setStats] = useState(null);

	async function getUserStats() {
		const rep = await getStats(id)
		setStats(rep.data);
	}

	useEffect(() => {
		getUserStats();
	}, [])

	if (!stats) {
		return ;
	}

	return (
		<div className={s.container} >
			<h1>Statistics</h1>
			<ul>
				<li>Elo: {stats['eloRating']}</li>
				<li>Matches played: {stats['matchesPlayed']}</li>
				<li>Matches won: {stats['matchesWon']}</li>
				<li>Matches lost: {stats['matchesLost']}</li>
				<li>Goals scored: {stats['goalsScored']}</li>
				<li>Goals taken: {stats['goalsTaken']}</li>
				<li>Win streak: {stats['winStreak']}</li>
				<li>Loss streak: {stats['lossStreak']}</li>
			</ul>
		</div>
	);
}