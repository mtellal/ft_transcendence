import React, { useEffect, useState } from "react";
import s from './style.module.css'
import { getMatchHistory } from "../../requests/user";
import { HistoryMatchsList } from "../HistoryMatchsList/HistoryMatchsList";

interface UserProfileProps {
	id: number;
}

export function HistoryMatchs({ id }: UserProfileProps) {

	const [history, setHistory] = useState<any>(null);


	async function getInfoUser() {
		const dataHistory = await getMatchHistory(id);
		setHistory(dataHistory.data);


		// const tmp = [
		// 	{
		// 		createdAt: "2023-06-16T11:13:11.538Z",
		// 		gametype: "SPEEDUP",
		// 		id: 22,
		// 		player1Id: 2,
		// 		player1Score: 7,
		// 		player2Id: 1,
		// 		player2Score: 1,
		// 		status: "FINISHED",
		// 		wonBy: 2
		// 	},
		// 	{
		// 		createdAt: "2023-06-16T11:13:11.538Z",
		// 		gametype: "SPEEDUP",
		// 		id: 23,
		// 		player1Id: 1,
		// 		player1Score: 11,
		// 		player2Id: 2,
		// 		player2Score: 72,
		// 		status: "FINISHED",
		// 		wonBy: 2
		// 	},
		// 	{
		// 		createdAt: "2023-06-16T11:13:11.538Z",
		// 		gametype: "SPEEDUP",
		// 		id: 24,
		// 		player1Id: 1,
		// 		player1Score: 11,
		// 		player2Id: 2,
		// 		player2Score: 72,
		// 		status: "FINISHED",
		// 		wonBy: 2
		// 	},
		// 	{
		// 		createdAt: "2023-06-16T11:13:11.538Z",
		// 		gametype: "SPEEDUP",
		// 		id: 25,
		// 		player1Id: 1,
		// 		player1Score: 11,
		// 		player2Id: 2,
		// 		player2Score: 72,
		// 		status: "FINISHED",
		// 		wonBy: 2
		// 	},
		// 	{
		// 		createdAt: "2023-06-16T11:13:11.538Z",
		// 		gametype: "SPEEDUP",
		// 		id: 26,
		// 		player1Id: 1,
		// 		player1Score: 11,
		// 		player2Id: 2,
		// 		player2Score: 72,
		// 		status: "FINISHED",
		// 		wonBy: 2
		// 	},
		// 	{
		// 		createdAt: "2023-06-16T11:13:11.538Z",
		// 		gametype: "SPEEDUP",
		// 		id: 27,
		// 		player1Id: 1,
		// 		player1Score: 11,
		// 		player2Id: 2,
		// 		player2Score: 72,
		// 		status: "FINISHED",
		// 		wonBy: 2
		// 	},
		// ]
		// setHistory(tmp);
	}

	useEffect(() => {
		getInfoUser();
	}, [])

	if (!history) {
		return ;
	}

	return (
		<div className={s.container}>
			<h1 className={s.title}>History matchs</h1>
			<div className={s.list}>
				{history.map((match: any) => {
					if (match.status === 'FINISHED') {
						return (
							<div key={match.id}>
							<HistoryMatchsList match={match} />
						</div>
						);
					} else {
						return ;
					}
				})}
			</div>
		</div>
	);
}
