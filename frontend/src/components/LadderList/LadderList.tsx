import React, { useEffect, useState } from "react";
import { getUser, getUserProfilePictrue } from "../../requests/user";
import first from "../../assets/first.png"
import second from "../../assets/second.png"
import third from "../../assets/third.png"
import s from './style.module.css'

interface LadderListProps {
	user: any;
	index: number;
}

export function LadderList({ user, index }: LadderListProps) {

	const [dataUser, setDataUser] = useState<any>();
	const [avatar, setAvatar] = useState<any>();

	async function getInfoUsers() {
		const dataUserA = await getUser(user.id);
		setDataUser(dataUserA.data);
		const ppA = await getUserProfilePictrue(user.id);
		setAvatar(window.URL.createObjectURL(new Blob([ppA.data])));
	}

	useEffect(() => {
		getInfoUsers();
	}, [])

	if (!dataUser || !avatar) {
		return ;
	}

	return (
		<div className={s.container}>
			{index === 0 && <img src={first} className={s.image} />}
			{index === 1 && <img src={second} className={s.image} />}
			{index === 2 && <img src={third} className={s.image} />}
			<img className={s.image} src={avatar}/>
			<p className={s.name}>{dataUser.username} </p>
			<p className={s.elo}>Elo: {user.stats.eloRating}</p>
		</div>
	);
}