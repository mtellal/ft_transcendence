import React, { useCallback, useEffect, useState } from "react";
import { getLadder } from "../../requests/user";
import s from './style.module.css'
import { LadderList } from "../../components/LadderList/LadderList";
import { useCurrentUser } from "../../hooks/Hooks";

export function Ladder() {

	const { token } = useCurrentUser();
	const [ladder, setLadder] = useState(null);

	const getData = useCallback(async () => {
		const rep = await getLadder(token);
		setLadder(rep.data);
	}, [token]);

	useEffect(() => {
		getData();
	}, [getData])

	if (!ladder) {
		return;
	}

	return (
		<div className={s.container}>
			<h1 className={s.title}>Ladder</h1>
			<div className={s.list}>
				{ladder.map((user: any, index: number) => {
					return (
						<LadderList key={user.id} user={user} index={index} />
					);
				})}
			</div>
		</div>
	);
}