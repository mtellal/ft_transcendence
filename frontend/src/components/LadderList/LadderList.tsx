import React, { useEffect, useState } from "react";
import { getUser, getUserProfilePictrue } from "../../requests/user";
import s from './style.module.css'

interface LadderListProps {
	user: any;
}

export function LadderList({ user }: LadderListProps) {

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

	console.log('user', user);

	return (
		<div className={s.container}>
			<img className={s.image} src={avatar}/>
			<p className={s.name}>{dataUser.username} </p>
			<p className={s.elo}>Elo: {user.stats.eloRating}</p>
		</div>
	);
}