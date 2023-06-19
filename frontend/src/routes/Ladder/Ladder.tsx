import React, { useEffect, useState } from "react";
import { getLadder } from "../../requests/user";
import s from './style.module.css'
import { LadderList } from "../../components/LadderList/LadderList";

export function Ladder() {

	const [ladder, setLadder] = useState(null);

	async function getData() {
		const rep = await getLadder();
		setLadder(rep.data);
	}

	useEffect(() => {
		getData();
	}, [])

	if (!ladder) {
		return ;
	}

	console.log(ladder);

	return (
		<div className={s.container}>
			<h1 className={s.title}>Ladder</h1>
			<div className={s.list}>
				{ladder.map((user: any) => {
					return (
						<div key={user.id}>
							<LadderList user={user} />
						</div>
					);
				})}
			</div>
		</div>
	);
}