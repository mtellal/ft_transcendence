import React, { useEffect, useState } from "react";
import s from './style.module.css'
import { getMatchHistory } from "../../requests/user";
import { HistoryMatchsList } from "../HistoryMatchsList/HistoryMatchsList";

interface UserProfileProps {
	id: number;
}

export function HistoryMatchs({ id }: UserProfileProps) {

	const [history, setHistory] = useState<any>();


	async function getInfoUser() {
		// const dataHistory = await getMatchHistory(id);
		// console.log('dataHistory', dataHistory.data);
		// setHistory(dataHistory.data);


		const tmp = [
			{
				createdAt: "2023-06-16T11:13:11.538Z",
				gametype: "SPEEDUP",
				id: 22,
				player1Id: 2,
				player1Score: 7,
				player2Id: 1,
				player2Score: 1,
				status: "FINISHED",
				wonBy: 2
			},
			{
				createdAt: "2023-06-16T11:13:11.538Z",
				gametype: "SPEEDUP",
				id: 23,
				player1Id: 1,
				player1Score: 11,
				player2Id: 2,
				player2Score: 72,
				status: "FINISHED",
				wonBy: 2
			},
			{
				createdAt: "2023-06-16T11:13:11.538Z",
				gametype: "SPEEDUP",
				id: 24,
				player1Id: 1,
				player1Score: 11,
				player2Id: 2,
				player2Score: 72,
				status: "FINISHED",
				wonBy: 2
			},
			{
				createdAt: "2023-06-16T11:13:11.538Z",
				gametype: "SPEEDUP",
				id: 25,
				player1Id: 1,
				player1Score: 11,
				player2Id: 2,
				player2Score: 72,
				status: "FINISHED",
				wonBy: 2
			},
			{
				createdAt: "2023-06-16T11:13:11.538Z",
				gametype: "SPEEDUP",
				id: 25,
				player1Id: 1,
				player1Score: 11,
				player2Id: 2,
				player2Score: 72,
				status: "FINISHED",
				wonBy: 2
			},
			{
				createdAt: "2023-06-16T11:13:11.538Z",
				gametype: "SPEEDUP",
				id: 25,
				player1Id: 1,
				player1Score: 11,
				player2Id: 2,
				player2Score: 72,
				status: "FINISHED",
				wonBy: 2
			},
		]
		setHistory(tmp);
	}

	useEffect(() => {
		getInfoUser();
	}, [])

	if (!history) {
		return ;
	}

	return (
		<div className={s.container}>
			<div className={s.title}>History matchs</div>
			<div className={s.list}>
				{history.map((match: any) => {
					return (
						<div key={match.id}>
							<HistoryMatchsList match={match} />
						</div>
					);
				})}
			</div>
		</div>
	);
}