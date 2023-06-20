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
			<h1 className={s.title}>Statistics</h1>
			<ul className={s.ul}>
				<li className={s.li}>Elo: {stats['eloRating']}</li>
				<li className={s.li}>Matches played: {stats['matchesPlayed']}</li>
				<li className={s.li}>Matches won: {stats['matchesWon']}</li>
				<li className={s.li}>Matches lost: {stats['matchesLost']}</li>
				<li className={s.li}>Goals scored: {stats['goalsScored']}</li>
				<li className={s.li}>Goals taken: {stats['goalsTaken']}</li>
				<li className={s.li}>Win streak: {stats['winStreak']}</li>
				<li className={s.li}>Loss streak: {stats['lossStreak']}</li>
			</ul>
		</div>
	);
}