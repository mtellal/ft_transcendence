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
	}

	useEffect(() => {
		getInfoUser();
	}, [])

	if (!history) {
		return ;
	}

	console.log(history);

	if (history.length === 0) {
		return (
			<div className={s.container}>
				<h1 className={s.title}>History matchs</h1>
				<div className={s.noMatchs}>
					The player has not played any matches
				</div>
			</div>
		);
	}

	return (
		<div className={s.container}>
			<h1 className={s.title}>History matchs</h1>
			<div className={s.list}>
				{history.map((match: any) => {
					if (match.status === 'FINISHED') {
						return (
							<div key={match.id}>
							<HistoryMatchsList match={match} id={id} />
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
